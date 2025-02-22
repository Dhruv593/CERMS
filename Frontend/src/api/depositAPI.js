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
        if (!data.category || !data.subcategory || !data.deposit) {
            console.log(data)
            console.error("Error: Missing required fields");
            return null;
        }
    
        try {
            const response = await axios.post(`${API_URL}/deposits/add`, data, {
                headers: { "Content-Type": "application/json" }, // ✅ Ensure JSON format
            });
            return response.data;
        } catch (error) {
            console.error("Error adding deposit:", error.response?.data || error);
            return null;
        }
    };

    export const updateDeposit = async (id, data) => {
        try {
            const response = await axios.put(`${API_URL}/deposits/edit/${id}`, data); 
            return response.data;
        } catch (error) {
            console.error("Error updating deposit:", error.response?.data || error);
            return null;
        }
    };
    
    export const deleteDeposit = async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/deposits/delete/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error deleting deposit:", error.response?.data || error);
            return null;
        }
    };
    
