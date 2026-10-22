import axios from "axios";
import { URL } from "../constants/const";

// La autenticación viaja en cookies: withCredentials hace que el navegador
// las envíe (y guarde las que setea el backend) en todos los pedidos
export const api = axios.create({
  baseURL: URL,
  withCredentials: true,
});
