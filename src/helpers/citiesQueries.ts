import { apiRequest } from "./authQueries";

interface GetCitiesResponse {
  cities: City[];
  msg: string;
}

interface CreateCityResponse {
  city: City;
  msg: string;
}

export const getCities = (): Promise<GetCitiesResponse> => apiRequest("/cities");

export const createCity = (city: City): Promise<CreateCityResponse> =>
  apiRequest("/cities", { method: "POST", data: city });
