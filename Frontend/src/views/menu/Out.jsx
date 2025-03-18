// Out.jsx
import { useState, useEffect } from 'react';
import InOutModal from '@/components/Modal/InOutModal';
import Table from '@/components/Table/Table';
import { outFields } from '@/data/out-modal'; // adjust the path as needed
import { outMainFields } from '@/data/outMainFields'; // adjust the path as needed
import { getCategories } from '@/api/categoryApi';
import { getCustomers } from '@/api/customerApi';
import { getSubcategoriesByCategory } from '@/api/subcategoryAPI';

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

  const handleSubmit = (data) => {
    console.log('Out data submitted:', data);
    setOutData([...outData, data]);
    setIsModalOpen(false);
  };

  const payModes = ['Cash', 'Card', 'Online'];
  const tableHeaders = ['Customer', 'Payment Mode', 'Deposit'];
  const tableData = outData.map(record => ({
    customer: record.customer,
    payment_mode: record.payMode,
    total_amount: record.depositReturn, // or record.deposit, adjust as needed
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
          getDepositRate={(cat, sub) => 10} // Example deposit rate function
          onCategoryChange={handleCategoryChange}
        />
      )}
    </>
  );
};

export default Out;
