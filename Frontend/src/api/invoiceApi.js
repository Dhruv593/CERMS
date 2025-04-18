import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const generateInvoice = async (outId) => {
    try {
        const response = await axios.get(`${API_URL}/invoice/generate/${outId}`, {
            responseType: 'blob'
        });
        return response.data;
    } catch (error) {
        console.error('Error generating invoice:', error);
        throw error;
    }
};

export const getInvoice = async (outId) => {
    try {
        const response = await axios.get(`${API_URL}/invoice/${outId}`, {
            responseType: 'blob'
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching invoice:', error);
        throw error;
    }
};