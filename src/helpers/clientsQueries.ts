import { URL } from "../constants/const";
import { refreshAccessToken } from "./authQueries";

interface GetClientResponse {
  clients: Client[];
  msg: string;
}
interface CreateClientResponse {
  client: Client;
  msg: string;
}

export const getClients = async (): Promise<GetClientResponse> => {
  const response = await fetch(`${URL}/clients`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (response.status === 401) {
    await refreshAccessToken();
    return getClients();
  }
  if (!response.ok) {
    const error: ErrorMessage = await response.json();
    throw error.msg;
  }
  return await response.json();
};


export const createClient = async (
  client: Client
): Promise<CreateClientResponse> => {
  const response = await fetch(`${URL}/clients`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(client),
    credentials: "include",
  });
  if (response.status === 401) {
    await refreshAccessToken();
    return createClient(client);
  }

  if (!response.ok) {
    const error: ErrorMessage = await response.json();
    if (error.error.includes("E11000")) {
      error.error =
        "El documento ingresado ya se encuentra asociado a un cliente";
    }
    throw error;
  }

  return await response.json();
};
