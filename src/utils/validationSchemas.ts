import * as yup from "yup";

export const loginSchema = yup.object().shape({
  username: yup
    .string()
    .required("El nombre de usuario es requerido")
    .min(3, "El nombre de usuario debe tener al menos 3 caracteres"),
  password: yup
    .string()
    .required("La contraseña es requerida")
    .min(8, "La contraseña debe tener al menos 8 caracteres"),
});

export const addProductSchema = yup.object().shape({
  productName: yup
    .string()
    .required("El nombre es requerido")
    .min(3, "El nombre debe tener al menos 3 caracteres"),
  price: yup
    .number()
    .required("El precio es requerido")
    .min(1, "El precio debe ser mayor 0"),
  quantity: yup
    .number()
    .required("La cantidad es requerida")
    .min(1, "La cantidad debe ser mayor a 0"),
});

export const createInvoiceSchema = yup.object().shape({
  saleCond: yup.string().required("La condición de venta es requerida"),
  salePoint: yup.string().required("El punto de venta es requerido"),
  invoiceType: yup.string().required("El tipo de factura es requerido"),
  creditCard: yup.string(),
  debitCard: yup.string(),
  paymentsQuantity: yup
    .string()
    .matches(/^\d+$/, "Solo se permiten números (sin letras ni símbolos)")
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
  date: yup
    .string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, "El formato debe ser YYYY-MM-DD")
    .test("is-valid-date", "La fecha ingresada no es válida", (value) => {
      if (!value) return false;

      const [year, month, day] = value.split("-").map(Number);

      const today = new Date();
      const currentDay = today.getDate();
      const currentMonth = today.getMonth() + 1;
      const currentYear = today.getFullYear();

      if (year > currentYear) return false;

      if (year === currentYear && month > currentMonth) return false;

      if (year === currentYear && month === currentMonth && day > currentDay)
        return false;

      const date = new Date(year, month - 1, day);
      return (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day
      );
    })
    .required("La fecha es requerida"),
});

export const createClientSchema = yup.object().shape({
  documentType: yup.string().required("El tipo de documento es requerido"),
  document: yup
    .string()
    .matches(/^\d+$/, "Solo se permiten números (sin letras ni símbolos)")
    .required("El documento es requerido")
    .min(7, "El documento debe tener al menos 7 caracteres")
    .max(11, "El documento debe tener 11 caracteres"),
  name: yup
    .string()
    .required("El nombre | razón social es requerido")
    .min(3, "El nombre | razón social debe tener al menos 3 caracteres"),
  address: yup
    .string()
    .required("El domicilio es requerido")
    .min(3, "El domicilio debe tener al menos 3 caracteres"),
  city: yup.string().required("La localidad es requerida"),
  ivaCond: yup.string().required("La condición de IVA es requerida"),
});

export const createCitySchema = yup.object().shape({
  city: yup
    .string()
    .required("El nombre de la localidad es requerido")
    .min(3, "El nombre de la localidad debe tener al menos 3 caracteres")
    .matches(
      /^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/,
      "El nombre de la localidad no puede contener números ni símbolos"
    ),
  province: yup
    .string()
    .required("La provincia es requerida")
    .min(3, "La provincia debe tener al menos 3 caracteres"),
});

export const searchInvoiceSchema = yup.object().shape({
  fromDate: yup
    .string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, "El formato debe ser YYYY-MM-DD")
    .test("is-valid-date", "La fecha debe ser a partir de 2025", (value) => {
      if (!value) return false;
      const [year] = value.split("-").map(Number);

      return year >= 2025;
    })
    .test("is-valid-date", "La fecha ingresada no es válida", (value) => {
      if (!value) return false;

      const [year, month, day] = value.split("-").map(Number);

      const today = new Date();
      const currentDay = today.getDate();
      const currentMonth = today.getMonth() + 1;
      const currentYear = today.getFullYear();

      if (year > currentYear) return false;

      if (year === currentYear && month > currentMonth) return false;

      if (year === currentYear && month === currentMonth && day > currentDay)
        return false;

      const date = new Date(year, month - 1, day);
      return (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day
      );
    })
    .required("La fecha es requerida"),
  toDate: yup
    .string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, "El formato debe ser YYYY-MM-DD")
    .test("is-valid-date", "La fecha ingresada no es válida", (value) => {
      if (!value) return false;

      const [year, month, day] = value.split("-").map(Number);

      const today = new Date();
      const currentDay = today.getDate();
      const currentMonth = today.getMonth() + 1;
      const currentYear = today.getFullYear();

      if (year > currentYear) return false;

      if (year === currentYear && month > currentMonth) return false;

      if (year === currentYear && month === currentMonth && day > currentDay)
        return false;

      const date = new Date(year, month - 1, day);
      return (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day
      );
    })
    .required("La fecha es requerida"),
  invoiceNumber: yup
    .string()
    .matches(
      /^\d+$/,
      "El número de factura debe ser un número (sin letras ni símbolos)"
    )
    .optional(),
  clientName: yup
    .string()
    .matches(
      /^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/,
      "El nombre del cliente no puede contener números ni símbolos"
    )
    .optional(),
  clientDocument: yup
    .string()
    .matches(
      /^\d+$/,
      "El documento debe ser un número (sin letras ni símbolos)"
    )
    .optional(),
  invoiceType: yup.string().optional(),
  salePoint: yup.string().required("El punto de venta es requerido"),
  total: yup
    .string()
    .matches(
      /^\d+$/,
      "El valor total de la factura debe ser un número (sin letras ni símbolos)"
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

export const addPaymentMethodSchema = yup.object().shape({
  method: yup.string().required("El método de pago es requerido"),
  creditCard: yup.string().optional(),
  debitCard: yup.string().optional(),
  paymentsQuantity: yup
    .string()
    .matches(/^\d+$/, "Solo se permiten números (sin letras ni símbolos)")
    .required("La cantidad de cuotas es requerida"),
  valueToPay: yup
    .string()
    .matches(/^\d+$/, "Solo se permiten números (sin letras ni símbolos)")
    .required("El valor a pagar es requerido"),
});
