


import { TrendingUp, Users, Eye, Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

interface AnalyticsSectionProps {
  isPreview?: boolean;
}

const revenueData = [
  { month: "Jan", revenue: 5502000, orders: 12 },
  { month: "Fév", revenue: 6414000, orders: 15 },
  { month: "Mar", revenue: 7336000, orders: 18 },
  { month: "Avr", revenue: 7074000, orders: 16 },
  { month: "Mai", revenue: 8122000, orders: 22 },
  { month: "Juin", revenue: 8646000, orders: 24 },
];

const engagementData = [
  { day: "Lun", views: 450, likes: 35 },
  { day: "Mar", views: 380, likes: 28 },
  { day: "Mer", views: 520, likes: 42 },
  { day: "Jeu", views: 610, likes: 48 },
  { day: "Ven", views: 490, likes: 38 },
  { day: "Sam", views: 320, likes: 25 },
  { day: "Dim", views: 280, likes: 22 },
];

export const AnalyticsSection = ({ isPreview }: AnalyticsSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              <span>Tendance Revenus et Commandes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={isPreview ? 200 : 300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis
                  tickFormatter={(value) =>
                    `${(value / 1000000).toFixed(1)}M`
                  }
                />
                <Tooltip
                  formatter={(value: number) =>
                    `${value.toLocaleString()} FCFA`
                  }
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3B82F6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="w-5 h-5 text-green-500" />
              <span>Engagement Hebdomadaire</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={isPreview ? 200 : 300}>
              <BarChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="views" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {!isPreview && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-gray-600">
                Publication la Plus Populaire
              </CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="font-semibold mb-2">
                Guide de Santé Cardiovasculaire
              </h3>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>1 249 vues</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Heart className="w-4 h-4" />
                  <span>89 j'aime</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-gray-600">
                Client Principal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="font-semibold mb-2">Hôpital Mémorial</h3>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>20 commandes</span>
                </div>
                <div className="text-green-600 font-semibold">
                {`${(1609750).toLocaleString()} FCFA`}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-gray-600">
                Taux de Réussite
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 mb-2">
                94%
              </div>
              <p className="text-sm text-gray-500">
                Taux d'approbation des publications
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
