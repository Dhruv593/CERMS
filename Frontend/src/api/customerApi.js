import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const getCustomers = async () => {
  try {
    const response = await axios.get(`${API_URL}/customers`);
    return response.data;
  } catch (error) {
    console.error('Error fetching customers:', error);
  }
};

export const addCustomer = async (data) => {
  if (!data.name || !data.email || !data.mobile || !data.address || !data.site_address) {
    console.error('Please provide all required fields');
    return null;
  }

  const formData = new FormData();
  formData.append('name', data.name);
  formData.append('email', data.email);
  formData.append('mobile', data.mobile);
  formData.append('address', data.address);
  formData.append('site_address', data.site_address);

  formData.append('aadharPhoto', data.aadharPhoto);

  formData.append('other_proof', data.other_proof);

  try {
    const response = await axios.post(`${API_URL}/customers/add`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) { 
    console.error('Error adding customer:', error.response?.data || error);
    return null;
  }
};

export const updateCustomer = async (id, data) => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => formData.append(key, data[key]));

  try {
    const response = await axios.put(`${API_URL}/customers/edit/${id}`, formData);
    return response.data;
  } catch (error) {
    console.error('Error updating customer:', error);
  }
};

export const deleteCustomer = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/customers/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting customer:', error);
  }
};
