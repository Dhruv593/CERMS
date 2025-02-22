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
  const formData = new FormData();
  formData.append("category", data.category);
  formData.append("subcategory", data.subcategory);
  formData.append("description", data.description);
  if (data.image) {
    formData.append("image", data.image);
  }

  console.log("FormData content:");
  for (let pair of formData.entries()) {
    console.log(pair[0], pair[1]);
  }

  try {
    const response = await axios.post(`${API_URL}/subcategories/add`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding subcategory:", error.response?.data || error);
  }
};


// export const addSubcategory = async (data) => {
//   const formData = new FormData();
//   formData.append("category", data.category);
//   formData.append("subcategory", data.subcategory);
//   formData.append("description", data.description);
//   if (data.image) {
//     formData.append("image", data.image);
//   }

//   try {
//     const response = await axios.post(`${API_URL}/subcategories/add`, formData, {
//       headers: { "Content-Type": "multipart/form-data" },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error adding subcategory:", error);
//   }
// };
