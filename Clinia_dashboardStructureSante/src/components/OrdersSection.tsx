import { useState } from "react";
import { Clock, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface OrdersSectionProps {
  isPreview?: boolean;
}

const orders = [
  {
    id: "CMD-001",
    client: "Dr. Sarah Johnson",
    service: "Rapport de Consultation Cardiologique",
    amount: 163750,
    status: "en-attente",
    date: "2024-06-14",
    dueDate: "2024-06-16",
  },
  {
    id: "CMD-002",
    client: "Hôpital Mémorial",
    service: "Matériel de Formation Médicale",
    amount: 491250,
    status: "terminé",
    date: "2024-06-13",
    dueDate: "2024-06-15",
  },
  {
    id: "CMD-003",
    client: "Dr. Michael Chen",
    service: "Révision de Publication de Recherche",
    amount: 98250,
    status: "en-cours",
    date: "2024-06-12",
    dueDate: "2024-06-17",
  },
  {
    id: "CMD-004",
    client: "Réseau Santé Inc.",
    service: "Document de Directives Cliniques",
    amount: 327500,
    status: "en-attente",
    date: "2024-06-11",
    dueDate: "2024-06-18",
  },
];

const statusIcons = {
  "en-attente": { icon: Clock, color: "text-yellow-500" },
  "en-cours": { icon: Clock, color: "text-blue-500" },
  "terminé": { icon: CheckCircle, color: "text-green-500" },
  "annulé": { icon: XCircle, color: "text-red-500" },
};

const statusLabels = {
  all: "Toutes",
  "en-attente": "En Attente",
  "en-cours": "En Cours",
  terminé: "Terminées",
};

export const OrdersSection = ({ isPreview }: OrdersSectionProps) => {
  const [selectedStatus, setSelectedStatus] = useState("all");

  const filteredOrders = orders.filter(
    (order) => selectedStatus === "all" || order.status === selectedStatus
  );

  const displayedOrders = isPreview ? filteredOrders.slice(0, 3) : filteredOrders;

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <span>Commandes et Demandes</span>
            {!isPreview && <Badge variant="secondary">{orders.length}</Badge>}
          </CardTitle>
        </div>
        {!isPreview && (
          <div className="flex space-x-2 mt-4">
            {["all", "en-attente", "en-cours", "terminé"].map((status) => (
              <Button
                key={status}
                variant={selectedStatus === status ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStatus(status)}
              >
                {statusLabels[status as keyof typeof statusLabels]}
              </Button>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {displayedOrders.map((order) => {
          const StatusIcon = statusIcons[order.status as keyof typeof statusIcons].icon;
          const iconColor = statusIcons[order.status as keyof typeof statusIcons].color;

          return (
            <div
              key={order.id}
              className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <StatusIcon className={`w-5 h-5 ${iconColor}`} />
                  <div>
                    <h4 className="font-semibold text-gray-900">{order.id}</h4>
                    <p className="text-sm text-gray-600">{order.client}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 text-green-600 font-semibold">
                    <span>{order.amount.toLocaleString()} FCFA</span>
                  </div>
                  <Badge
                    variant={order.status === "terminé" ? "default" : "secondary"}
                    className="mt-1"
                  >
                    {order.status.replace("-", " ")}
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-3">{order.service}</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Commandé : {order.date}</span>
                <span>Échéance : {order.dueDate}</span>
              </div>
            </div>
          );
        })}
        {isPreview && (
          <Button variant="ghost" className="w-full text-blue-600">
            Voir Toutes les Commandes
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
