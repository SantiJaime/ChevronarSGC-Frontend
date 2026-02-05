import { IAuthorizeSale, ISearchSale } from "./validationSchemas";

export const validateInvoice = <T extends InvoiceData | BudgetData>(
  values: T,
  client: Client | null,
  products: Product[],
  paymentsLeftValue: number,
): string | null => {
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

export const validateSearchInvoice = <T extends InvoiceSearch | BudgetSearch>(
  values: T,
) => {
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

export const validateSearchSale = (values: ISearchSale): string | null => {
  if (values.fromDate && !values.toDate) {
    return "Si ingresa una fecha de inicio, debe ingresar una fecha de fin";
  }
  if (values.toDate && !values.fromDate) {
    return "Si ingresa una fecha de fin, debe ingresar una fecha de inicio";
  }
  if (
    values.fromDate &&
    values.toDate &&
    new Date(values.fromDate) > new Date(values.toDate)
  ) {
    return "La fecha de fin debe ser mayor a la fecha de inicio";
  }
  return null;
};

export const validateAuthorizeSale = (
  values: IAuthorizeSale,
): string | null => {
  if (values.method === "Crédito" && !values.creditCard) {
    return "Debes seleccionar una tarjeta de crédito";
  }

  if (values.method === "Débito" && !values.debitCard) {
    return "Debes seleccionar una tarjeta de débito";
  }

  const resetFields = ["Contado", "Transferencia", "Cheque"].includes(
    values.method,
  );

  if (resetFields) {
    values.paymentsQuantity = "1";
    values.creditCard = "";
    values.debitCard = "";
  }
  
  if (values.method === "Múltiples métodos de pago") {
    return "Aún no disponible. Se encuentra en desarrollo";
  }

  return null;
};
