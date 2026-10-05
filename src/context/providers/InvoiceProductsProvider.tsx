import { type ReactNode, useState, useMemo, useContext, useEffect } from 'react';
import { SessionContext } from '../SessionContext';
import { InvoiceProductsContext } from '../InvoiceProductsContext';

interface Props {
  children: ReactNode;
}

const InvoiceProductsProvider: React.FC<Props> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const session = useContext(SessionContext)?.session;

  // Al cerrar sesión se descartan los productos cargados (PC compartida entre usuarios)
  useEffect(() => {
    if (!session) setProducts([]);
  }, [session]);
  
  const value = useMemo(() => ({ products, setProducts }), [products]);

  return (
    <InvoiceProductsContext.Provider value={value}>
      {children}
    </InvoiceProductsContext.Provider>
  );
};

export default InvoiceProductsProvider;
