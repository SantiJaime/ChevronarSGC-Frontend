import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";
import { api } from "./axiosClient";

const SESSION_EXPIRED_MESSAGE =
  "Tu sesión expiró. Por favor, iniciá sesión nuevamente";

const CONNECTION_ERROR_MESSAGE =
  "No se pudo conectar con el servidor. Revisá tu conexión a internet";

// ---------------------------------------------------------------------------
// Aviso de sesión vencida: el SessionProvider se suscribe para cerrar la sesión
// ---------------------------------------------------------------------------
type SessionExpiredListener = () => void;
const sessionExpiredListeners = new Set<SessionExpiredListener>();

export const onSessionExpired = (listener: SessionExpiredListener) => {
  sessionExpiredListeners.add(listener);
  return () => {
    sessionExpiredListeners.delete(listener);
  };
};

const notifySessionExpired = () => {
  sessionExpiredListeners.forEach((listener) => listener());
};

// ---------------------------------------------------------------------------
// Errores con el mismo formato que devuelve el backend ({ status, error })
// ---------------------------------------------------------------------------
const toErrorMessage = (error: string): ErrorMessage => ({
  status: "fail",
  error,
});

const hasStatus = (error: unknown, ...statuses: number[]): boolean =>
  axios.isAxiosError(error) &&
  error.response !== undefined &&
  statuses.includes(error.response.status);

// Si el servidor no responde JSON (por ejemplo, un 502 del proxy durante un deploy)
// se devuelve un error legible en lugar del cuerpo crudo
export const toApiError = (error: unknown): ErrorMessage => {
  if (!axios.isAxiosError(error) || !error.response) {
    return toErrorMessage(CONNECTION_ERROR_MESSAGE);
  }

  const body = error.response.data as Partial<ErrorMessage> | null;
  if (body?.error) {
    return { status: body.status ?? "fail", error: body.error };
  }
  return toErrorMessage(
    `El servidor no respondió correctamente (código ${error.response.status}). Intentá nuevamente en unos minutos`,
  );
};

// ---------------------------------------------------------------------------
// Renovación de sesión: una sola a la vez, compartida por todos los pedidos
// ---------------------------------------------------------------------------
let refreshInFlight: Promise<boolean> | null = null;

const refreshSession = (): Promise<boolean> => {
  if (!refreshInFlight) {
    refreshInFlight = api
      .post("/users/refresh-token")
      .then(() => true)
      .catch(() => false)
      .finally(() => {
        refreshInFlight = null;
      });
  }
  return refreshInFlight;
};

// Hace el pedido con las cookies de sesión. Ante un 401 renueva la sesión una vez
// y reintenta; si no se puede renovar, propaga el 401 original
const requestWithRefresh = async <T>(
  config: AxiosRequestConfig,
): Promise<AxiosResponse<T>> => {
  try {
    return await api.request<T>(config);
  } catch (error) {
    if (!hasStatus(error, 401) || !(await refreshSession())) throw error;
  }
  return api.request<T>(config);
};

// Pedido autenticado que devuelve el JSON de la respuesta o lanza un ErrorMessage.
// Si la sesión no se puede renovar, avisa que expiró
export const apiRequest = async <T>(
  url: string,
  config: AxiosRequestConfig = {},
): Promise<T> => {
  try {
    const { data } = await requestWithRefresh<T>({ ...config, url });
    return data;
  } catch (error) {
    if (hasStatus(error, 401)) {
      notifySessionExpired();
      throw toErrorMessage(SESSION_EXPIRED_MESSAGE);
    }
    throw toApiError(error);
  }
};

// ---------------------------------------------------------------------------
// Sesión
// ---------------------------------------------------------------------------
export const fetchCurrentUser = async (): Promise<UserInfo | null> => {
  try {
    const { data } = await requestWithRefresh<MeResponse | null>({ url: "/users/me" });
    return data?.user ?? null;
  } catch (error) {
    if (hasStatus(error, 401, 403)) return null;
    throw toApiError(error);
  }
};

export const logoutUser = async (): Promise<void> => {
  await apiRequest("/users/logout", { method: "POST" });
};
