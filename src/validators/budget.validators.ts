import * as yup from "yup";
import {
  fromDateValidatorSchema,
  toDateValidatorSchema,
} from "./date.validators";

export const createBudgetSchema = yup.object().shape({
  saleCond: yup.string().required("La condición de venta es requerida"),
  salePoint: yup.string().required("El punto de venta es requerido"),
  creditCard: yup.string(),
  debitCard: yup.string(),
  paymentsQuantity: yup
    .string()
    .matches(/^[0-9zZ]+$/, "Solo se permiten números o la letra 'Z'")
    .optional(),
});

export const searchBudgetSchema = yup.object().shape({
  fromDate: fromDateValidatorSchema.required("La fecha es requerida"),
  toDate: toDateValidatorSchema.required("La fecha es requerida"),
  budgetNumber: yup
    .string()
    .matches(
      /^\d+$/,
      "El número de presupuesto debe ser un número (sin letras ni símbolos)",
    )
    .optional(),
  clientDocument: yup
    .string()
    .matches(
      /^\d+$/,
      "El documento debe ser un número (sin letras ni símbolos)",
    )
    .optional(),
  salePoint: yup.string().required("El punto de venta es requerido"),
  total: yup
    .string()
    .matches(
      /^\d+$/,
      "El valor total de la factura debe ser un número (sin letras ni símbolos)",
    )
    .optional(),
  saleCond: yup.string().optional(),
  creditCard: yup.string().optional(),
  debitCard: yup.string().optional(),
  paymentsQuantity: yup
    .string()
    .matches(/^\d+$/, "Solo se permiten números (sin letras ni símbolos)")
    .optional(),
});
