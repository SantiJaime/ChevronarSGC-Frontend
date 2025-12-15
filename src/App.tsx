import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Login from "./pages/Login";
import AdminView from "./pages/AdminView";
import "./css/App.css";
import { Toaster } from "sonner";
import { PrivateRoutes, PublicRoutes } from "./components/PrivateRoutes";

const App = () => {
  return (
    <Router>
      <div className="App">
        <main>
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
              path="/admin"
              element={
                <PrivateRoutes>
                  <AdminView />
                </PrivateRoutes>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
