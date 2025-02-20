import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL; // Ensure this is set correctly

export const getStockData = async () => {
  try {
    const response = await axios.get(`${API_URL}/stockdata`);
    return response.data;
  } catch (error) {
    console.error("Error fetching stock data:", error.response?.data || error);
    return [];
  }
};


export const addStock = async (data) => {
  const formData = new FormData();
  formData.append("category", data.category);
  formData.append("subcategory", data.subcategory);
  formData.append("partyName", data.partyName);
  formData.append("partyContact", data.contactNumber);
  formData.append("purchaseFrom", data.purchaseFrom);
  formData.append("purchaseDateTime", data.purchaseDate); // Ensure the format is acceptable (ISO string)
  formData.append("purchaseQuantity", data.purchaseQuantity);
  formData.append("paymentMode", data.paymentMode);
  formData.append("transportInclude", data.transportInclude);
  formData.append("remarks", data.remarks);

  // Append files if available
  if (data.stockPhoto) {
    formData.append("stockPhoto", data.stockPhoto);
  }
  if (data.billPhoto) {
    formData.append("billPhoto", data.billPhoto);
  }

  try {
    const response = await axios.post(
      `${API_URL}/stockdata/add`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding stock:", error.response?.data || error);
    return null;
  }
};
