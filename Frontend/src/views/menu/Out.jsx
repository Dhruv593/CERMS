// Out.jsx
import { useState, useEffect } from 'react';
import InOutModal from '@/components/Modal/InOutModal';
import Table from '@/components/Table/Table';
import { outFields } from '@/data/out-modal'; // adjust the path as needed
import { outMainFields } from '@/data/outMainFields'; // adjust the path as needed
import { getCategories } from '@/api/categoryApi';
import { getCustomers } from '@/api/customerApi';
import { getSubcategoriesByCategory } from '@/api/subcategoryAPI';
import { getOutData, addOutData } from '@/api/outApi';
import { showErrorAlert, showSuccessAlert } from '@/utils/AlertService';

const Out = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [outData, setOutData] = useState([]); // Array of OUT records
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [customersList, setCustomerList] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData.map((cat) => cat.category));
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const customerData = await getCustomers();
      setCustomerList(customerData.map((cust) => cust.name));
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleCategoryChange = async (selectedCategory) => {
    try {
      const subcategoryList = await getSubcategoriesByCategory(selectedCategory);
      setSubcategories(subcategoryList.map((subcat) => subcat.subcategory));
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      setSubcategories([]);
    }
  };

  const handleSubmit = async (data) => {
    console.log('Out data submitted:', data);
    setOutData([...outData, data]);
    // setIsModalOpen(false);
    try {
      await addOutData(data);
      showSuccessAlert('Out data added successfully!');
      setIsModalOpen(false);
      setSelectedRecord(null);
    } catch (error) {
      console.error('Error adding out data:', error);
      showErrorAlert('Error adding out data!');
    }
  };

  const payModes = ['Cash', 'Card', 'Online'];
  const tableHeaders = ['Customer','Category','Sub category','Receiver Name','Quantity','Return Date','Payment Mode','Deposit','Rent','Aadhar Photo','Other Proof','Remark'];
  const tableData = outData.map(record => ({
    customer: record.cartItems[0].customer,
    category: record.cartItems[0].category,
    sub_category: record.cartItems[0].subcategory,
    receiver_name:record.receiver,
    quantity: record.cartItems[0].quantity,
    payment_mode: record.payMode,
    deposit: record.cartItems[0].deposit,
    rent: record.cartItems[0].rent,
    return_date: record.cartItems[0].date,
    aadhar_photo: record.aadharPhoto,
    other_proof: record.otherProof,
    remark: record.remark,
  }));

  // Get dynamic fields for material (cart) and main details
  const cartFields = outFields(categories, subcategories);
  const mainFields = outMainFields(customersList, payModes);

  return (
    <>
      <Table
        onButtonClick={() => {
          setSelectedRecord(null);
          setIsModalOpen(true);
        }}
        buttonLabel="Add Out"
        tableHeaders={tableHeaders}
        tableData={tableData}
        onEdit={(row) => {
          setSelectedRecord(row);
          setIsModalOpen(true);
        }}
        onDelete={(row) => {
          // Add deletion logic if needed
        }}
      />

      {isModalOpen && (
        <InOutModal
          show={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialData={selectedRecord}
          onSubmit={handleSubmit}
          mode="out"
          mainFields={mainFields}
          cartFields={cartFields}
          customer={customersList}
          getDepositRate={(cat, sub) => 10} // Example deposit rate function
          onCategoryChange={handleCategoryChange}
        />
      )}
    </>
  );
};

export default Out;
