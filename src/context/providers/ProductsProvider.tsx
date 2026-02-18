import { useEffect, useState, useMemo, useCallback } from "react";
import { ProductsContext } from "../ProductsContext";
import useSession from "../../hooks/useSession";
import { getAllProducts } from "../../helpers/productsQueries";
import { normalizeText } from "../../constants/const";
import { toast } from "sonner";

interface Props {
  children: JSX.Element;
}

interface PreparedProduct {
  original: ProductInDb;
  searchString: string;
}

const ProductsProvider: React.FC<Props> = ({ children }) => {
  const [productsInDb, setProductsInDb] = useState<ProductInDb[]>([]);
  const [loading, setLoading] = useState(false);
  const { session } = useSession();

  const preparedProducts = useMemo<PreparedProduct[]>(() => {
    return productsInDb.map((product) => ({
      original: product,
      searchString: normalizeText(
        `${product.productName} ${product.productId}`,
      ),
    }));
  }, [productsInDb]);

  const searchProducts = useCallback(
    (term: string): ProductInDb[] => {
      if (!term || term.trim().length < 3) return [];

      const searchTerms = normalizeText(term).split(/\s+/).filter(Boolean);

      return preparedProducts
        .filter((item) => {
          return searchTerms.every((t) => item.searchString.includes(t));
        })
        .map((item) => item.original);
    },
    [preparedProducts],
  );

  const handleGetProducts = useCallback(
    async (reload?: boolean) => {
      try {
        if (!session) return;
        setLoading(true);
        const res = await getAllProducts();
        setProductsInDb(res.products);

        if (reload) toast.success("Productos recargados exitosamente");
      } catch (error) {
        const err = error as { error: string };
        toast.error(err.error || "Error al recargar los productos");
        console.error("Error al obtener los productos:", error);
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setProductsInDb, session],
  );

  useEffect(() => {
    handleGetProducts();
  }, [handleGetProducts]);

  return (
    <ProductsContext.Provider
      value={{
        productsInDb,
        setProductsInDb,
        loading,
        setLoading,
        searchProducts,
        handleGetProducts,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

export default ProductsProvider;
