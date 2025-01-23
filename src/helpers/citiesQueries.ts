import { URL } from "../constants/const";

export const getCities = async () => {
  try {
    const response = await fetch(`${URL}/cities`);
    if (!response.ok) {
      const error: ErrorMessage = await response.json();
      throw error.msg;
    }
    const res = await response.json();

    return res;
  } catch (error) {
    if (error instanceof Error) {
      throw error.message;
    }
  }
};

export const createCity = async (city: City, token: string) => {
  try {
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
      throw error.msg;
    }
    const res = await response.json();
    return res;
  } catch (error) {
    if (error instanceof Error) {
      throw error.message;
    }
  }
};
