interface Product {
  productName: string;
  price: number;
  quantity: number;
  productSubtotal: number;
  productId: number;
}
interface Sale {
  clientName: string;
  sellerId: number;
  products: Product[];
}
interface ErrorMessage {
  msg: string;
  error: string | string[];
}
interface InvoiceData {
  saleCond: string;
  salePoint: string;
  invoiceType: string;
  cbteTipo?: number;
  creditCard?: string;
  debitCard?: string;
  paymentsQuantity: string;
  cuitOption: string;
}
interface BudgetData {
  saleCond: string;
  salePoint: string;
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
interface NewBudget extends BudgetData {
  client: Client;
  products: Product[];
  payments?: PaymentMethods[];
}
interface ClientContextType {
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
}
interface SessionContextType {
  session: boolean;
  setSession: React.Dispatch<React.SetStateAction<boolean>>;
  user: UserInfo | null;
  setUser: React.Dispatch<React.SetStateAction<UserInfo | null>>;
}
interface SalesContextType {
  sales: FullSaleWithPayments[];
  setSales: React.Dispatch<React.SetStateAction<FullSaleWithPayments[]>>;
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

interface FullBudget extends NewBudget {
  _id: string;
  date: string;
  budgetNumber: number;
  amounts: {
    total: number;
    iva: number;
    precioSinIva: number;
  };
}

interface InvoiceSearch {
  fromDate: string;
  toDate: string;
  cuitOption: string;
  clientName?: string;
  clientDocument?: string;
  cbteTipo?: number;
  invoiceNumber?: string;
  salePoint: string;
  total?: string;
  saleCond?: string;
  creditCard?: string;
  debitCard?: string;
  paymentsQuantity?: string;
}
interface BudgetSearch {
  fromDate: string;
  toDate: string;
  clientName?: string;
  clientDocument?: string;
  budgetNumber?: string;
  salePoint: string;
  total?: string;
  saleCond?: string;
  creditCard?: string;
  debitCard?: string;
  paymentsQuantity?: string;
}

interface NewCreditNote {
  cuitOption: string;
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
  valueWithInterest: number;
}
interface SaleWithProducts extends Sale {
  products: Product[];
}

interface FullSale extends SaleWithProducts {
  date: string;
  _id: string;
  saleNumber: number;
  total: number;
  authorized: boolean;
}

interface FullSaleWithPayments extends FullSale {
  payments: string;
  totalWithInterest: number;
}

interface CreateSaleResponse {
  msg: string;
  sale: SaleWithDate;
  result: string;
}

interface SaleSearch {
  authorized: boolean;
  sellerId: number;
  fromDate?: string;
  toDate?: string;
  saleNumber?: number;
}

interface GetSalesResponse {
  msg: string;
  sales: FullSaleWithPayments[];
  infoPagination: {
    page: number;
    limit: number;
    totalDocs: number;
    totalPages: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    prevPage: number | null;
    nextPage: number | null;
  };
}

interface PrintInvoiceResponse {
  result: string;
  msg: string;
}

interface UserInfo {
  username: string;
  role: string;
}

interface LoginUserResponse {
  msg: string;
  user: UserInfo;
}

interface EditSaleResponse {
  msg: string;
  sale: FullSaleWithPayments;
}

interface AuthorizeSaleResponse {
  msg: string;
  sale: FullSaleWithPayments;
  result: string;
}

interface ProductInDb {
  _id: string;
  productName: string;
  price: number;
  productId: number;
  stock: number;
}

interface ProductsContextType {
  productsInDb: ProductInDb[];
  setProductsInDb: React.Dispatch<React.SetStateAction<ProductInDb[]>>
  loading: boolean
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  searchProducts: (term: string) => ProductInDb[];
  handleGetProducts: (reload?: boolean) => Promise<void>;
}

interface InvoiceProductsContextType {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>
}
