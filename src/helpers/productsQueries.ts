import { URL as URL_API } from "../constants/const";
import { ICreateProduct, IGetProductSales } from "../utils/validationSchemas";
import { refreshAccessToken } from "./authQueries";

interface GetAllProductsResponse {
  products: ProductInDb[];
  msg: string;
}

interface CreateProductResponse {
  newProduct: ProductInDb;
  msg: string;
}

interface EditProductResponse {
  product: ProductInDb;
  msg: string;
}

interface GetProductSalesResponse {
  msg: string;
  result: number;
}

export const getAllProducts = async (): Promise<GetAllProductsResponse> => {
  const response = await fetch(`${URL_API}/products`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (response.status === 401) {
    await refreshAccessToken();
    return getAllProducts();
  }
  if (!response.ok) {
    const error: ErrorMessage = await response.json();
    throw error;
  }
  return await response.json();
};

export const getProductSales = async (
  data: IGetProductSales,
  productId: number,
): Promise<GetProductSalesResponse> => {
  const { fromDate, toDate } = data;

  const url = new URL(`${URL_API}/sales/product/${productId}`);
  const params = new URLSearchParams({ fromDate, toDate });
  if (data.sellerId) params.append("sellerId", data.sellerId.toString());

  const response = await fetch(`${url}?${params}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (response.status === 401) {
    await refreshAccessToken();
    return getProductSales(data, productId);
  }
  if (!response.ok) {
    const error: ErrorMessage = await response.json();
    throw error;
  }
  return await response.json();
};

export const createProduct = async (
  data: ICreateProduct,
): Promise<CreateProductResponse> => {
  const response = await fetch(`${URL_API}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (response.status === 401) {
    await refreshAccessToken();
    return createProduct(data);
  }
  if (!response.ok) {
    const error: ErrorMessage = await response.json();
    throw error;
  }
  return await response.json();
};

export const editProduct = async (
  data: ProductInDb,
): Promise<EditProductResponse> => {
  const response = await fetch(`${URL_API}/products/${data._id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (response.status === 401) {
    await refreshAccessToken();
    return editProduct(data);
  }
  if (!response.ok) {
    const error: ErrorMessage = await response.json();
    throw error;
  }
  return await response.json();
};

export const addBarcodeToProduct = async (
  productId: string,
  barcode: string,
): Promise<EditProductResponse> => {
  const response = await fetch(`${URL_API}/products/${productId}/barcode`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ barcode }),
    credentials: "include",
  });
  if (response.status === 401) {
    await refreshAccessToken();
    return addBarcodeToProduct(productId, barcode);
  }
  if (!response.ok) {
    const error: ErrorMessage = await response.json();
    throw error;
  }
  return await response.json();
};

export const deleteProduct = async (id: string): Promise<{ msg: string }> => {
  const response = await fetch(`${URL_API}/products/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (response.status === 401) {
    await refreshAccessToken();
    return deleteProduct(id);
  }
  if (!response.ok) {
    const error: ErrorMessage = await response.json();
    throw error;
  }
  return await response.json();
};
