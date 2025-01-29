import { useEffect, useState } from "react";
import { getClients } from "../../helpers/clientsQueries";
import { ClientContext } from "../ClientContext";

interface Props {
  children: JSX.Element;
}
const ClientProvider: React.FC<Props> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    getClients()
      .then((res) => setClients(res.clients))
      .catch((err) => console.error("Error al obtener los clientes:", err));
  }, []);

  return (
    <ClientContext.Provider value={{ clients, setClients }}>
      {children}
    </ClientContext.Provider>
  );
};

export default ClientProvider;
