import { URL } from "../constants/const";

export const createInvoice = async (payload: FullInvoice, token: string) => {
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
  console.log(res)
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
  })
  if (!response.ok) {
    const error: ErrorMessage = await response.json();
    throw error;
  }
  const res = await response.json();
  return res;
}