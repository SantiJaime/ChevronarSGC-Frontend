import { URL as URL_API } from "../constants/const";
import { refreshAccessToken } from "./authQueries";

interface GetInvoicesResponse {
  invoices: FullInvoice[];
  msg: string;
  infoPagination: {
    page: number;
    limit: number;
    totalDocs: number;
    totalPages: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    prevPage: number | null;
    nextPage: number | null;
  };
}

interface GetBudgetsResponse {
  budgets: FullBudget[];
  msg: string;
  infoPagination: {
    page: number;
    limit: number;
    totalDocs: number;
    totalPages: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    prevPage: number | null;
    nextPage: number | null;
  };
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

export const getInvoices = async (
  payload: InvoiceSearch,
  page: number
): Promise<GetInvoicesResponse> => {
  const url = new URL(`${URL_API}/invoices`);
  const params = new URLSearchParams({ page: page.toString() });

  Object.entries(payload).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });
  const response = await fetch(`${url}?${params}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (response.status === 401) {
    await refreshAccessToken();
    return getInvoices(payload, page);
  }
  if (!response.ok) {
    const error: ErrorMessage = await response.json();
    throw error;
  }
  return await response.json();
};

export const getBudgets = async (
  payload: BudgetSearch,
  page: number
): Promise<GetBudgetsResponse> => {
  const url = new URL(`${URL_API}/budgets`);
  const params = new URLSearchParams({ page: page.toString() });

  Object.entries(payload).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });

  const response = await fetch(`${url}?${params}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (response.status === 401) {
    await refreshAccessToken();
    return getBudgets(payload, page);
  }
  if (!response.ok) {
    const error: ErrorMessage = await response.json();
    throw error;
  }
  return await response.json();
};

export const createBudget = async (
  payload: NewBudget
): Promise<CreateInvoiceResponse> => {
  try {
    const response = await fetch(`${URL_API}/budgets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      credentials: "include",
    });
    if (response.status === 401) {
      await refreshAccessToken();
      return createBudget(payload);
    }
    if (!response.ok) {
      const error: ErrorMessage = await response.json();
      throw error;
    }
    return await response.json();
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const createInvoice = async (
  payload: NewInvoice
): Promise<CreateInvoiceResponse> => {
  const { cuitOption, ...rest } = payload;
  try {
    const response = await fetch(`${URL_API}/invoices/new-invoice?cuitOption=${cuitOption}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rest),
      credentials: "include",
    });
    if (response.status === 401) {
      await refreshAccessToken();
      return createInvoice(payload);
    }
    if (!response.ok) {
      const error: ErrorMessage = await response.json();
      throw error;
    }
    return await response.json();
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const cancelInvoice = async (
  payload: NewCreditNote
): Promise<CancelInvoiceResponse> => {
  const { cuitOption, ...rest } = payload;
  const response = await fetch(`${URL_API}/invoices/new-credit-note?cuitOption=${cuitOption}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(rest),
    credentials: "include",
  });
  if (response.status === 401) {
    await refreshAccessToken();
    return cancelInvoice(payload);
  }
  if (!response.ok) {
    const error: ErrorMessage = await response.json();
    throw error;
  }
  return await response.json();
};

export const printInvoice = async (
  invoice: FullInvoice
): Promise<PrintInvoiceResponse> => {
  const response = await fetch(`${URL_API}/invoices/print-invoice`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(invoice),
    credentials: "include",
  });
  if (response.status === 401) {
    await refreshAccessToken();
    return printInvoice(invoice);
  }
  if (!response.ok) {
    const error: ErrorMessage = await response.json();
    throw error;
  }
  return await response.json();
};

export const printBudget = async (
  budget: FullBudget
): Promise<PrintInvoiceResponse> => {
  const response = await fetch(`${URL_API}/budgets/print`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(budget),
    credentials: "include",
  });
  if (response.status === 401) {
    await refreshAccessToken();
    return printBudget(budget);
  }
  if (!response.ok) {
    const error: ErrorMessage = await response.json();
    throw error;
  }
  return await response.json();
};

export const deleteBudget = async (id: string): Promise<DeleteBudgetResponse> => {
  const response = await fetch(`${URL_API}/budgets/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (response.status === 401) {
    await refreshAccessToken();
    return deleteBudget(id);
  }
  if (!response.ok) {
    const error: ErrorMessage = await response.json();
    throw error;
  }
  return await response.json();
}