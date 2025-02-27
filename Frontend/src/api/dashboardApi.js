import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const fetchDashboardStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/dashboard/stats`);
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return { totalCategories: 0, totalSubcategories: 0, totalStock: 0 };
  }
};
