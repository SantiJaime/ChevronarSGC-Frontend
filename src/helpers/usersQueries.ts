import { URL } from "../constants/const";

export const loginUser = async (payload: UserLogin) => {
  const response = await fetch(`${URL}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const error: ErrorMessage = await response.json();
    throw error;
  }
  const res = await response.json();
  return res;
};

export const checkAuth = async (token: string) => {
  const response = await fetch(`${URL}/users/verify-token`, {
    method: "POST",
    body: JSON.stringify({ token }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    const error: ErrorMessage = await response.json();
    throw error;
  }
  const res = await response.json();
  return res;
};
