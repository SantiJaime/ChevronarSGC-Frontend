import { URL } from '../constants/const';

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

export const fetchWithAuth = async (
  url: string,
  options: RequestInit = {},
  maxRetries: number = 5 
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
  sessionStorage.removeItem("session");
}