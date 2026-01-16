import { Container } from "react-bootstrap";
import NewClientComp from "./NewClientComp";
import NewInvoiceComp from "./NewInvoiceComp";
import NewCityComp from "./NewCityComp";
import Invoices from "./Invoices";
import NewBudgetComp from "./NewBudgetComp";
import { NAV_LINKS } from "../constants/const";
import Budgets from "./Budgets";
import NewSaleComp from './NewSaleComp';
import Sales from './Sales';

type TabKey = (typeof NAV_LINKS)[number];

interface Props {
  activeTab: TabKey;
}

const TabsComp: React.FC<Props> = ({ activeTab }) => {
  const TabContentMap = {
    "Creación de facturas": <NewInvoiceComp />,
    "Creación de presupuestos": <NewBudgetComp />,
    "Historial de facturas": <Invoices />,
    Ciudades: <NewCityComp />,
    Clientes: <NewClientComp />,
    "Historial de presupuestos": <Budgets />,
    "Creación de presupuesto de ventas": <NewSaleComp />,
    "Historial de presupuestos de ventas": <Sales />,
  };

  return (
    <Container className="mt-5">{TabContentMap[activeTab] || ""}</Container>
  );
};

export default TabsComp;
