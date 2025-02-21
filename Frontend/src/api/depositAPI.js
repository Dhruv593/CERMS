import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getDeposits = async () => {
    try {
        const response = await axios.get(`${API_URL}/deposits`);
        return response.data;
    } catch (error) {
        console.error("Error fetching deposits:", error);
        return [];
    }
};

export const addDeposit = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/deposits/add`, data);
        return response.data;
    } catch (error) {
        console.error("Error adding deposit:", error);
        return null;
    }
};
