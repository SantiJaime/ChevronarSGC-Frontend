import { URL as URL_API } from "../constants/const";
import { apiRequest } from "./authQueries";

interface PaginationInfo {
  page: number;
  limit: number;
  totalDocs: number;
  totalPages: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

interface GetInvoicesResponse {
  invoices: FullInvoice[];
  msg: string;
  infoPagination: PaginationInfo;
}

interface GetBudgetsResponse {
  budgets: FullBudget[];
  msg: string;
  infoPagination: PaginationInfo;
}

interface CreateInvoiceResponse {
  result: string;
  msg: string;
}

interface CancelInvoiceResponse {
  result: string;
  msg: string;
  newCreditNote: FullInvoice;
}

interface PrintInvoiceResponse {
  result: string;
  msg: string;
}

interface DeleteBudgetResponse {
  msg: string;
}

// Solo se envían los filtros con valor
const buildSearchParams = (payload: object, page: number): URLSearchParams => {
  const params = new URLSearchParams({ page: page.toString() });
  Object.entries(payload).forEach(([key, value]) => {
    if (value) params.append(key, String(value));
  });
  return params;
};

export const getInvoices = (
  payload: InvoiceSearch,
  page: number,
): Promise<GetInvoicesResponse> =>
  apiRequest(`${URL_API}/invoices?${buildSearchParams(payload, page)}`);

export const getBudgets = (
  payload: BudgetSearch,
  page: number,
): Promise<GetBudgetsResponse> =>
  apiRequest(`${URL_API}/budgets?${buildSearchParams(payload, page)}`);

export const createBudget = (payload: NewBudget): Promise<CreateInvoiceResponse> =>
  apiRequest(`${URL_API}/budgets`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const createInvoice = (payload: NewInvoice): Promise<CreateInvoiceResponse> => {
  const { cuitOption, ...rest } = payload;
  const params = new URLSearchParams({ cuitOption: String(cuitOption) });
  return apiRequest(`${URL_API}/invoices/new-invoice?${params}`, {
    method: "POST",
    body: JSON.stringify(rest),
  });
};

export const cancelInvoice = (
  cuitOption: string,
  assocInvoiceId: string,
): Promise<CancelInvoiceResponse> => {
  const params = new URLSearchParams({ cuitOption });
  return apiRequest(
    `${URL_API}/invoices/new-credit-note/${encodeURIComponent(assocInvoiceId)}?${params}`,
    { method: "POST" },
  );
};

export const printInvoice = (id: string): Promise<PrintInvoiceResponse> =>
  apiRequest(`${URL_API}/invoices/print/${encodeURIComponent(id)}`);

export const printBudget = (id: string): Promise<PrintInvoiceResponse> =>
  apiRequest(`${URL_API}/budgets/print/${encodeURIComponent(id)}`);

export const deleteBudget = (id: string): Promise<DeleteBudgetResponse> =>
  apiRequest(`${URL_API}/budgets/${encodeURIComponent(id)}`, { method: "DELETE" });
