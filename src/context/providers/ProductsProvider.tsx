import { useEffect, useState } from "react";
import { ProductsContext } from "../ProductsContext";
import useSession from "../../hooks/useSession";
import { getAllProducts } from "../../helpers/productsQueries";

interface Props {
  children: JSX.Element;
}

const ProductsProvider: React.FC<Props> = ({ children }) => {
  const [productsInDb, setProductsInDb] = useState<ProductInDb[]>([]);
  const [loading, setLoading] = useState(false);
  const { session } = useSession();

  useEffect(() => {
    if (!session) return;
    setLoading(true);
    getAllProducts()
      .then((res) => setProductsInDb(res.products))
      .catch((err) => console.error("Error al obtener los productos:", err))
      .finally(() => setLoading(false));
  }, [session]);

  return (
    <ProductsContext.Provider value={{ productsInDb, setProductsInDb, loading, setLoading }}>
      {children}
    </ProductsContext.Provider>
  );
};

export default ProductsProvider;
