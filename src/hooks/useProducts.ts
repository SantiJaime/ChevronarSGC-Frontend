import { useContext, useState } from "react";
import { ProductsContext } from "../context/ProductsContext";
import { ICreateProduct } from "../utils/validationSchemas";
import { createProduct, deleteProduct, editProduct } from "../helpers/productsQueries";
import { toast } from "sonner";

const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error("El contexto de productos no está definido");
  }

  const { productsInDb, setProductsInDb, loading: loadingProducts } = context;
  const [loading, setLoading] = useState(false);

  const handleCreateProduct = async (
    data: ICreateProduct,
    resetForm: () => void,
  ) => {
    try {
      setLoading(true);
      const res = await createProduct(data);
      toast.success(res.msg);
      setProductsInDb([...productsInDb, {...res.newProduct, stock: 0}]);
      resetForm();
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
  ) => {
    try {
      setLoading(true);
      const res = await editProduct(data);
      toast.success(res.msg);
      setProductsInDb((prevState) =>
        prevState.map((product) =>
          product._id === res.product._id ? res.product : product,
        ),
      );
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

  const handleDeleteProduct = async (id: string) => {
    try {
      setLoading(true);
      const res = await deleteProduct(id);
      toast.success(res.msg);
      setProductsInDb((prevState) =>
        prevState.filter((product) => product._id !== id),
      );
    } catch (error) {
      const err = error as { error: string };
      toast.error(err.error);
      console.error("Error al eliminar el producto:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    productsInDb,
    setProductsInDb,
    handleCreateProduct,
    loading,
    setLoading,
    handleEditProduct,
    handleDeleteProduct,
    loadingProducts
  };
};

export default useProducts;
