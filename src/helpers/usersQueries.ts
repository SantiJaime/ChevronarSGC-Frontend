import { api } from "./axiosClient";
import { toApiError } from "./authQueries";

export const loginUser = async (payload: UserLogin): Promise<LoginUserResponse> => {
  try {
    const { data } = await api.post<LoginUserResponse>("/users/login", payload);
    return data;
  } catch (error) {
    throw toApiError(error);
  }
};
