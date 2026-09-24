import { URL } from "../constants/const";

const SESSION_EXPIRED_MESSAGE =
  "Tu sesión expiró. Por favor, iniciá sesión nuevamente";

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

// Si el servidor no responde JSON (por ejemplo, un 502 del proxy durante un deploy)
// se devuelve un error legible en lugar de fallar al parsear
const parseJsonSafely = async (response: Response): Promise<unknown> => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

const buildResponseError = async (response: Response): Promise<ErrorMessage> => {
  const body = (await parseJsonSafely(response)) as Partial<ErrorMessage> | null;
  if (body?.error) {
    return { status: body.status ?? "fail", error: body.error };
  }
  return toErrorMessage(
    `El servidor no respondió correctamente (código ${response.status}). Intentá nuevamente en unos minutos`,
  );
};

// ---------------------------------------------------------------------------
// Renovación de sesión: una sola a la vez, compartida por todos los pedidos
// ---------------------------------------------------------------------------
let refreshInFlight: Promise<boolean> | null = null;

const refreshSession = (): Promise<boolean> => {
  if (!refreshInFlight) {
    refreshInFlight = fetch(`${URL}/users/refresh-token`, {
      method: "POST",
      credentials: "include",
    })
      .then((response) => response.ok)
      .catch(() => false)
      .finally(() => {
        refreshInFlight = null;
      });
  }
  return refreshInFlight;
};

// Hace el pedido con las cookies de sesión. Ante un 401 renueva la sesión una vez
// y reintenta; si no se puede renovar, avisa que la sesión expiró
export const fetchWithAuth = async (
  url: string,
  options: RequestInit = {},
): Promise<Response> => {
  const doFetch = () => fetch(url, { ...options, credentials: "include" });

  let response: Response;
  try {
    response = await doFetch();
  } catch {
    throw toErrorMessage("No se pudo conectar con el servidor. Revisá tu conexión a internet");
  }

  if (response.status !== 401) return response;

  const refreshed = await refreshSession();
  if (!refreshed) {
    notifySessionExpired();
    throw toErrorMessage(SESSION_EXPIRED_MESSAGE);
  }

  try {
    response = await doFetch();
  } catch {
    throw toErrorMessage("No se pudo conectar con el servidor. Revisá tu conexión a internet");
  }

  if (response.status === 401) {
    notifySessionExpired();
    throw toErrorMessage(SESSION_EXPIRED_MESSAGE);
  }

  return response;
};

// Pedido autenticado que devuelve el JSON de la respuesta o lanza un ErrorMessage
export const apiRequest = async <T>(
  url: string,
  options: RequestInit = {},
): Promise<T> => {
  const headers = options.body
    ? { "Content-Type": "application/json", ...options.headers }
    : options.headers;

  const response = await fetchWithAuth(url, { ...options, headers });

  if (!response.ok) {
    throw await buildResponseError(response);
  }

  return (await parseJsonSafely(response)) as T;
};

// ---------------------------------------------------------------------------
// Sesión
// ---------------------------------------------------------------------------
export const fetchCurrentUser = async (): Promise<UserInfo | null> => {
  const fetchMe = () =>
    fetch(`${URL}/users/me`, { method: "GET", credentials: "include" });

  let response = await fetchMe();

  if (response.status === 401) {
    const refreshed = await refreshSession();
    if (!refreshed) return null;
    response = await fetchMe();
  }

  if (response.status === 401 || response.status === 403) {
    return null;
  }

  if (!response.ok) {
    throw await buildResponseError(response);
  }

  const data = (await parseJsonSafely(response)) as MeResponse | null;
  return data?.user ?? null;
};

export const logoutUser = async (): Promise<void> => {
  await apiRequest(`${URL}/users/logout`, { method: "POST" });
};
