import { URL } from "../constants/const";

export const getInvoices = async (payload: InvoiceSearch, token: string) => {
  const response = await fetch(
    `${URL}/invoices?fromDate=${payload.fromDate}&toDate=${payload.toDate}&clientName=${payload.clientName}&clientDocument=${payload.clientDocument}&type=${payload.type}&invoiceNumber=${payload.invoiceNumber}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) {
    const error: ErrorMessage = await response.json();
    throw error;
  }
  const res = await response.json();
  return res;
};

export const createInvoice = async (payload: NewInvoice, token: string) => {
  const response = await fetch(`${URL}/invoices/new-invoice`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const error: ErrorMessage = await response.json();
    throw error;
  }
  const res = await response.json();
  return res;
};

export const createCreditNote = async (payload: CreditNote, token: string) => {
  const response = await fetch(`${URL}/invoices/new-credit-note`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const error: ErrorMessage = await response.json();
    throw error;
  }
  const res = await response.json();
  return res;
};

export const cancelInvoice = async (payload: NewCreditNote, token: string) => {
  const response = await fetch(`${URL}/invoices/new-credit-note`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const error: ErrorMessage = await response.json();
    throw error;
  }
  const res = await response.json();
  return res;
};
