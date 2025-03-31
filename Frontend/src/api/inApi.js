import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getInData = async (data) => {

}

export const addInData = async (data) => {
    console.log("API Passed In data:", data);

    const formData = new FormData();
    formData.append("customer", data.customer || "");
    formData.append("receiver", data.receiver);
    formData.append("aadharPhoto", data.aadharPhoto);
    formData.append("other_proof", data.other_proof);
    formData.append("payMode", data.payMode);
    formData.append("depositReturn", data.depositReturn);
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

}


export const deleteInData = async (data) => {

}