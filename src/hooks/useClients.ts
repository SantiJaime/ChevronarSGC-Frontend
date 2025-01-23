import { useContext } from "react";
import { ClientContext } from '../context/ClientContext';

const useClients = () => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error("El contexto de clientes no está definido");
  }
  return context;
};

export default useClients;
