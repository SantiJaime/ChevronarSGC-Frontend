import * as yup from "yup";
import {
  requiredFromDateSchema,
  requiredPastDateSchema,
} from "./date.validators";

export const addProductSchema = yup.object().shape({
  price: yup.number().required("El precio es requerido"),
  quantity: yup
    .number()
    .required("La cantidad es requerida")
    .min(1, "La cantidad debe ser mayor a 0"),
});

export const createNewProduct = yup.object().shape({
  productName: yup
    .string()
    .required("El nombre del producto es requerido")
    .min(3, "El nombre del producto debe tener al menos 3 caracteres"),
  price: yup.number().required("El precio es requerido"),
  barcodes: yup.array().of(yup.string().optional()),
});

export const editProductSchema = createNewProduct.shape({
  stock: yup.number().required("El stock es requerido"),
  barcodes: yup.array().of(yup.string().optional()),
});

export const getProductSalesSchema = yup.object().shape({
  fromDate: requiredFromDateSchema("La fecha de inicio es requerida"),
  toDate: requiredPastDateSchema("La fecha hasta es requerida"),
  sellerId: yup.number().integer().required("El vendedor es requerido"),
});

export type ICreateProduct = yup.InferType<typeof createNewProduct>;
export type IAddProduct = yup.InferType<typeof addProductSchema>;
export type IGetProductSales = yup.InferType<typeof getProductSalesSchema>;
export type IEditProduct = yup.InferType<typeof editProductSchema>;
