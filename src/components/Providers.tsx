import CitiesProvider from "../context/providers/CitiesProvider";
import ClientProvider from "../context/providers/ClientProvider";
import SessionProvider from "../context/providers/SessionProvider";

interface Props {
  children: JSX.Element;
}

const Providers: React.FC<Props> = ({ children }) => {
  return (
    <CitiesProvider>
      <ClientProvider>
        <SessionProvider>{children}</SessionProvider>
      </ClientProvider>
    </CitiesProvider>
  );
};

export default Providers;
