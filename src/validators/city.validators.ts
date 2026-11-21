import * as yup from "yup";

export const createCitySchema = yup.object().shape({
  city: yup
    .string()
    .required("El nombre de la localidad es requerido")
    .min(3, "El nombre de la localidad debe tener al menos 3 caracteres")
    .matches(
      /^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/,
      "El nombre de la localidad no puede contener números ni símbolos",
    ),
  province: yup
    .string()
    .required("La provincia es requerida")
    .min(3, "La provincia debe tener al menos 3 caracteres"),
});
