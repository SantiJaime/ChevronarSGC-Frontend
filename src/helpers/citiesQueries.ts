import { URL } from "../constants/const";
import { refreshAccessToken } from "./authQueries";

interface CreateCityResponse {
  city: City;
  msg: string;
}

export const getCities = async () => {
  const response = await fetch(`${URL}/cities`);
  if (!response.ok) {
    const error: ErrorMessage = await response.json();
    throw error;
  }
  const res = await response.json();

  return res;
};

export const createCity = async (city: City): Promise<CreateCityResponse> => {
  const response = await fetch(`${URL}/cities`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(city),
    credentials: "include",
  });
  if (response.status === 401) {
    await refreshAccessToken();
    return createCity(city);
  }
  if (!response.ok) {
    const error: ErrorMessage = await response.json();
    throw error;
  }
  return await response.json();
};
