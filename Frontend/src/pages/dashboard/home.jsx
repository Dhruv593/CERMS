import React from "react";
import { Package, Layers, Warehouse, ShoppingCart, Users } from "lucide-react";

export function Home() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <DashboardCard
          icon={<Package className="text-blue-500 w-8 h-8" />}
          title="Total Category"
          value="12"
        />
        <DashboardCard
          icon={<Layers className="text-green-500 w-8 h-8" />}
          title="Total Subcategory"
          value="45"
        />
        <DashboardCard
          icon={<Warehouse className="text-yellow-500 w-8 h-8" />}
          title="Total Stock"
          value="350"
        />
        <DashboardCard
          icon={<ShoppingCart className="text-orange-500 w-8 h-8" />}
          title="Active Rentals"
          value="28"
        />
        <DashboardCard
          icon={<Users className="text-purple-500 w-8 h-8" />}
          title="Total Customers"
          value="120"
        />
        <DashboardCard
          // icon={<FileInvoice className="text-red-500 w-8 h-8" />}
          title="Pending Payments"
          value="₹75,000"
        />
      </div>
    </>
  );
}

const DashboardCard = ({ icon, title, value }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex items-center space-x-4 border border-gray-200 hover:shadow-lg transition">
      <div>{icon}</div>
      <div>
        <h3 className="text-gray-600 text-sm">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
};

export default Home;
