export const validateInvoice = <T extends InvoiceData | BudgetData>(
  values: T,
  client: Client | null,
  products: Product[],
  paymentsLeftValue: number
) => {
  if (!client) return "Debe seleccionar un cliente para generar la factura";
  if (products.length === 0)
    return "Debe agregar al menos un producto para generar una factura";

  const { saleCond, creditCard, debitCard, paymentsQuantity } = values;

  const requiresCard = saleCond === "Crédito" || saleCond === "Débito";
  const requiresPayments = requiresCard && !paymentsQuantity;
  const invalidPayments =
    saleCond === "Múltiples métodos de pago" && paymentsLeftValue !== 0;
  const resetFields = ["Contado", "Transferencia", "Cheque"].includes(saleCond);

  if (requiresCard && !creditCard && !debitCard)
    return "Debe seleccionar una tarjeta de crédito / débito para generar la factura";

  if (requiresPayments)
    return "Debe ingresar la cantidad de cuotas para generar la factura";

  if (invalidPayments)
    return "El valor total de la factura es mayor a la suma del valor de los métodos de pago ingresados";

  if (resetFields) {
    values.paymentsQuantity = "1";
    values.creditCard = "";
    values.debitCard = "";
  }

  return null;
};

export const validateSearchInvoice = (values: InvoiceSearch) => {
  if (values.saleCond !== "Crédito" && values.saleCond !== "Débito") {
    values.creditCard = "";
    values.debitCard = "";
    values.paymentsQuantity = "";
  }
  if (values.saleCond === "Crédito") {
    values.debitCard = "";
  }
  if (values.saleCond === "Débito") {
    values.creditCard = "";
  }
};
