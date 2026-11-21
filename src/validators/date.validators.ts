import * as yup from "yup";

const DATE_FORMAT = /^\d{4}-\d{2}-\d{2}$/;
const DATE_FORMAT_MSG = "El formato debe ser YYYY-MM-DD";
const MIN_YEAR = 2025;
const MIN_YEAR_MSG = `La fecha debe ser a partir de ${MIN_YEAR}`;

// Fecha real (sin desbordes tipo 31/02) y no posterior a hoy.
const isRealPastDate = (value: string): boolean => {
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
};

const isFromMinYear = (value: string): boolean =>
  Number(value.split("-")[0]) >= MIN_YEAR;

// allowEmpty: con true un valor vacío pasa (el campo es opcional o lo cubre
// un `required` aparte); con false se rechaza.
const pastDateTest = (allowEmpty: boolean) => (value?: string | null) =>
  value ? isRealPastDate(value) : allowEmpty;
const minYearTest = (allowEmpty: boolean) => (value?: string | null) =>
  value ? isFromMinYear(value) : allowEmpty;

export const emptyStringToNull = (
  value: string | null | undefined,
  originalValue: unknown,
): string | null | undefined => {
  if (typeof originalValue === "string" && originalValue === "") {
    return null;
  }
  return value;
};

// Variantes estrictas: un vacío es inválido. Se les agrega `.required(...)`.
export const fromDateValidatorSchema = yup
  .string()
  .matches(DATE_FORMAT, DATE_FORMAT_MSG)
  .test("is-valid-date", MIN_YEAR_MSG, minYearTest(false))
  .test("is-valid-date", "La fecha ingresada no es válida", pastDateTest(false));

export const toDateValidatorSchema = yup
  .string()
  .matches(DATE_FORMAT, DATE_FORMAT_MSG)
  .test("is-valid-date", "La fecha ingresada no es válida", pastDateTest(false));

const LENIENT_PAST_DATE_MSG = "La fecha ingresada no es válida o es futura";

// Variantes opcionales (filtros de ventas): vacío => null y sin error.
export const optionalFromDateSchema = yup
  .string()
  .nullable()
  .transform(emptyStringToNull)
  .matches(DATE_FORMAT, DATE_FORMAT_MSG)
  .test("is-valid-year", MIN_YEAR_MSG, minYearTest(true))
  .test("is-valid-date", LENIENT_PAST_DATE_MSG, pastDateTest(true));

export const optionalToDateSchema = yup
  .string()
  .nullable()
  .transform(emptyStringToNull)
  .matches(DATE_FORMAT, DATE_FORMAT_MSG)
  .test("is-valid-date", LENIENT_PAST_DATE_MSG, pastDateTest(true));

// Variantes requeridas sin chequeo de formato (inputs type="date").
export const requiredPastDateSchema = (requiredMsg: string) =>
  yup
    .string()
    .required(requiredMsg)
    .test("is-valid-date", LENIENT_PAST_DATE_MSG, pastDateTest(true));

export const requiredFromDateSchema = (requiredMsg: string) =>
  yup
    .string()
    .required(requiredMsg)
    .test("is-valid-year", MIN_YEAR_MSG, minYearTest(true))
    .test("is-valid-date", LENIENT_PAST_DATE_MSG, pastDateTest(true));
