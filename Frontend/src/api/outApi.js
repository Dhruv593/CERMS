import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getMaterialInfoById =async (id) =>{
    console.log('API send id', id);
    try {
        const response = await axios.get(`${API_URL}/outdata/materialInfo/${id}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching material info:', error);
        throw error;
      }
}

export const getOutData = async () =>{
    try {
        const response = await axios.get(`${API_URL}/outdata`);
        return response.data;
      } catch (error) {
        console.error("Error fetching out data:", error.response?.data || error);
        return [];
      }
}

export const addOutData = async (data) => {
    console.log("API Passed data:", data);

    const formData = new FormData();
    formData.append("customer", data.customer || "");
    formData.append("receiver", data.receiver);
    formData.append("aadharPhoto", data.aadharPhoto);
    formData.append("other_proof", data.other_proof);
    formData.append("payMode", data.payMode);
    formData.append("deposit", data.deposit);
    formData.append("depositReturn", data.depositReturn);
    formData.append("remark", data.remark);
    formData.append("totalAmount", data.totalAmount);

    // Handling cartItems array with only required fields
    if (data.cartItems && Array.isArray(data.cartItems)) {
        data.cartItems.forEach((item, index) => {
            formData.append(`cartItems[${index}][category]`, item.category);
            formData.append(`cartItems[${index}][subcategory]`, item.subcategory);
            formData.append(`cartItems[${index}][quantity]`, item.quantity);
            formData.append(`cartItems[${index}][date]`, item.date);
        });
    }

    try {
        const response = await axios.post(`${API_URL}/outdata/add`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    } catch (error) {
        console.error("Error adding out data:", error.response?.data || error);
        return null;
    }
};

export const updateOutData = async (id, data) => {
    console.log("Updating Out Data:", id, data);

    const formData = new FormData();
    formData.append("customer", data.customer || "");
    formData.append("receiver", data.receiver);
    formData.append("aadharPhoto", data.aadharPhoto);
    formData.append("other_proof", data.other_proof);
    formData.append("payMode", data.payMode);
    formData.append("deposit", data.deposit);
    formData.append("remark", data.remark);
    formData.append("totalAmount", data.totalAmount);

    // Handling cartItems array
    if (data.cartItems && Array.isArray(data.cartItems)) {
        data.cartItems.forEach((item, index) => {
            formData.append(`cartItems[${index}][category]`, item.category);
            formData.append(`cartItems[${index}][subcategory]`, item.subcategory);
            formData.append(`cartItems[${index}][quantity]`, item.quantity);
            formData.append(`cartItems[${index}][date]`, item.date);
        });
    }

    try {
        const response = await axios.put(`${API_URL}/outdata/update/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    } catch (error) {
        console.error("Error updating out data:", error.response?.data || error);
        return null;
    }
};


// export const addOutData = async (data) => {
//   console.log("API Passed data:", data);

//   const formData = new FormData();
//   formData.append("customer", data.customer || "");
//   formData.append("receiver", data.receiver || "");
//   formData.append("aadharPhoto", data.aadharPhoto || "");
//   formData.append("other_proof", data.other_proof || "");
//   formData.append("payMode", data.payMode || "");
//   formData.append("deposit", data.deposit || "");
//   formData.append("remark", data.remark || "");

//   // Handling cartItems array with only required fields
//   if (data.cartItems && Array.isArray(data.cartItems)) {
//     data.cartItems.forEach((item, index) => {
//       formData.append(`cartItems[${index}][category]`, item.category || "");
//       formData.append(`cartItems[${index}][subcategory]`, item.subcategory || "");
//       formData.append(`cartItems[${index}][quantity]`, item.quantity || "");
//       formData.append(`cartItems[${index}][date]`, item.date || "");
//     });
//   }

  export const deleteOutData = async (data) => {
    console.log('deleteOutData API', data);

    const rowId = data.id; // ID of the row in "outdata"
    const materialInfoIds = data.material_info_id.includes(',') 
        ? data.material_info_id.split(',').map(id => id.trim())  // Convert to array if comma-separated
        : []; // Keep empty if it's a single ID

    try {
        // Delete the main row in "outdata"
        const outDataResponse = await axios.delete(`${API_URL}/outdata/delete/${rowId}`);

        // If there are multiple IDs (comma-separated), delete from "material_info"
        if (materialInfoIds.length > 1) {
            await Promise.all(
                materialInfoIds.map(async (materialId) => {
                    await axios.delete(`${API_URL}/materialinfo/delete/${materialId}`);
                })
            );
        }

        return outDataResponse.data;
    } catch (error) {
        console.error("Error deleting stock:", error.response?.data || error);
        return null;
    }
};
