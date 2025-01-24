import { URL } from "../constants/const";

export const getClients = async (token: string) => {
  try {
    const response = await fetch(`${URL}/clients`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const error: ErrorMessage = await response.json();
      throw error.msg;
    }
    const res = await response.json();
    return res;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
  }
};

export const createClient = async (client: Client, token: string) => {
  const response = await fetch(`${URL}/clients`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(client),
  });
  if (!response.ok) {
    const error: ErrorMessage = await response.json();
    throw error;
  }
  const res = await response.json();
  return res;
};
