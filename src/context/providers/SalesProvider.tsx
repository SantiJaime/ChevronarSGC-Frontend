import { type ReactNode, useState, useMemo, useContext, useEffect } from "react";
import { SessionContext } from "../SessionContext";
import { SalesContext } from "../SalesContext";

interface Props {
  children: ReactNode;
}

const SalesProvider: React.FC<Props> = ({ children }) => {
  const [sales, setSales] = useState<FullSaleWithPayments[]>([]);
  const session = useContext(SessionContext)?.session;

  // Al cerrar sesión se descarta el listado del usuario anterior
  useEffect(() => {
    if (!session) setSales([]);
  }, [session]);

  const value = useMemo(() => ({ sales, setSales }), [sales]);

  return (
    <SalesContext.Provider value={value}>
      {children}
    </SalesContext.Provider>
  );
};

export default SalesProvider;
