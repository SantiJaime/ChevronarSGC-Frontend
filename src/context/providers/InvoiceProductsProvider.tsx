import { type ReactNode, useState, useMemo } from 'react';
import { InvoiceProductsContext } from '../InvoiceProductsContext';

interface Props {
  children: ReactNode;
}

const InvoiceProductsProvider: React.FC<Props> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  
  const value = useMemo(() => ({ products, setProducts }), [products]);

  return (
    <InvoiceProductsContext.Provider value={value}>
      {children}
    </InvoiceProductsContext.Provider>
  );
};

export default InvoiceProductsProvider;
