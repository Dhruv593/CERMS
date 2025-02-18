import axios from "axios";

const API_URL = "http://localhost:5000/api/subcategories"; // Adjust based on your backend

// Fetch all categories
export const getSubCategories = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    return [];
  }
};

// Add a new Subcategory
export const addSubCategory = async (categoryData) => {
  try {
    const response = await axios.post(`${API_URL}/subcategories/add`, categoryData);
    return response.data;
  } catch (error) {
    console.error("Error adding subcategory:", error);
    return null;
  }
};
