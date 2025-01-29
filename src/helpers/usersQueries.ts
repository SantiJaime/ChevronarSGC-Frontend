import { URL } from "../constants/const";

export const loginUser = async (payload: UserLogin) => {
  const response = await fetch(`${URL}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    credentials: "include",
  });
  if (!response.ok) {
    const error: ErrorMessage = await response.json();
    throw error;
  }
  const res = await response.json();
  return res;
};
