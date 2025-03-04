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
    console.log(data);
    const response = await axios.post(`${API_URL}/categories/add`, data);
    return response.data;
  } catch (error) {
    console.error("Error adding category:", error);
    return null;
  }
};

export const updateCategory = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}/categories/edit/${id}`, data); // ✅ Corrected path
    return response.data;
  } catch (error) {
    console.error("Error updating category:", error.response?.data || error);
    return null;
  }
};

export const deleteCategory = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/categories/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting category:", error.response?.data || error);
    return null;
  }
};