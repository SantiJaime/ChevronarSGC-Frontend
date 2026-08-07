export const formatPrice = (value: number): string => {
  return new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value || 0);
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