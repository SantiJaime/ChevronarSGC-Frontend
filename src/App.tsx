import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Login from "./pages/Login";
import "./css/App.css";
import { Toaster } from "sonner";
import { PrivateRoutes, PublicRoutes } from "./components/PrivateRoutes";
import Sidebar from "./components/Sidebar";
import InvoicesView from "./pages/InvoicesView";
import BudgetsView from "./pages/BudgetsView";
import CreationMenuView from "./pages/CreationMenuView";
import SalesView from "./pages/SalesView";
import Providers from "./components/Providers";
import { Role } from './constants/const';

const App = () => {
  return (
    <Router>
      <Providers>
        <div className="App">
          <Sidebar />
          <main className="App-main">
            <Toaster richColors />
            <Routes>
              <Route
                path="/"
                element={
                  <PublicRoutes role={[Role.ADMIN, Role.VENDEDOR]}>
                    <Login />
                  </PublicRoutes>
                }
              />
              <Route
                path="/facturas"
                element={
                  <PrivateRoutes role={[Role.ADMIN]}>
                    <InvoicesView />
                  </PrivateRoutes>
                }
              />
              <Route
                path="/presupuestos"
                element={
                  <PrivateRoutes role={[Role.ADMIN, Role.VENDEDOR]}>
                    <BudgetsView />
                  </PrivateRoutes>
                }
              />
              <Route
                path="/ventas"
                element={
                  <PrivateRoutes role={[Role.ADMIN, Role.VENDEDOR]}>
                    <SalesView />
                  </PrivateRoutes>
                }
              />
              <Route
                path="/menu-de-creacion"
                element={
                  <PrivateRoutes role={[Role.ADMIN, Role.VENDEDOR]}>
                    <CreationMenuView />
                  </PrivateRoutes>
                }
              />
            </Routes>
          </main>
        </div>
      </Providers>
    </Router>
  );
};

export default App;
