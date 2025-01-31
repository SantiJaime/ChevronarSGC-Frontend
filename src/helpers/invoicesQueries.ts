import { URL } from "../constants/const";
import { refreshAccessToken } from "./authQueries";

interface GetInvoicesResponse {
  invoices: FullInvoice[];
  msg: string;
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

export const getInvoices = async (
  payload: InvoiceSearch
): Promise<GetInvoicesResponse> => {
  const response = await fetch(
    `${URL}/invoices?fromDate=${payload.fromDate}&toDate=${payload.toDate}&clientName=${payload.clientName}&clientDocument=${payload.clientDocument}&type=${payload.type}&invoiceNumber=${payload.invoiceNumber}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );
  if (response.status === 401) {
    await refreshAccessToken();
    return getInvoices(payload);
  }
  if (!response.ok) {
    const error: ErrorMessage = await response.json();
    throw error;
  }
  return await response.json();
};

export const createInvoice = async (
  payload: NewInvoice
): Promise<CreateInvoiceResponse> => {
  try {
    const response = await fetch(`${URL}/invoices/new-invoice`, {
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
  const response = await fetch(`${URL}/invoices/new-credit-note`, {
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
