import * as yup from "yup";
import {
  fromDateValidatorSchema,
  toDateValidatorSchema,
} from "./date.validators";

export const createInvoiceSchema = yup.object().shape({
  cuitOption: yup.string().required("El CUIT de facturación es requerido"),
  saleCond: yup.string().required("La condición de venta es requerida"),
  salePoint: yup.string().required("El punto de venta es requerido"),
  invoiceType: yup.string().required("El tipo de factura es requerido"),
  creditCard: yup.string(),
  debitCard: yup.string(),
  paymentsQuantity: yup
    .string()
    .matches(/^[0-9zZ]+$/, "Solo se permiten números o la letra 'Z'")
    .optional(),
});

export const createCreditNoteSchema = yup.object().shape({
  saleCond: yup.string().required("La condición de venta es requerida"),
  salePoint: yup.string().required("El punto de venta es requerido"),
  creditNoteType: yup
    .string()
    .required("El tipo de nota de crédito es requerido"),
  creditCard: yup.string(),
  debitCard: yup.string(),
  assocInvoiceNumber: yup
    .string()
    .required("El número de factura asociada es requerido")
    .matches(/^\d+$/, "Solo se permiten números (sin letras ni símbolos)"),
  paymentsQuantity: yup
    .string()
    .matches(/^\d+$/, "Solo se permiten números (sin letras ni símbolos)")
    .optional(),
  date: toDateValidatorSchema.required("La fecha es requerida"),
});

export const searchInvoiceSchema = yup.object().shape({
  cuitOption: yup.string().required("El CUIT de facturación es requerido"),
  fromDate: fromDateValidatorSchema.required("La fecha desde es requerida"),
  toDate: toDateValidatorSchema.required("La fecha hasta es requerida"),
  invoiceNumber: yup
    .string()
    .matches(
      /^\d+$/,
      "El número de factura debe ser un número (sin letras ni símbolos)",
    )
    .optional(),
  clientName: yup
    .string()
    .matches(
      /^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/,
      "El nombre del cliente no puede contener números ni símbolos",
    )
    .optional(),
  clientDocument: yup
    .string()
    .matches(
      /^\d+$/,
      "El documento debe ser un número (sin letras ni símbolos)",
    )
    .optional(),
  cbteTipo: yup.number().optional(),
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

export const validateInvoice = <T extends InvoiceData | BudgetData>(
  values: T,
  client: Client | null,
  products: Product[],
  paymentsLeftValue: number,
): string | null => {
  if (!client) return "Debe seleccionar un cliente para generar la factura";
  if (products.length === 0)
    return "Debe agregar al menos un producto para generar una factura";

  const { saleCond, creditCard, debitCard, paymentsQuantity } = values;

  const requiresCard = saleCond === "Crédito" || saleCond === "Débito";
  const requiresPayments = requiresCard && !paymentsQuantity;
  const invalidPayments =
    saleCond === "Múltiples métodos de pago" && paymentsLeftValue !== 0;
  const resetFields = ["Contado", "Transferencia", "Cheque"].includes(saleCond);

  if (requiresCard && !creditCard && !debitCard)
    return "Debe seleccionar una tarjeta de crédito / débito para generar la factura";

  if (requiresPayments)
    return "Debe ingresar la cantidad de cuotas para generar la factura";

  if (invalidPayments)
    return "El valor total de la factura es mayor a la suma del valor de los métodos de pago ingresados";

  if (resetFields) {
    values.paymentsQuantity = "1";
    values.creditCard = "";
    values.debitCard = "";
  }

  return null;
};

export const validateSearchInvoice = <T extends InvoiceSearch | BudgetSearch>(
  values: T,
) => {
  if (values.saleCond !== "Crédito" && values.saleCond !== "Débito") {
    values.creditCard = "";
    values.debitCard = "";
    values.paymentsQuantity = "";
  }
  if (values.saleCond === "Crédito") {
    values.debitCard = "";
  }
  if (values.saleCond === "Débito") {
    values.creditCard = "";
  }
};
