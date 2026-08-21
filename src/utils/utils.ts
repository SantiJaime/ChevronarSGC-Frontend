const priceFormatter = new Intl.NumberFormat("es-AR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const formatPrice = (value: number): string => {
  return priceFormatter.format(value);
};

export const formatDateISO = (date: string): string => {
  return date.split("T")[0];
};

export const buildPaymentString = (
  data: BuildPaymentStringData,
): string => {
  let string = data.method;
  if (data.method === "Crédito") {
    string += ` - ${data.creditCard} - ${data.paymentsQuantity} cuotas`;
  } else if (data.method === "Débito") {
    string += ` - ${data.debitCard}`;
  }
  return string;
};