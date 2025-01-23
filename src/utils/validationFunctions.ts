export const validateInvoice = (
  values: InvoiceData,
  client: Client | null,
  products: Product[]
) => {
  if (!client) {
    return "Debe seleccionar un cliente para generar la factura";
  }
  if (products.length === 0) {
    return "Debe agregar al menos un producto para generar una factura";
  }
  if (values.saleCond === "Crédito" && !values.creditCard) {
    return "Debe seleccionar una tarjeta de crédito para generar la factura";
  }
  if (values.saleCond === "Contado") values.creditCard = "";
  return null;
};

export const validateCreditNote = (
  values: CreditNoteData,
  client: Client | null,
  products: Product[]
) => {
  if (!client) {
    return "Debe seleccionar un cliente para generar la nota de crédito";
  }
  if (products.length === 0) {
    return "Debe agregar al menos un producto para generar una nota de crédito";
  }
  if (values.saleCond === "Crédito" && !values.creditCard) {
    return "Debe seleccionar una tarjeta de crédito para generar la nota de crédito";
  }
  if (values.saleCond === "Contado") values.creditCard = "";
  return null;
};
