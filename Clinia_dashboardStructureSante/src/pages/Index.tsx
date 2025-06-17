
import { useState } from "react";
import { Sidebar } from "@/components/AppSidebar";
import { dashboardHeader } from "@/components/DashboardHeader";
import { OverviewCards } from "@/components/OverviewCards";
import { PublicationsSection } from "@/components/PublicationsSection";
import { OrdersSection } from "@/components/OrdersSection";
import { AnalyticsSection } from "@/components/AnalyticsSection";

const Index = () => {
  const [activeSection, setActiveSection] = useState("overview");

  const renderActiveSection = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="space-y-6">
            <OverviewCards />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PublicationsSection isPreview />
              <OrdersSection isPreview />
            </div>
            <AnalyticsSection isPreview />
          </div>
        );
      case "publications":
        return <PublicationsSection />;
      case "orders":
        return <OrdersSection />;
      case "analytics":
        return <AnalyticsSection />;
      default:
        return <OverviewCards />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex w-full">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="flex-1 flex flex-col">
        <dashboardHeader activeSection={activeSection} />
        <main className="flex-1 p-6">
          {renderActiveSection()}
        </main>
      </div>
    </div>
  );
};

export default Index;
