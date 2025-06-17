
import { TrendingUp, FileText, ShoppingCart, Users, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  {
    title: "Publications Totales",
    value: "24",
    change: "+12%",
    changeType: "positive",
    icon: FileText,
  },
  {
    title: "Commandes Actives",
    value: "18",
    change: "+5%",
    changeType: "positive",
    icon: ShoppingCart,
  },
  {
    title: "Revenus Mensuels",
    value: "12 000 000 FCFA",
    change: "+46%",
    changeType: "positive",
    icon: DollarSign,
  },
  {
    title: "Taux d'Engagement",
    value: "89%",
    change: "+7%",
    changeType: "positive",
    icon: TrendingUp,
  },
];

export const OverviewCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                {stat.change} par rapport au mois dernier
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
