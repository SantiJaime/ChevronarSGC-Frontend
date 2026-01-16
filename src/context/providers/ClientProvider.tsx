import { useEffect, useState } from "react";
import { getClients } from "../../helpers/clientsQueries";
import { ClientContext } from "../ClientContext";
import useSession from "../../hooks/useSession";

interface Props {
  children: JSX.Element;
}
const ClientProvider: React.FC<Props> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const { session } = useSession();

  useEffect(() => {
    if (!session) return;
    getClients()
      .then((res) => setClients(res.clients))
      .catch((err) => console.error("Error al obtener los clientes:", err));
  }, [session]);

  return (
    <ClientContext.Provider value={{ clients, setClients }}>
      {children}
    </ClientContext.Provider>
  );
};

export default ClientProvider;
