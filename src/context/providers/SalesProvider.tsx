import { type ReactNode, useState, useMemo } from "react";
import { SalesContext } from "../SalesContext";

interface Props {
  children: ReactNode;
}

const SalesProvider: React.FC<Props> = ({ children }) => {
  const [sales, setSales] = useState<FullSaleWithPayments[]>([]);

  const value = useMemo(() => ({ sales, setSales }), [sales]);

  return (
    <SalesContext.Provider value={value}>
      {children}
    </SalesContext.Provider>
  );
};

export default SalesProvider;
