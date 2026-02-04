import { URL as URL_API } from "../constants/const";
import { refreshAccessToken } from "./authQueries";

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
  const response = await fetch(`${url}?${params}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (response.status === 401) {
    await refreshAccessToken();
    return getSales(payload, page);
  }
  if (!response.ok) {
    const error: ErrorMessage = await response.json();
    throw error;
  }
  return await response.json();
};

export const createSale = async (
  sale: SaleWithProducts,
): Promise<CreateSaleResponse> => {
  const response = await fetch(`${URL_API}/sales`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sale),
    credentials: "include",
  });
  if (response.status === 401) {
    await refreshAccessToken();
    return createSale(sale);
  }
  if (!response.ok) {
    const error: ErrorMessage = await response.json();
    throw error;
  }
  return await response.json();
};

export const authorizeSale = async (id: string): Promise<{ msg: string, result: string }> => {
  const response = await fetch(`${URL_API}/sales/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (response.status === 401) {
    await refreshAccessToken();
    return authorizeSale(id);
  }
  if (!response.ok) {
    const error: ErrorMessage = await response.json();
    throw error;
  }
  return await response.json();
};

export const editSale = async (sale: FullSale): Promise<EditSaleResponse> => {
  const response = await fetch(`${URL_API}/sales/${sale._id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sale),
    credentials: "include",
  });
  if (response.status === 401) {
    await refreshAccessToken();
    return editSale(sale);
  }
  if (!response.ok) {
    const error: ErrorMessage = await response.json();
    throw error;
  }
  return await response.json();
}

export const printSale = async (id: string): Promise<PrintInvoiceResponse> => {
  const response = await fetch(`${URL_API}/sales/print/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (response.status === 401) {
    await refreshAccessToken();
    return printSale(id);
  }
  if (!response.ok) {
    const error: ErrorMessage = await response.json();
    throw error;
  }
  return await response.json();
};

export const deleteSale = async (id: string): Promise<{ msg: string }> => {
  const response = await fetch(`${URL_API}/sales/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (response.status === 401) {
    await refreshAccessToken();
    return deleteSale(id);
  }
  if (!response.ok) {
    const error: ErrorMessage = await response.json();
    throw error;
  }
  return await response.json();
};
