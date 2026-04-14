import { URL } from '../constants/const';

const fetchMe = () =>
  fetch(`${URL}/users/me`, {
    method: "GET",
    credentials: "include",
  });

const parseUserFromMeResponse = async (
  response: Response,
): Promise<UserInfo | null> => {
  const data: MeResponse | UserInfo = await response.json();
  if ("user" in data && data.user) {
    return data.user;
  }
  if ("username" in data && "role" in data) {
    return data as UserInfo;
  }
  return null;
};

export const refreshAccessToken = async () => {
  const response = await fetch(`${URL}/users/refresh-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    const error: ErrorMessage = await response.json();
    throw error;
  }

  await response.json();
  return true;
};

export const fetchCurrentUser = async (): Promise<UserInfo | null> => {
  let response = await fetchMe();

  if (response.status === 401) {
    try {
      await refreshAccessToken();
      response = await fetchMe();
    } catch {
      return null;
    }
  }

  if (response.status === 401 || response.status === 403) {
    return null;
  }

  if (!response.ok) {
    return null;
  }

  return parseUserFromMeResponse(response);
};

export const fetchWithAuth = async (
  url: string,
  options: RequestInit = {},
  maxRetries: number = 3 
): Promise<Response> => {
  let attempts = 0;

  while (attempts < maxRetries) {
    const response = await fetch(url, options);

    if (response.status === 401) {
      attempts++;
      
      if (attempts >= maxRetries) {
        throw new Error("Sesión expirada tras múltiples intentos de conexión.");
      }

      try {
        await refreshAccessToken();
        continue;
      } catch (error) {
        console.error("Error al renovar la sesión:", error);
        throw new Error("No se pudo renovar la sesión. Inicie sesión nuevamente.");
      }
    }

    return response;
  }

  throw new Error("Límite de intentos alcanzado.");
};

export const logoutUser = async () => {
  const response = await fetch(`${URL}/users/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    const error: ErrorMessage = await response.json();
    throw error;
  }

  await response.json();
};