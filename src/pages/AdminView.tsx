import { useState } from "react";
import Nav from "react-bootstrap/Nav";
import TabsComp from "../components/TabsComp";
import ClientProvider from "../context/providers/ClientProvider";
const AdminView = () => {
  const [activeTab, setActiveTab] = useState("Facturas");

  const NAV_LINKS = [
    "Facturas",
    "Notas de crédito",
    "Presupuestos",
    "Menú de creación",
  ];

  return (
    <ClientProvider>
      <>
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
