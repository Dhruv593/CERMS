import React, { useEffect, useState } from "react";
import { Package, Layers, Warehouse, ShoppingCart, Users } from "lucide-react";
import DashboardCard from "./DashboardCard";
import { fetchDashboardStats } from "@/api/dashboardApi";

export function Home() {
  const [stats, setStats] = useState({
    totalCategories: 0,
    totalSubcategories: 0,
    totalStock: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      const data = await fetchDashboardStats();
      setStats(data);
    };
    loadStats();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <DashboardCard
        icon={<Package className="text-blue-500 w-8 h-8" />}
        title="Total Categories"
        value={stats.totalCategories}
        navigateTo="/category"
      />
      <DashboardCard
        icon={<Layers className="text-green-500 w-8 h-8" />}
        title="Total Subcategories"
        value={stats.totalSubcategories}
        navigateTo="/subcategory"
      />
      <DashboardCard
        icon={<Warehouse className="text-yellow-500 w-8 h-8" />}
        title="Total Stock Quantity"
        value={stats.totalStock}
        navigateTo="/stock"
      />
      <DashboardCard
        icon={<ShoppingCart className="text-orange-500 w-8 h-8" />}
        title="Active Rentals"
        value="28"
        navigateTo="/rentals"
      />
      <DashboardCard
        icon={<Users className="text-purple-500 w-8 h-8" />}
        title="Total Customers"
        value="120"
        navigateTo="/customers"
      />
    </div>
  );
}

export default Home;
