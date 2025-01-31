import { useState } from "react";
import Nav from "react-bootstrap/Nav";
import TabsComp from "../components/TabsComp";
import ClientProvider from "../context/providers/ClientProvider";
import { Button, Spinner } from "react-bootstrap";
import { DoorOpen } from "react-bootstrap-icons";
import { logoutUser } from "../helpers/authQueries";
import { useNavigate } from "react-router-dom";
const AdminView = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("Facturas");
  const [loading, setLoading] = useState(false);
  const NAV_LINKS = [
    "Facturas",
    "Historial de facturas",
    "Presupuestos",
    "Menú de creación",
  ];

  const handleLogout = () => {
    setLoading(true);
    logoutUser()
      .then(() => {
        navigate("/");
        setLoading(false);
      })
      .catch((err) => console.error(err));
  };

  return (
    <ClientProvider>
      <>
        <div className="d-flex justify-content-end my-3 me-3">
          <Button
            className="d-flex align-items-center gap-1"
            variant="info"
            onClick={handleLogout}
          >
            {loading ? (
              <>
                <Spinner size='sm'/>
                <span>Cerrando sesión...</span>
              </>
            ) : (
              <>
                <DoorOpen />
                <span>Cerrar sesión</span>
              </>
            )}
          </Button>
        </div>
        <Nav fill variant="tabs" defaultActiveKey={activeTab}>
          {NAV_LINKS.map((link) => (
            <Nav.Item key={link}>
              <Nav.Link
                className="text-dark"
                eventKey={link}
                onClick={() => setActiveTab(link)}
              >
                {link}
              </Nav.Link>
            </Nav.Item>
          ))}
        </Nav>

        {NAV_LINKS.map(
          (link) =>
            link === activeTab && <TabsComp key={link} activeTab={activeTab} />
        )}
      </>
    </ClientProvider>
  );
};

export default AdminView;
