import { URL as URL_API } from "../constants/const";
import { ICreateProduct, IGetProductSales } from "../utils/validationSchemas";
import { apiRequest } from "./authQueries";

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

// URLSearchParams codifica el texto: búsquedas con "&", "#", "%", etc. no rompen la URL
export const searchProducts = (search: string): Promise<GetAllProductsResponse> =>
  apiRequest(`${URL_API}/products?${new URLSearchParams({ s: search })}`, {
    cache: "no-store",
  });

// Coincidencia exacta por código de barras (para el lector): nunca devuelve resultados aproximados
export const findProductsByBarcode = (barcode: string): Promise<GetAllProductsResponse> =>
  apiRequest(`${URL_API}/products?${new URLSearchParams({ barcode })}`, {
    cache: "no-store",
  });

export const getProductSales = (
  data: IGetProductSales,
  productId: number,
): Promise<GetProductSalesResponse> => {
  const params = new URLSearchParams({ fromDate: data.fromDate, toDate: data.toDate });
  if (data.sellerId) params.append("sellerId", data.sellerId.toString());

  return apiRequest(`${URL_API}/sales/product/${productId}?${params}`);
};

export const createProduct = (data: ICreateProduct): Promise<CreateProductResponse> =>
  apiRequest(`${URL_API}/products`, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const editProduct = (data: ProductInDb): Promise<EditProductResponse> =>
  apiRequest(`${URL_API}/products/${encodeURIComponent(data._id)}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const addBarcodeToProduct = (
  productId: string,
  barcode: string,
): Promise<EditProductResponse> =>
  apiRequest(`${URL_API}/products/${encodeURIComponent(productId)}/barcode`, {
    method: "PATCH",
    body: JSON.stringify({ barcode }),
  });

export const deleteProduct = (id: string): Promise<{ msg: string }> =>
  apiRequest(`${URL_API}/products/${encodeURIComponent(id)}`, { method: "DELETE" });
