import React from "react";
import { FaStar, FaArrowUp } from "react-icons/fa";

const RatingTable = () => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Notations</h2>
      <div className="flex items-center mb-4">
        <span className="text-4xl font-bold">4.7</span>
        <FaStar className="text-yellow-500 text-3xl mx-2" />
        <span className="text-sm text-green-500 flex items-center">
          0.4 <FaArrowUp className="ml-1" />
        </span>
      </div>
      <ul className="space-y-2">
        {[5, 4, 3, 2, 1].map((stars, index) => (
          <li key={index} className="flex items-center">
            <span className="flex items-center">
              {Array(stars)
                .fill(0)
                .map((_, i) => (
                  <FaStar key={i} className="text-yellow-500 text-sm" />
                ))}
            </span>
            <div className="flex-1 h-2 bg-gray-200 mx-2 rounded-full">
              <div
                className="h-full bg-green-500 rounded-full"
                style={{ width: `${stars * 10}%` }} // Adjust width dynamically
              ></div>
            </div>
            <span>{stars * 50} users</span> {/* Replace with dynamic count */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RatingTable;
