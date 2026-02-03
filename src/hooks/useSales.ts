import { useContext, useState } from "react";
import { SalesContext } from "../context/SalesContext";
import {
  authorizeSale,
  createSale,
  editSale,
  getSales,
} from "../helpers/salesQueries";
import { toast } from "sonner";

const useSales = () => {
  const context = useContext(SalesContext);
  if (!context) {
    throw new Error("El contexto de ventas no está definido");
  }
  const [loading, setLoading] = useState(false);
  const [loadingAuthorize, setLoadingAuthorize] = useState(false);
  const { sales, setSales } = context;

  const handleGetSales = async (payload: SaleSearch, page: number) => {
    try {
      setLoading(true);
      const res = await getSales(payload, page);
      setSales(res.sales);
      toast.success(res.msg);

      return res.infoPagination;
    } catch (error) {
      const err = error as { error: string };
      toast.error(err.error);
      setSales([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (sale: SaleWithProducts) => {
    try {
      setLoading(true);
      return await createSale(sale);
    } catch (error) {
      const err = error as { error: string };
      toast.error(err.error);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (sale: FullSale) => {
    try {
      setLoading(true);
      console.log(sale)
      const res = await editSale(sale);
      toast.success(res.msg);
      setSales((prevSales) =>
        prevSales.map((s) => (s._id === res.sale._id ? res.sale : s)),
      );
    } catch (error) {
      const err = error as { error: string };
      toast.error(err.error);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthorize = async (id: string) => {
    try {
      setLoadingAuthorize(true);
      const res = await authorizeSale(id);
      setSales((prevSales) =>
        prevSales.map((sale) =>
          sale._id === id ? { ...sale, authorized: true } : sale,
        ),
      );
      return res;
    } catch (error) {
      const err = error as { error: string };
      toast.error(err.error);
    } finally {
      setLoadingAuthorize(false);
    }
  };

  return {
    sales,
    setSales,
    handleCreate,
    loading,
    handleGetSales,
    handleAuthorize,
    loadingAuthorize,
    handleEdit,
  };
};

export default useSales;
