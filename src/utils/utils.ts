export const formatPrice = (value: number): string => {
  return new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value || 0);
};

export const formatDateISO = (date: string): string => {
  return date.split("T")[0];
};