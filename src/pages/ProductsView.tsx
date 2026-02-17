import { useState } from "react";
import TabsComp from "../components/TabsComp";
import { Nav } from "react-bootstrap";
import { NAV_LINKS, NAV_LINKS_PRODUCTOS, } from "../constants/const";

const ProductsView = () => {
      type TabKey = (typeof NAV_LINKS)[number];
      const [activeTab, setActiveTab] = useState<TabKey>("Tabla de productos");
  return (
        <>
      <Nav fill variant="tabs" defaultActiveKey={activeTab}>
        {NAV_LINKS_PRODUCTOS.map((link) => (
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
  )
}

export default ProductsView