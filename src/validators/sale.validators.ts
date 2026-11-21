import * as yup from "yup";
import {
  optionalFromDateSchema,
  optionalToDateSchema,
  requiredPastDateSchema,
} from "./date.validators";

export const newSaleSchema = yup.object().shape({
  clientName: yup.string().required("El nombre del cliente es requerido"),
  sellerId: yup
    .number()
    .integer()
    .moreThan(0, "El vendedor es requerido")
    .required("El vendedor es requerido"),
});

export const searchSalesValidatorSchema = yup.object().shape({
  authorized: yup.string().required("El estado del presupuesto es requerido"),
  sellerId: yup.number().integer().optional(),
  fromDate: optionalFromDateSchema,
  toDate: optionalToDateSchema,
  saleNumber: yup
    .number()
    .integer()
    .min(1, "El número de venta debe ser mayor a 0")
    .optional(),
});

export const authorizeSaleSchema = yup.object().shape({
  method: yup.string().required("El método de pago es requerido"),
  creditCard: yup.string().optional(),
  debitCard: yup.string().optional(),
  paymentsQuantity: yup
    .string()
    .required("La cantidad de cuotas es requerida")
    .matches(
      /^([1-6]|[Zz])$/,
      "Solo se permiten números del 1 al 6 o la letra Z",
    ),
});

export const salesAmountsSchema = yup.object().shape({
  date: requiredPastDateSchema("La fecha es requerida"),
});

export const updateSalePaymentMethodSchema = yup.object().shape({
  total: yup.number().required("El valor total de la venta es obligatorio"),
  method: yup.string().required("El método de pago es obligatorio"),
  creditCard: yup.string().optional(),
  debitCard: yup.string().optional(),
  paymentsQuantity: yup
    .string()
    .required("La cantidad de cuotas es requerida")
    .matches(
      /^([1-6]|[Zz])$/,
      "Solo se permiten números del 1 al 6 o la letra Z",
    )
});

export type NewSale = yup.InferType<typeof newSaleSchema>;
export type ISearchSale = yup.InferType<typeof searchSalesValidatorSchema>;
export type IAuthorizeSale = yup.InferType<typeof authorizeSaleSchema>;
export type IUpdateSalePaymentMethod = yup.InferType<typeof updateSalePaymentMethodSchema>;
export const validateSearchSale = (values: ISearchSale): string | null => {
  if (values.fromDate && !values.toDate) {
    return "Si ingresa una fecha de inicio, debe ingresar una fecha de fin";
  }
  if (values.toDate && !values.fromDate) {
    return "Si ingresa una fecha de fin, debe ingresar una fecha de inicio";
  }
  if (
    values.fromDate &&
    values.toDate &&
    new Date(values.fromDate) > new Date(values.toDate)
  ) {
    return "La fecha de fin debe ser mayor a la fecha de inicio";
  }
  return null;
};

export const validateAuthorizeSale = (
  values: IAuthorizeSale,
  saleTotal: number,
  multiplePaymenstTotal?: number,
): string | null => {
  if (values.method === "Crédito" && !values.creditCard) {
    return "Debes seleccionar una tarjeta de crédito";
  }

  if (values.method === "Débito" && !values.debitCard) {
    return "Debes seleccionar una tarjeta de débito";
  }

  if (
    values.method === "Múltiples métodos de pago" &&
    multiplePaymenstTotal &&
    multiplePaymenstTotal < saleTotal
  ) {
    return "Aún no se ha alcanzado el total del presupuesto, por favor agregue otro método de pago o modifique el valor a pagar";
  }

  const resetFields = ["Contado", "Transferencia", "Cheque"].includes(
    values.method,
  );

  if (resetFields) {
    values.paymentsQuantity = "1";
    values.creditCard = "";
    values.debitCard = "";
  }

  return null;
};
