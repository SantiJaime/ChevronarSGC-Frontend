import { type ReactNode, useEffect, useState, useMemo } from "react";
import { getClients } from "../../helpers/clientsQueries";
import { ClientContext } from "../ClientContext";
import useSession from "../../hooks/useSession";

interface Props {
  children: ReactNode;
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

  const value = useMemo(() => ({ clients, setClients }), [clients]);

  return (
    <ClientContext.Provider value={value}>
      {children}
    </ClientContext.Provider>
  );
};

export default ClientProvider;
