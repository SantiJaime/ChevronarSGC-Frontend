import CitiesProvider from "../context/providers/CitiesProvider";
import ClientProvider from "../context/providers/ClientProvider";
import InvoiceProductsProvider from "../context/providers/InvoiceProductsProvider";
import SalesProvider from "../context/providers/SalesProvider";
import SessionProvider from "../context/providers/SessionProvider";

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
