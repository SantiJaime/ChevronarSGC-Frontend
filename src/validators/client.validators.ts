import * as yup from "yup";

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
    .trim()
    .required("El nombre | razón social es requerido")
    .min(3, "El nombre | razón social debe tener al menos 3 caracteres"),
  address: yup
    .string()
    .trim()
    .required("El domicilio es requerido")
    .min(3, "El domicilio debe tener al menos 3 caracteres"),
  city: yup.string().required("La localidad es requerida"),
  ivaCond: yup.string().required("La condición de IVA es requerida"),
});
