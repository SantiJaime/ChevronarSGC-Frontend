import { useState } from "react";
import TabsComp from "../components/TabsComp";
import { NAV_LINKS, NAV_LINKS_PRESUPUESTOS } from "../constants/const";

const BudgetsView = () => {
  type TabKey = (typeof NAV_LINKS)[number];
  const [activeTab, setActiveTab] = useState<TabKey>("Creación de presupuestos");

  return (
    <div className="flex flex-col gap-4">
      <nav className="flex border-b border-border bg-card rounded-t-lg overflow-hidden">
        {NAV_LINKS_PRESUPUESTOS.map((link) => (
          <button
            key={link}
            onClick={() => setActiveTab(link)}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === link
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {link}
          </button>
        ))}
      </nav>
      {NAV_LINKS.map(
        (link) =>
          link === activeTab && <TabsComp key={link} activeTab={activeTab} />
      )}
    </div>
  );
};

export default BudgetsView;
