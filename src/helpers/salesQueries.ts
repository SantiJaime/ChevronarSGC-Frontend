import { URL as URL_API } from "../constants/const";
import { type IAuthorizeSale } from "../utils/validationSchemas";
import { fetchWithAuth } from "./authQueries";

interface FullPaymentsInfo extends IAuthorizeSale {
  totalValue: number;
}

export const getSales = async (
  payload: SaleSearch,
  page: number,
): Promise<GetSalesResponse> => {
  const url = new URL(`${URL_API}/sales`);
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
  const response = await fetchWithAuth(`${url}?${params}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (!response.ok) {
    const error: ErrorMessage = await response.json();
    throw error;
  }
  return await response.json();
};

export const getSalesAmounts = async (
  date: string,
): Promise<GetSalesAmountsResponse> => {
  const response = await fetchWithAuth(
    `${URL_API}/sales/day?date=${date}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    },
  );
  if (!response.ok) {
    const error: ErrorMessage = await response.json();
    throw error;
  }
  return await response.json();
};

export const createSale = async (
  sale: SaleWithProducts,
): Promise<CreateSaleResponse> => {
  const response = await fetchWithAuth(`${URL_API}/sales`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sale),
    credentials: "include",
  });
  if (!response.ok) {
    const error: ErrorMessage = await response.json();
    throw error;
  }
  return await response.json();
};

export const authorizeSale = async (
  id: string,
  paymentsInfo: FullPaymentsInfo,
): Promise<AuthorizeSaleResponse> => {
  const response = await fetchWithAuth(`${URL_API}/sales/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(paymentsInfo),
  });
  if (!response.ok) {
    const error: ErrorMessage = await response.json();
    throw error;
  }
  return await response.json();
};

export const editSale = async (
  sale: FullSale,
  newTotal: number,
): Promise<EditSaleResponse> => {
  const response = await fetchWithAuth(`${URL_API}/sales/${sale._id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...sale, totalWithInterest: newTotal }),
    credentials: "include",
  });
  if (!response.ok) {
    const error: ErrorMessage = await response.json();
    throw error;
  }
  return await response.json();
};

export const printSale = async (id: string): Promise<PrintInvoiceResponse> => {
  const response = await fetchWithAuth(`${URL_API}/sales/print/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (!response.ok) {
    const error: ErrorMessage = await response.json();
    throw error;
  }
  return await response.json();
};

export const deleteSale = async (id: string): Promise<{ msg: string }> => {
  const response = await fetchWithAuth(`${URL_API}/sales/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (!response.ok) {
    const error: ErrorMessage = await response.json();
    throw error;
  }
  return await response.json();
};

export const exportToSheets = async (date: string): Promise<ExportToSheetsResponse> => {
  const response = await fetchWithAuth(`${URL_API}/sales/spreadsheet?date=${date}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (!response.ok) {
    const error: ErrorMessage = await response.json();
    throw error;
  }
  return await response.json();
}