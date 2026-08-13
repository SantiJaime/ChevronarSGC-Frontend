import { type ReactNode, useState } from "react";
import { SalesContext } from "../SalesContext";

interface Props {
  children: ReactNode;
}

const SalesProvider: React.FC<Props> = ({ children }) => {
  const [sales, setSales] = useState<FullSaleWithPayments[]>([]);

  return (
    <SalesContext.Provider value={{ sales, setSales }}>
      {children}
    </SalesContext.Provider>
  );
};

export default SalesProvider;
