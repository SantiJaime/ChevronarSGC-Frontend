interface Product {
  productName: string;
  price: number;
  quantity: number;
  productSubtotal: number;
}
interface ErrorMessage {
  msg: string;
  error: string | string[];
}
interface InvoiceData {
  saleCond: string;
  salePoint: string;
  invoiceType: string;
  creditCard?: string;
  debitCard?: string;
  paymentsQuantity: string;
}
interface Client {
  _id?: string;
  documentType: string;
  document: string;
  name: string;
  address: string;
  city: string;
  ivaCond: string;
}
interface NewInvoice extends InvoiceData {
  client: Client;
  products: Product[];
  payments?: PaymentMethods[];
}
interface ClientContextType {
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
}
interface City {
  _id?: string;
  province: string;
  city: string;
}
interface CitiesContextType {
  cities: City[];
  setCities: React.Dispatch<React.SetStateAction<City[]>>;
}

interface CreditNoteData {
  saleCond: string;
  salePoint: string;
  creditNoteType: string;
  creditCard?: string;
  assocInvoiceNumber: string;
  date: string;
  debitCard?: string;
  paymentsQuantity: string;
}
interface CreditNote extends CreditNoteData {
  client: Client;
  products: Product[];
}
interface UserLogin {
  username: string;
  password: string;
}
interface FullInvoice extends NewInvoice {
  _id: string;
  date: string;
  cae: number;
  caeExpiringDate: string;
  invoiceNumber: number;
  assocInvoiceNumber?: number;
  amounts: {
    total: number;
    iva: number;
    precioSinIva: number;
  };
  cancelled: boolean;
}

interface InvoiceSearch {
  fromDate: string;
  toDate: string;
  clientName: string;
  clientDocument: string;
  invoiceType: string;
  invoiceNumber: string;
  salePoint: string;
  total: string;
}

interface NewCreditNote {
  client: Client;
  products: Product[];
  saleCond: string;
  salePoint: string;
  invoiceType: string;
  creditCard?: string;
  debitCard?: string;
  paymentsQuantity: string;
  _id: string;
  assocInvoiceDate: string;
  assocInvoiceCae: string;
  assocInvoiceCaeExpiringDate: string;
  assocInvoiceNumber: string;
  amounts: {
    total: number;
    iva: number;
    precioSinIva: number;
  };
  saleCond: string;
  salePoint: string;
  invoiceType: string;
  creditCard?: string;
  debitCard?: string;
  paymentsQuantity: string;
}

interface PaymentMethods {
  id: string;
  method: string;
  creditCard?: string;
  debitCard?: string;
  paymentsQuantity: string;
  valueToPay: string;
}