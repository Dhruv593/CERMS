import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getSubcategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/subcategories`);
    return response.data;
  } catch (error) {
    console.error("Error fetching subcategories:", error);
  }
};

export const getSubcategoriesByCategory = async (category) => {
  try {
    const response = await axios.get(`${API_URL}/subcategories/${category}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching subcategories by category:", error);
    return [];
  }
};

export const addSubcategory = async (data) => {
  if (!data.category || !data.subcategory || !data.description || !data.image_path) {
    console.error("Please provide category, subcategory, description, and image");
    return null;
  }

  const formData = new FormData();
  formData.append("category", data.category);
  formData.append("subcategory", data.subcategory);
  formData.append("description", data.description);
  formData.append("image_path", data.image_path); // Ensure this is the actual file

  try {
    const response = await axios.post(`${API_URL}/subcategories/add`, formData);
    return response.data;
  } catch (error) {
    console.error("Error adding subcategory:", error.response?.data || error);
    return null;
  }
};

export const updateSubcategory = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}/subcategories/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating subcategory:", error);
  }
};

export const deleteSubcategory = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/subcategories/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting subcategory:", error);
  }
};


// import axios from "axios";

// const API_URL = import.meta.env.VITE_API_URL;

// export const getSubcategories = async () => {
//   try {
//     const response = await axios.get(`${API_URL}/subcategories`);
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching subcategories:", error);
//   }
// };

// export const getSubcategoriesByCategory = async (category) => {
//   try {
//     const response = await axios.get(`${API_URL}/subcategories/${category}`);
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching subcategories by category:", error);
//     return [];
//   }
// };

// export const addSubcategory = async (data) => {
//   if (!data.category || !data.subcategory || !data.description || !data.image_path) {
//     console.error("Please provide category, subcategory, description, and image");
//     return null;
//   }

//   const formData = new FormData();
//   formData.append("category", data.category);
//   formData.append("subcategory", data.subcategory);
//   formData.append("description", data.description);
//   formData.append("image_path", data.image_path); // Ensure this is the actual file

//   try {
//     const response = await axios.post(`${API_URL}/subcategories/add`, formData);
//     return response.data;
//   } catch (error) {
//     console.error("Error adding subcategory:", error.response?.data || error);
//     return null;
//   }
// };



