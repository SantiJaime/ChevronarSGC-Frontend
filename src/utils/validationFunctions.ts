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
  if (
    (values.saleCond === "Crédito" && !values.creditCard) ||
    (values.saleCond === "Debito" && !values.debitCard)
  ) {
    return "Debe seleccionar una tarjeta de crédito / débito para generar la factura";
  }
  if (
    (values.saleCond === "Crédito" || values.saleCond === "Debito") &&
    !values.paymentsQuantity
  ) {
    return "Debe ingresar la cantidad de cuotas para generar la factura";
  }
  if (values.saleCond === "Contado") {
    values.paymentsQuantity = "";
    values.creditCard = "";
    values.debitCard = "";
  }
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
  if (
    (values.saleCond === "Crédito" && !values.creditCard) ||
    (values.saleCond === "Debito" && !values.debitCard)
  ) {
    return "Debe seleccionar una tarjeta de crédito / débito para generar la nota de crédito";
  }
  if (
    (values.saleCond === "Crédito" || values.saleCond === "Debito") &&
    !values.paymentsQuantity
  ) {
    return "Debe ingresar la cantidad de cuotas para generar la factura";
  }
  if (values.saleCond === "Contado") {
    values.paymentsQuantity = "";
    values.creditCard = "";
    values.debitCard = "";
  }
  return null;
};
