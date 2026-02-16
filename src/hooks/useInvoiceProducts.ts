import { useContext } from "react";
import { InvoiceProductsContext } from "../context/InvoiceProductsContext";

const useInvoiceProducts = () => {
  const context = useContext(InvoiceProductsContext);
  if (!context) {
    throw new Error("El contexto de productos no está definido");
  }
  return context;
};

export default useInvoiceProducts;
