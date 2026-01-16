import CitiesProvider from "../context/providers/CitiesProvider";
import ClientProvider from "../context/providers/ClientProvider";
import SalesProvider from "../context/providers/SalesProvider";
import SessionProvider from "../context/providers/SessionProvider";

interface Props {
  children: JSX.Element;
}

const Providers: React.FC<Props> = ({ children }) => {
  return (
    <CitiesProvider>
      <ClientProvider>
        <SalesProvider>
          <SessionProvider>{children}</SessionProvider>
        </SalesProvider>
      </ClientProvider>
    </CitiesProvider>
  );
};

export default Providers;
