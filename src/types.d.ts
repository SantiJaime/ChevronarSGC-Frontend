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
  creditCard: string;
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
interface FullInvoice extends InvoiceData {
  client: Client;
  products: Product[];
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
}
interface CreditNote extends CreditNoteData {
  client: Client;
  products: Product[];
}
interface UserLogin {
  email: string;
  password: string;
}