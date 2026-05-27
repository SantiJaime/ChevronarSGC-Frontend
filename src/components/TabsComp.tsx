import NewClientComp from "./NewClientComp";
import NewInvoiceComp from "./NewInvoiceComp";
import NewCityComp from "./NewCityComp";
import Invoices from "./Invoices";
import NewBudgetComp from "./NewBudgetComp";
import { NAV_LINKS } from "../constants/const";
import Budgets from "./Budgets";
import NewSaleComp from "./NewSaleComp";
import Sales from "./Sales";
import ProductsTableComp from "./ProductsTableComp";
import ProductsLogs from "./ProductsLogs";
import { Card, CardContent } from "./ui/Card";

type TabKey = (typeof NAV_LINKS)[number];

interface Props {
  activeTab: TabKey;
}

const TabsComp: React.FC<Props> = ({ activeTab }) => {
  const tabContentMap = {
    "Creación de facturas": <NewInvoiceComp />,
    "Creación de presupuestos": <NewBudgetComp />,
    "Historial de facturas": <Invoices />,
    Ciudades: <NewCityComp />,
    Clientes: <NewClientComp />,
    "Historial de presupuestos": <Budgets />,
    "Creación de presupuesto de ventas": <NewSaleComp />,
    "Historial de presupuestos de ventas": <Sales />,
    "Tabla de productos": <ProductsTableComp />,
    "Consultar ventas de productos": <ProductsLogs />,
  } satisfies Record<TabKey, React.ReactElement>;

  return (
    <Card className="mt-4 bg-gray-300/90">
      <CardContent className="p-6">
        {tabContentMap[activeTab]}
      </CardContent>
    </Card>
  );
};

export default TabsComp;
