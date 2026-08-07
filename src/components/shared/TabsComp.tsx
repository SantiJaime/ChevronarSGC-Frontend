import NewClientComp from "../entities/NewClientComp";
import NewInvoiceComp from "../invoices/NewInvoiceComp";
import NewCityComp from "../entities/NewCityComp";
import Invoices from "../invoices/Invoices";
import NewBudgetComp from "../budgets/NewBudgetComp";
import { NAV_LINKS } from "../../constants/const";
import Budgets from "../budgets/Budgets";
import NewSaleComp from "../sales/NewSaleComp";
import Sales from "../sales/Sales";
import ProductsTableComp from "../products/ProductsTableComp";
import ProductsLogs from "../products/ProductsLogs";
import { Card, CardContent } from "../ui/Card";

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
    <Card className="mt-4 bg-slate-800/90">
      <CardContent className="p-6">
        {tabContentMap[activeTab]}
      </CardContent>
    </Card>
  );
};

export default TabsComp;
