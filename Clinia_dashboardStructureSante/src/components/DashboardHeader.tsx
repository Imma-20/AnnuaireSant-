import {
  FileText,
  ShoppingCart,
  BarChart3,
  Home,
  Settings,
  User,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import exp from "constants";

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const DashboardHeader = [
  { id: "overview", icon: Home, label: "Aperçu" },
  { id: "publications", icon: FileText, label: "Publications" },
  { id: "orders", icon: ShoppingCart, label: "Commandes" },
  { id: "analytics", icon: BarChart3, label: "Analyses" },
  { id: "profile", icon: User, label: "Profil" },
  { id: "settings", icon: Settings, label: "Paramètres" },
];

export const dashboardHeader = ({ activeSection, setActiveSection }: SidebarProps) => {
  return (
    <div className="w-64 bg-green-600 text-white border-r border-green-700 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-green-700 bg-green-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <Heart className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">SantéDash</h1>
            <p className="text-sm text-green-200">Portail Professionnel</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {DashboardHeader.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveSection(item.id)}
                  className={cn(
                    "w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors",
                    isActive
                      ? "bg-white text-green-700 font-semibold"
                      : "hover:bg-green-500 hover:text-white text-white"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Profil */}
      <div className="p-4 border-t border-green-700 bg-green-700">
        <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">DR</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-green-800">Dr. Rodriguez</p>
            <p className="text-xs text-green-600">Cardiologue</p>
          </div>
        </div>
      </div>
    </div>


  );

  
};
export default dashboardHeader;