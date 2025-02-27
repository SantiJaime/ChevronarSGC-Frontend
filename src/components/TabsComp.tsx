import { Container } from "react-bootstrap";
import NewClientComp from "./NewClientComp";
import NewInvoiceComp from "./NewInvoiceComp";
import NewCityComp from "./NewCityComp";
import Invoices from "./Invoices";
interface Props {
  activeTab: string;
}

const TabsComp: React.FC<Props> = ({ activeTab }) => {
  return (
    <Container className="mt-5">
      {activeTab === "Facturas" ? (
        <NewInvoiceComp type={"Invoice"} />
      ) : activeTab === "Presupuestos" ? (
        <NewInvoiceComp type={"Budget"} />
      ) : activeTab === "Menú de creación" ? (
        <>
          <NewClientComp />
          <hr />
          <NewCityComp />
        </>
      ) : activeTab === "Historial de facturas" ? (
        <Invoices />
      ) : (
        ""
      )}
    </Container>
  );
};

export default TabsComp;
