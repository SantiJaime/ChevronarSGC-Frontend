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
  apiRequest("/invoices", { params: buildSearchParams(payload, page) });

export const getBudgets = (
  payload: BudgetSearch,
  page: number,
): Promise<GetBudgetsResponse> =>
  apiRequest("/budgets", { params: buildSearchParams(payload, page) });

export const createBudget = (payload: NewBudget): Promise<CreateInvoiceResponse> =>
  apiRequest("/budgets", { method: "POST", data: payload });

export const createInvoice = (payload: NewInvoice): Promise<CreateInvoiceResponse> => {
  const { cuitOption, ...rest } = payload;
  return apiRequest("/invoices/new-invoice", {
    method: "POST",
    params: { cuitOption: String(cuitOption) },
    data: rest,
  });
};

export const cancelInvoice = (
  cuitOption: string,
  assocInvoiceId: string,
): Promise<CancelInvoiceResponse> =>
  apiRequest(`/invoices/new-credit-note/${encodeURIComponent(assocInvoiceId)}`, {
    method: "POST",
    params: { cuitOption },
  });

export const printInvoice = (id: string): Promise<PrintInvoiceResponse> =>
  apiRequest(`/invoices/print/${encodeURIComponent(id)}`);

export const printBudget = (id: string): Promise<PrintInvoiceResponse> =>
  apiRequest(`/budgets/print/${encodeURIComponent(id)}`);

export const deleteBudget = (id: string): Promise<DeleteBudgetResponse> =>
  apiRequest(`/budgets/${encodeURIComponent(id)}`, { method: "DELETE" });
