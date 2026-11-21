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

// Las búsquedas siempre se piden al servidor, nunca desde la caché del navegador
const NO_CACHE = { "Cache-Control": "no-cache" };

// axios codifica los params: búsquedas con "&", "#", "%", etc. no rompen la URL
export const searchProducts = (search: string): Promise<GetAllProductsResponse> =>
  apiRequest("/products", { params: { s: search }, headers: NO_CACHE });

// Coincidencia exacta por código de barras (para el lector): nunca devuelve resultados aproximados
export const findProductsByBarcode = (barcode: string): Promise<GetAllProductsResponse> =>
  apiRequest("/products", { params: { barcode }, headers: NO_CACHE });

export const getProductSales = (
  data: IGetProductSales,
  productId: number,
): Promise<GetProductSalesResponse> => {
  const params = new URLSearchParams({ fromDate: data.fromDate, toDate: data.toDate });
  if (data.sellerId) params.append("sellerId", data.sellerId.toString());

  return apiRequest(`/sales/product/${productId}`, { params });
};

export const createProduct = (data: ICreateProduct): Promise<CreateProductResponse> =>
  apiRequest("/products", { method: "POST", data });

export const editProduct = (data: ProductInDb): Promise<EditProductResponse> =>
  apiRequest(`/products/${encodeURIComponent(data._id)}`, {
    method: "PUT",
    data,
  });

export const addBarcodeToProduct = (
  productId: string,
  barcode: string,
): Promise<EditProductResponse> =>
  apiRequest(`/products/${encodeURIComponent(productId)}/barcode`, {
    method: "PATCH",
    data: { barcode },
  });

export const deleteProduct = (id: string): Promise<{ msg: string }> =>
  apiRequest(`/products/${encodeURIComponent(id)}`, { method: "DELETE" });
