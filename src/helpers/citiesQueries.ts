import { URL } from "../constants/const";
import { apiRequest } from "./authQueries";

interface GetCitiesResponse {
  cities: City[];
  msg: string;
}

interface CreateCityResponse {
  city: City;
  msg: string;
}

export const getCities = (): Promise<GetCitiesResponse> =>
  apiRequest(`${URL}/cities`);

export const createCity = (city: City): Promise<CreateCityResponse> =>
  apiRequest(`${URL}/cities`, {
    method: "POST",
    body: JSON.stringify(city),
  });
