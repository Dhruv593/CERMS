import React from "react";
import { useNavigate } from "react-router-dom";

const DashboardCard = ({ icon, title, value, navigateTo }) => {
  const navigate = useNavigate();

  const handleNavigation = (event) => {
    event.stopPropagation(); // ✅ Prevents parent event issues
    if (navigateTo) {
      navigate(navigateTo); 
    }
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md p-6 flex items-center space-x-4 border border-gray-200 hover:shadow-lg transition cursor-pointer"
      onClick={handleNavigation} // ✅ Fix navigation
    >
      <div>{icon}</div>
      <div>
        <h3 className="text-gray-600 text-sm">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
};

export default DashboardCard;
