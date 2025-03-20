import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

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
    formData.append("customer", data.cartItems[0]?.customer || "");
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


  export const updateOutData = async (id, data) =>{

  }

  export const deleteOutData = async (id) =>{

  }