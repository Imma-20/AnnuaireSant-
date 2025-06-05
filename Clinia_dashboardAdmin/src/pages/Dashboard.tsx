import React from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import RatingTable from "../components/RatingTable";
import StructureTable from "../components/StructureTable";
import ArticleTable from "../components/ArticleTable";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar fixe */}
      <div className="fixed left-0 top-0 h-full">
        <Sidebar />
      </div>

      {/* Contenu principal */}
      <div className="flex-1 ml-64">
        {/* Navbar fixe */}
        <div className="fixed top-0 left-64 right-0 z-10">
          <Navbar />
        </div>

        {/* Contenu défilable */}
        <div className="pt-16 p-6 overflow-y-auto h-screen">
          {/* Section des cartes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card
              title="Structures"
              value="25"
              icon={<FaArrowUp className="text-green-500 text-xl" />}
              trend="+12%"
            />
            <Card
              title="Commentaires"
              value="89"
              icon={<FaArrowDown className="text-red-500 text-xl" />}
              trend="-8%"
            />
            <Card
              title="Articles"
              value="15"
              icon={<FaArrowUp className="text-green-500 text-xl" />}
              trend="+25%"
            />
          </div>

          {/* Section des tableaux */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <RatingTable />
            <StructureTable />
          </div>
          <div className="mt-6">
            <ArticleTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
