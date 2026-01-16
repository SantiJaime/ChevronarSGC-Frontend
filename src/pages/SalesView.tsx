import { useState } from "react";
import TabsComp from "../components/TabsComp";
import { Nav } from "react-bootstrap";
import { NAV_LINKS } from "../constants/const";

const SalesView = () => {
  type TabKey = (typeof NAV_LINKS)[number];
  const [activeTab, setActiveTab] = useState<TabKey>("Creación de presupuesto de ventas");

  const NAV_LINKS_VENTAS = [
    "Creación de presupuesto de ventas",
    "Historial de presupuestos de ventas",
  ] as const;

  return (
    <>
      <Nav fill variant="tabs" defaultActiveKey={activeTab}>
        {NAV_LINKS_VENTAS.map((link) => (
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
  );
};

export default SalesView;
