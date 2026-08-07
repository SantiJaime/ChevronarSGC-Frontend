import CitiesProvider from "./CitiesProvider";
import ClientProvider from "./ClientProvider";
import InvoiceProductsProvider from "./InvoiceProductsProvider";
import SalesProvider from "./SalesProvider";
import SessionProvider from "./SessionProvider";

interface Props {
  children: JSX.Element;
}

const Providers: React.FC<Props> = ({ children }) => {
  return (
    <SessionProvider>
      <InvoiceProductsProvider>
          <CitiesProvider>
            <ClientProvider>
              <SalesProvider>{children}</SalesProvider>
            </ClientProvider>
          </CitiesProvider>
      </InvoiceProductsProvider>
    </SessionProvider>
  );
};

export default Providers;
