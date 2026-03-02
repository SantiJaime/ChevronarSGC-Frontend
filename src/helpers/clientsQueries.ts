import { URL } from "../constants/const";
import { fetchWithAuth } from "./authQueries";

interface GetClientResponse {
  clients: Client[];
  msg: string;
}
interface CreateClientResponse {
  client: Client;
  msg: string;
}

export const getClients = async (): Promise<GetClientResponse> => {
  const response = await fetchWithAuth(`${URL}/clients`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (!response.ok) {
    const error: ErrorMessage = await response.json();
    throw error.msg;
  }
  return await response.json();
};


export const createClient = async (
  client: Client
): Promise<CreateClientResponse> => {
  const response = await fetchWithAuth(`${URL}/clients`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(client),
    credentials: "include",
  });

  if (!response.ok) {
    const error: ErrorMessage = await response.json();
    
    if (typeof error.error === "string" && error.error.includes("E11000")) {
      error.error =
        "El documento ingresado ya se encuentra asociado a un cliente";
    }
    throw error;
  }

  return await response.json();
};
