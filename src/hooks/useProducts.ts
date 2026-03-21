import { useCallback, useState } from "react";
import { ICreateProduct } from "../utils/validationSchemas";
import {
  addBarcodeToProduct,
  createProduct,
  deleteProduct,
  editProduct,
  searchProducts,
} from "../helpers/productsQueries";
import { toast } from "sonner";

const useProducts = () => {
  const [loading, setLoading] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const handleSearchProducts = useCallback(
    async (search: string): Promise<ProductInDb[]> => {
      try {
        setLoadingProducts(true);
        const res = await searchProducts(search);
        return res.products;
      } catch (error) {
        console.error("Error al buscar productos:", error);
        const err = error as { error: string };
        toast.error(err.error);
        return [];
      } finally {
        setLoadingProducts(false);
      }
    },
    [setLoadingProducts],
  );

  const handleCreateProduct = async (
    data: ICreateProduct,
  ) => {
    try {
      setLoading(true);
      const res = await createProduct(data);
      toast.success(res.msg);
    } catch (error) {
      const err = error as { error: string };
      toast.error(err.error);
      console.error("Error al crear el producto:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = async (
    data: ProductInDb,
    resetForm: () => void,
    handleClose: () => void,
    onSuccess?: (product: ProductInDb) => void,
  ) => {
    try {
      setLoading(true);
      const res = await editProduct(data);
      toast.success(res.msg);
      onSuccess?.(res.product);
      resetForm();
      handleClose();
    } catch (error) {
      const err = error as { error: string };
      toast.error(err.error);
      console.error("Error al editar el producto:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBarcode = async (productId: string, barcode: string) => {
    try {
      setLoading(true);
      const res = await addBarcodeToProduct(productId, barcode);
      toast.success(res.msg);
    } catch (error) {
      const err = error as { error: string };
      toast.error(err.error);
      console.error("Error al agregar el c&oacute;digo de barras:", error);
    }
    finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      const res = await deleteProduct(id);
      toast.success(res.msg);
      return true;
    } catch (error) {
      const err = error as { error: string };
      toast.error(err.error);
      console.error("Error al eliminar el producto:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    handleCreateProduct,
    loading,
    setLoading,
    handleEditProduct,
    handleDeleteProduct,
    loadingProducts,
    searchProducts,
    handleSearchProducts,
    handleAddBarcode
  };
};

export default useProducts;
