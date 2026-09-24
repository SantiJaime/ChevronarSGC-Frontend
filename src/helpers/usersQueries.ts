import { URL } from "../constants/const";

export const loginUser = async (payload: UserLogin): Promise<LoginUserResponse> => {
  let response: Response;
  try {
    response = await fetch(`${URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      credentials: "include",
    });
  } catch {
    throw { status: "fail", error: "No se pudo conectar con el servidor. Revisá tu conexión a internet" };
  }

  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw body?.error
      ? body
      : { status: "fail", error: `El servidor no respondió correctamente (código ${response.status})` };
  }
  return body;
};
