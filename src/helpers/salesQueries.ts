import { URL as URL_API } from "../constants/const";
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

  return apiRequest(`${URL_API}/sales?${params}`);
};

export const getSalesAmounts = (date: string): Promise<GetSalesAmountsResponse> =>
  apiRequest(`${URL_API}/sales/day?${new URLSearchParams({ date })}`);

export const createSale = (sale: SaleWithProducts): Promise<CreateSaleResponse> =>
  apiRequest(`${URL_API}/sales`, {
    method: "POST",
    body: JSON.stringify(sale),
  });

export const authorizeSale = (
  id: string,
  paymentsInfo: FullPaymentsInfo,
): Promise<AuthorizeSaleResponse> =>
  apiRequest(`${URL_API}/sales/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(paymentsInfo),
  });

export const updateSalePaymentMethod = (
  id: string,
  paymentsInfo: UpdateSalePayments,
): Promise<AuthorizeSaleResponse> =>
  apiRequest(`${URL_API}/sales/${encodeURIComponent(id)}/payment-method`, {
    method: "PATCH",
    body: JSON.stringify(paymentsInfo),
  });

export const editSale = (sale: FullSale, newTotal: number): Promise<EditSaleResponse> =>
  apiRequest(`${URL_API}/sales/${encodeURIComponent(sale._id)}`, {
    method: "PUT",
    body: JSON.stringify({ ...sale, totalWithInterest: newTotal }),
  });

export const printSale = (id: string): Promise<PrintInvoiceResponse> =>
  apiRequest(`${URL_API}/sales/print/${encodeURIComponent(id)}`);

export const deleteSale = (id: string): Promise<{ msg: string }> =>
  apiRequest(`${URL_API}/sales/${encodeURIComponent(id)}`, { method: "DELETE" });

export const exportToSheets = (date: string): Promise<ExportToSheetsResponse> =>
  apiRequest(`${URL_API}/sales/spreadsheet?${new URLSearchParams({ date })}`);

export const getGoogleSheet = (date: string): Promise<ExportToSheetsResponse> =>
  apiRequest(`${URL_API}/sales/spreadsheet/view?${new URLSearchParams({ date })}`);
