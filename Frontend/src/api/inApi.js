import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getInData = async () => {
    try {
        const response = await axios.get(`${API_URL}/indata`);
        return response.data;
      } catch (error) {
        console.error("Error fetching IN data:", error.response?.data || error);
        return [];
      }
}
export const getMaterialInfoById =async (id) =>{
    console.log('API send id for material info: ', id);
    try {
        const response = await axios.get(`${API_URL}/indata/materialInfo/${id}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching material info:', error);
        throw error;
      }
}

export const addInData = async (data) => {
    console.log("API Passed In data:", data);

    const formData = new FormData();
    formData.append("customer", data.customer || "");
    formData.append("receiver", data.receiver);
    formData.append("aadharPhoto", data.aadharPhoto);
    formData.append("other_proof", data.other_proof);
    formData.append("payMode", data.payMode);
    // formData.append("depositReturn", data.depositReturn);
    formData.append("remark", data.remark);

    // Handling cartItems array with only required fields
    if (data.cartItems && Array.isArray(data.cartItems)) {
        data.cartItems.forEach((item, index) => {
            formData.append(`cartItems[${index}][category]`, item.category);
            formData.append(`cartItems[${index}][subcategory]`, item.subcategory);
            formData.append(`cartItems[${index}][returnQuantity]`, item.returnQuantity);
            formData.append(`cartItems[${index}][returnDate]`, item.returnDate);
            formData.append(`cartItems[${index}][invoice]`, item.invoice);
            formData.append(`cartItems[${index}][totalAmount]`, item.totalAmount);
            formData.append(`cartItems[${index}][depositReturn]`, item.depositReturn);
            formData.append(`cartItems[${index}][rent]`, item.rent);
            formData.append(`cartItems[${index}][totalDays]`, item.totalDays);
            formData.append(`cartItems[${index}][deposit]`, item.deposit);
            // formData.append(`cartItems[${index}][depositReturn]`, item.depositReturn);
        });
    }

    try {
        const response = await axios.post(`${API_URL}/indata/add`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    } catch (error) {
        console.error("Error adding in data:", error.response?.data || error);
        return null;
    }
};

export const updateInData = async (id,data) => {
    console.log("API Passed Update In data:", { id, data });

    const formData = new FormData();
    formData.append("customer", data.customer || "");
    formData.append("receiver", data.receiver);
    formData.append("aadharPhoto", data.aadharPhoto);
    formData.append("other_proof", data.other_proof);
    formData.append("payMode", data.payMode);
    formData.append("remark", data.remark);

    // Handling cartItems array with only required fields
    if (data.cartItems && Array.isArray(data.cartItems)) {
        data.cartItems.forEach((item, index) => {
            formData.append(`cartItems[${index}][category]`, item.category);
            formData.append(`cartItems[${index}][subcategory]`, item.subcategory);
            formData.append(`cartItems[${index}][returnQuantity]`, item.returnQuantity);
            formData.append(`cartItems[${index}][returnDate]`, item.returnDate);
            formData.append(`cartItems[${index}][invoice]`, item.invoice);
            formData.append(`cartItems[${index}][totalAmount]`, item.totalAmount);
            formData.append(`cartItems[${index}][depositReturn]`, item.depositReturn);
            formData.append(`cartItems[${index}][rent]`, item.rent);
            formData.append(`cartItems[${index}][totalDays]`, item.totalDays);
            formData.append(`cartItems[${index}][deposit]`, item.deposit);
        });
    }

    try {
        const response = await axios.put(`${API_URL}/indata/update/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    } catch (error) {
        console.error("Error updating In data:", error.response?.data || error);
        return null;
    }
}


export const deleteInData = async (data) => {
    console.log('deleteInData API', data);

    const rowId = data.id; // ID of the row in "outdata"
    const materialInfoIds = data.material_info_id.includes(',') 
        ? data.material_info_id.split(',').map(id => id.trim())  // Convert to array if comma-separated
        : []; // Keep empty if it's a single ID

    try {
        // Delete the main row in "in data"
        const inDataResponse = await axios.delete(`${API_URL}/indata/delete/${rowId}`);

        // If there are multiple IDs (comma-separated), delete from "material_info_in"
        if (materialInfoIds.length > 1) {
            await Promise.all(
                materialInfoIds.map(async (materialId) => {
                    await axios.delete(`${API_URL}/materialinfoin/delete/${materialId}`);
                })
            );
        }

        return inDataResponse.data;
    } catch (error) {
        console.error("Error deleting In data:", error.response?.data || error);
        return null;
    }
}