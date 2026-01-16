import CitiesProvider from "../context/providers/CitiesProvider";
import ClientProvider from "../context/providers/ClientProvider";
import SalesProvider from "../context/providers/SalesProvider";
import SessionProvider from "../context/providers/SessionProvider";

interface Props {
  children: JSX.Element;
}

const Providers: React.FC<Props> = ({ children }) => {
  return (
    <SessionProvider>
      <CitiesProvider>
        <ClientProvider>
          <SalesProvider>{children}</SalesProvider>
        </ClientProvider>
      </CitiesProvider>
    </SessionProvider>
  );
};

export default Providers;
