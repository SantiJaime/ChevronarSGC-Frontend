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