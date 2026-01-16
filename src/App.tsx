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
                  <PublicRoutes>
                    <Login />
                  </PublicRoutes>
                }
              />
              <Route
                path="/facturas"
                element={
                  <PrivateRoutes>
                    <InvoicesView />
                  </PrivateRoutes>
                }
              />
              <Route
                path="/presupuestos"
                element={
                  <PrivateRoutes>
                    <BudgetsView />
                  </PrivateRoutes>
                }
              />
              <Route
                path="/ventas"
                element={
                  <PrivateRoutes>
                    <SalesView />
                  </PrivateRoutes>
                }
              />
              <Route
                path="/menu-de-creacion"
                element={
                  <PrivateRoutes>
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
