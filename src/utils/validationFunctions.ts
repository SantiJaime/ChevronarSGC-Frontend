export const validateInvoice = (
  values: InvoiceData,
  client: Client | null,
  products: Product[],
  paymentsLeftValue: number,
) => {
  if (!client) {
    return "Debe seleccionar un cliente para generar la factura";
  }
  if (products.length === 0) {
    return "Debe agregar al menos un producto para generar una factura";
  }
  if (
    (values.saleCond === "Crédito" && !values.creditCard) ||
    (values.saleCond === "Débito" && !values.debitCard)
  ) {
    return "Debe seleccionar una tarjeta de crédito / débito para generar la factura";
  }
  if (
    (values.saleCond === "Crédito" || values.saleCond === "Débito") &&
    !values.paymentsQuantity
  ) {
    return "Debe ingresar la cantidad de cuotas para generar la factura";
  }
  if (paymentsLeftValue !== 0)
    return "El valor total de la factura es mayor a la suma del valor de los métodos de pago ingresados";
  if (
    values.saleCond === "Contado" ||
    values.saleCond === "Transferencia" ||
    values.saleCond === "Cheque"
  ) {
    values.paymentsQuantity = "1";
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
    (values.saleCond === "Débito" && !values.debitCard)
  ) {
    return "Debe seleccionar una tarjeta de crédito / débito para generar la nota de crédito";
  }
  if (
    (values.saleCond === "Crédito" || values.saleCond === "Débito") &&
    !values.paymentsQuantity
  ) {
    return "Debe ingresar la cantidad de cuotas para generar la factura";
  }
  if (
    values.saleCond === "Contado" ||
    values.saleCond === "Transferencia" ||
    values.saleCond === "Cheque"
  ) {
    values.paymentsQuantity = "1";
    values.creditCard = "";
    values.debitCard = "";
  }
  return null;
};
