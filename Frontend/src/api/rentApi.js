import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getRents = async () => {
    try {
      const response = await axios.get(`${API_URL}/rents`);
      return response.data;
    } catch (error) {
      console.error("Error fetching rents:", error);
      return [];
    }
  };
  
  export const addRent = async (data) => {
    try {
      const response = await axios.post(`${API_URL}/rents/add`, data);
      return response.data;
    } catch (error) {
      console.error("Error adding rent:", error);
      return null;
    }
  };