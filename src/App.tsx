import { BrowserRouter } from "react-router-dom";
import "./css/App.css";
import { Toaster } from "sonner";
import Sidebar from "./components/layout/Sidebar";
import { Providers } from "./context/providers";
import RoutesView from "./routes/RoutesView";

const App = () => {
  return (
    <BrowserRouter>
      <Providers>
        <div className="App">
          <Sidebar />
          <main className="App-main">
            <Toaster richColors />
            <RoutesView />
          </main>
        </div>
      </Providers>
    </BrowserRouter>
  );
};

export default App;
