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

export const getInvoices = async (
  payload: InvoiceSearch,
  page: number
): Promise<GetInvoicesResponse> => {
  const url = new URL(`${URL_API}/invoices`);
  const params = new URLSearchParams({
    page: page.toString(),
    ...Object.fromEntries(
      Object.entries(payload).filter(([, value]) => value)
    ),
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

export const createBudget = async (
  payload: NewInvoice
): Promise<CreateInvoiceResponse> => {
  try {
    const response = await fetch(`${URL_API}/invoices/new-budget`, {
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
  try {
    const response = await fetch(`${URL_API}/invoices/new-invoice`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
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
  const response = await fetch(`${URL_API}/invoices/new-credit-note`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
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
