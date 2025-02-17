import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/categories`);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

export const addCategory = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/categories/add`, data);
    return response.data;
  } catch (error) {
    console.error("Error adding category:", error);
    return null;
  }
};