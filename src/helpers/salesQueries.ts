import { type IAuthorizeSale } from "../utils/validationSchemas";
import { apiRequest } from "./authQueries";

interface FullPaymentsInfo extends IAuthorizeSale {
  totalValue: number;
}

interface UpdateSalePayments extends IAuthorizeSale {
  totalWithInterest: number;
}

export const getSales = (payload: SaleSearch, page: number): Promise<GetSalesResponse> => {
  const params = new URLSearchParams({ page: page.toString() });

  Object.entries(payload).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== "" &&
      value !== 0 &&
      value !== "0"
    ) {
      params.append(key, String(value));
    }
  });

  return apiRequest("/sales", { params });
};

export const getSalesAmounts = (date: string): Promise<GetSalesAmountsResponse> =>
  apiRequest("/sales/day", { params: { date } });

export const createSale = (sale: SaleWithProducts): Promise<CreateSaleResponse> =>
  apiRequest("/sales", { method: "POST", data: sale });

export const authorizeSale = (
  id: string,
  paymentsInfo: FullPaymentsInfo,
): Promise<AuthorizeSaleResponse> =>
  apiRequest(`/sales/${encodeURIComponent(id)}`, {
    method: "PATCH",
    data: paymentsInfo,
  });

export const updateSalePaymentMethod = (
  id: string,
  paymentsInfo: UpdateSalePayments,
): Promise<AuthorizeSaleResponse> =>
  apiRequest(`/sales/${encodeURIComponent(id)}/payment-method`, {
    method: "PATCH",
    data: paymentsInfo,
  });

export const editSale = (sale: FullSale, newTotal: number): Promise<EditSaleResponse> =>
  apiRequest(`/sales/${encodeURIComponent(sale._id)}`, {
    method: "PUT",
    data: { ...sale, totalWithInterest: newTotal },
  });

export const printSale = (id: string): Promise<PrintInvoiceResponse> =>
  apiRequest(`/sales/print/${encodeURIComponent(id)}`);

export const deleteSale = (id: string): Promise<{ msg: string }> =>
  apiRequest(`/sales/${encodeURIComponent(id)}`, { method: "DELETE" });

export const exportToSheets = (date: string): Promise<ExportToSheetsResponse> =>
  apiRequest("/sales/spreadsheet", { params: { date } });

export const getGoogleSheet = (date: string): Promise<ExportToSheetsResponse> =>
  apiRequest("/sales/spreadsheet/view", { params: { date } });
