import NewClient from "../entities/NewClient";
import NewInvoice from "../invoices/NewInvoice";
import NewCity from "../entities/NewCity";
import Invoices from "../invoices/Invoices";
import NewBudget from "../budgets/NewBudget";
import { NAV_LINKS } from "../../constants/const";
import Budgets from "../budgets/Budgets";
import NewSale from "../sales/NewSale";
import Sales from "../sales/Sales";
import ProductsTable from "../products/ProductsTable";
import ProductsLogs from "../products/ProductsLogs";
import { Card, CardContent } from "../ui/Card";

type TabKey = (typeof NAV_LINKS)[number];

interface Props {
  activeTab: TabKey;
}

const Tabs: React.FC<Props> = ({ activeTab }) => {
  const tabContentMap = {
    "Creación de facturas": <NewInvoice />,
    "Creación de presupuestos": <NewBudget />,
    "Historial de facturas": <Invoices />,
    Ciudades: <NewCity />,
    Clientes: <NewClient />,
    "Historial de presupuestos": <Budgets />,
    "Creación de presupuesto de ventas": <NewSale />,
    "Historial de presupuestos de ventas": <Sales />,
    "Tabla de productos": <ProductsTable />,
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

export default Tabs;
