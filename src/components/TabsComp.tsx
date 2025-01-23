import { Container } from "react-bootstrap";
import NewClientComp from "./NewClientComp";
import NewInvoiceComp from "./NewInvoiceComp";
import NewCityComp from "./NewCityComp";
import NewCreditNote from './NewCreditNote';
interface Props {
  activeTab: string;
}

const TabsComp: React.FC<Props> = ({ activeTab }) => {
  return (
    <Container className="mt-5">
      {activeTab === "Facturas" ? (
        <NewInvoiceComp />
      ) : activeTab === "Notas de crédito" ? (
        <NewCreditNote/>
      ) : activeTab === "Presupuestos" ? (
        <h1>Presupuestos</h1>
      ) : activeTab === "Menú de creación" ? (
        <>
          <NewClientComp />
          <hr />
          <NewCityComp />
        </>
      ) : (
        ""
      )}
    </Container>
  );
};

export default TabsComp;
