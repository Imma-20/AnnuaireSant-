import React from "react";

interface CardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
}

const Card: React.FC<CardProps> = ({ title, value, icon, trend }) => {
  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <div className="flex items-center space-x-4">
        <div className="text-3xl text-blue-500">{icon}</div>
        <div>
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          <p className="text-xl font-bold text-gray-800">{value}</p>
          <span className="text-sm text-green-500">{trend}</span>
        </div>
      </div>
    </div>
  );
};

export default Card;
