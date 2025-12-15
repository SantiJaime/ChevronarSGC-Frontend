import { Container } from "react-bootstrap";
import NewClientComp from "./NewClientComp";
import NewInvoiceComp from "./NewInvoiceComp";
import NewCityComp from "./NewCityComp";
import Invoices from "./Invoices";
import NewBudgetComp from "./NewBudgetComp";
import { NAV_LINKS } from "../constants/const";
import Budgets from "./Budgets";

type TabKey = (typeof NAV_LINKS)[number];

interface Props {
  activeTab: TabKey;
}

const TabsComp: React.FC<Props> = ({ activeTab }) => {
  const TabContentMap = {
    Facturas: <NewInvoiceComp />,
    Presupuestos: <NewBudgetComp />,
    "Historial de facturas": <Invoices />,
    "Menú de creación": (
      <>
        <NewClientComp />
        <hr />
        <NewCityComp />
      </>
    ),
    "Historial de presupuestos": <Budgets />,
  };

  // ...
  return (
    <Container className="mt-5">{TabContentMap[activeTab] || ""}</Container>
  );
};

export default TabsComp;
