import { useContext, useState } from "react";
import { SalesContext } from "../context/SalesContext";
import {
  authorizeSale,
  createSale,
  editSale,
  exportToSheets,
  getSales,
  getSalesAmounts,
} from "../helpers/salesQueries";
import { toast } from "sonner";
import { IAuthorizeSale, IGetProductSales } from "../utils/validationSchemas";
import { getProductSales } from "../helpers/productsQueries";

interface FullPaymentsInfo extends IAuthorizeSale {
  totalValue: number;
  payments?: PaymentMethods[];
}

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

  const handleGetSalesAmounts = async (date: string) => {
    try {
      setLoading(true);
      const res = await getSalesAmounts(date);
      toast.success(res.msg);
      return res;
    } catch (error) {
      const err = error as { error: string };
      toast.error(err.error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (sale: SaleWithProducts) => {
    try {
      setLoading(true);
      const response = await createSale(sale);

      return response;
    } catch (error) {
      const err = error as { error: string };
      toast.error(err.error);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (sale: FullSale, newTotal: number) => {
    try {
      setLoading(true);

      const res = await editSale(sale, newTotal);
      toast.success(res.msg);
      setSales((prevSales) =>
        prevSales.map((s) =>
          s._id === res.sale._id
            ? { ...res.sale, totalWithInterest: newTotal }
            : s,
        ),
      );
    } catch (error) {
      const err = error as { error: string };
      toast.error(err.error);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthorize = async (
    id: string,
    paymentsInfo: FullPaymentsInfo,
  ) => {
    try {
      setLoadingAuthorize(true);
      const res = await authorizeSale(id, paymentsInfo);
      setSales((prevSales) =>
        prevSales.map((s) => (s._id === id ? res.sale : s)),
      );
      return res;
    } catch (error) {
      const err = error as { error: string };
      toast.error(err.error);
    } finally {
      setLoadingAuthorize(false);
    }
  };

  const handleGetProductSales = async (
    data: IGetProductSales,
    productId: number,
  ) => {
    try {
      setLoading(true);
      const res = await getProductSales(data, productId);
      toast.success(res.msg);

      return res.result;
    } catch (error) {
      const err = error as { error: string };
      toast.error(err.error);
      console.error("Error al obtener las ventas del producto:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportToSheets = async (date: string) => {
    try {
      setLoading(true);
      return await exportToSheets(date);
    } catch (error) {
      const err = error as { error: string };
      toast.error(err.error);
      console.error(error);
    } finally {
      setLoading(false);
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
    handleGetProductSales,
    handleGetSalesAmounts,
    handleExportToSheets
  };
};

export default useSales;
