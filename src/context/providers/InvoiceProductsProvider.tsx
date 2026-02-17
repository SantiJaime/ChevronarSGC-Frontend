import { useState } from 'react';
import { InvoiceProductsContext } from '../InvoiceProductsContext';

interface Props {
  children: JSX.Element;
}

const InvoiceProductsProvider: React.FC<Props> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  
  return (
    <InvoiceProductsContext.Provider value={{ products, setProducts }}>
      {children}
    </InvoiceProductsContext.Provider>
  );
};

export default InvoiceProductsProvider;
