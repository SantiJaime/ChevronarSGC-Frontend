import { URL } from "../constants/const";

export const getCities = async () => {
  const response = await fetch(`${URL}/cities`);
  if (!response.ok) {
    const error: ErrorMessage = await response.json();
    throw error;
  }
  const res = await response.json();

  return res;
};

export const createCity = async (city: City, token: string) => {
  const response = await fetch(`${URL}/cities`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(city),
  });
  if (!response.ok) {
    const error: ErrorMessage = await response.json();
    throw error;
  }
  const res = await response.json();
  return res;
};
