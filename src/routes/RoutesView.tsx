import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { Role } from "../constants/const";
import { PrivateRoutes, PublicRoutes } from "./RoutesTypes";
import { Spinner } from "../components/ui/Spinner";

const Login = lazy(() => import("../pages/Login"));
const InvoicesView = lazy(() => import("../pages/InvoicesView"));
const BudgetsView = lazy(() => import("../pages/BudgetsView"));
const SalesView = lazy(() => import("../pages/SalesView"));
const CreationMenuView = lazy(() => import("../pages/CreationMenuView"));
const ProductsView = lazy(() => import("../pages/ProductsView"));

const RoutesView = () => {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-full min-h-[50vh]"><Spinner size="lg" /></div>}>
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
    </Suspense>
  );
};

export default RoutesView;
