import { Route, Routes } from "react-router-dom";
import { Role } from "../constants/const";
import Login from "../pages/Login";
import { PrivateRoutes, PublicRoutes } from "./RoutesTypes";
import InvoicesView from "../pages/InvoicesView";
import BudgetsView from "../pages/BudgetsView";
import SalesView from "../pages/SalesView";
import CreationMenuView from "../pages/CreationMenuView";
import ProductsView from "../pages/ProductsView";

const RoutesView = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicRoutes role={[Role.ADMIN, Role.VENDEDOR, Role.MARTIN]}>
            <Login />
          </PublicRoutes>
        }
      />
      <Route
        path="/facturas"
        element={
          <PrivateRoutes role={[Role.ADMIN, Role.MARTIN]}>
            <InvoicesView />
          </PrivateRoutes>
        }
      />
      <Route
        path="/presupuestos"
        element={
          <PrivateRoutes role={[Role.ADMIN, Role.VENDEDOR, Role.MARTIN]}>
            <BudgetsView />
          </PrivateRoutes>
        }
      />
      <Route
        path="/ventas"
        element={
          <PrivateRoutes role={[Role.ADMIN, Role.VENDEDOR, Role.MARTIN]}>
            <SalesView />
          </PrivateRoutes>
        }
      />
      <Route
        path="/menu-de-creacion"
        element={
          <PrivateRoutes role={[Role.ADMIN, Role.VENDEDOR, Role.MARTIN]}>
            <CreationMenuView />
          </PrivateRoutes>
        }
      />
      <Route
        path="/productos"
        element={
          <PrivateRoutes role={[Role.ADMIN, Role.VENDEDOR, Role.MARTIN]}>
            <ProductsView />
          </PrivateRoutes>
        }
      />
    </Routes>
  );
};

export default RoutesView;
