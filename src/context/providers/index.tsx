import { ComponentType, type ReactNode } from "react";
import CitiesProvider from "./CitiesProvider";
import ClientProvider from "./ClientProvider";
import InvoiceProductsProvider from "./InvoiceProductsProvider";
import SalesProvider from "./SalesProvider";
import SessionProvider from "./SessionProvider";

const combineProviders = (...providers: ComponentType<{ children: ReactNode }>[]) => {
  return ({ children }: { children: ReactNode }) =>
    providers.reduceRight(
      (acc, Provider) => <Provider>{acc}</Provider>,
      children
    );
};

export const Providers = combineProviders(
  SessionProvider,
  InvoiceProductsProvider,
  CitiesProvider,
  ClientProvider,
  SalesProvider
);
