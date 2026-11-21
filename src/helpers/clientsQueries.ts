import { apiRequest } from "./authQueries";

interface GetClientResponse {
  clients: Client[];
  msg: string;
}
interface CreateClientResponse {
  client: Client;
  msg: string;
}

export const getClients = (): Promise<GetClientResponse> => apiRequest("/clients");

// El backend ya devuelve un mensaje legible si el documento está repetido
export const createClient = (client: Client): Promise<CreateClientResponse> =>
  apiRequest("/clients", { method: "POST", data: client });

export const updateClient = (
  id: string,
  client: Omit<Client, "_id">,
): Promise<CreateClientResponse> =>
  apiRequest(`/clients/${encodeURIComponent(id)}`, { method: "PUT", data: client });
