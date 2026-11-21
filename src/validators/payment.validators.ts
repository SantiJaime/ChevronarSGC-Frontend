import * as yup from "yup";

export const addPaymentMethodSchema = yup.object().shape({
  method: yup.string().required("El método de pago es requerido"),
  creditCard: yup.string().optional(),
  debitCard: yup.string().optional(),
  paymentsQuantity: yup
    .string()
    .matches(
      /^([1-6]|[Zz])$/,
      "Solo se permiten números del 1 al 6 o la letra Z",
    )
    .required("La cantidad de cuotas es requerida"),
  valueToPay: yup
    .string()
    .matches(/^\d+$/, "Solo se permiten números (sin letras ni símbolos)")
    .required("El valor a pagar es requerido"),
});
