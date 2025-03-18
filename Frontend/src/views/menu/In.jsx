import { useState, useEffect } from 'react';
import InOutModal from '@/components/Modal/InOutModal';
import Table from '@/components/Table/Table';
import { inFields } from '@/data/in-modal';
import { getCategories } from '@/api/categoryApi';
import {getCustomers} from '@/api/customerApi';
import { getSubcategoriesByCategory } from '@/api/subcategoryAPI';

const In = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inData, setInData] = useState([]); // Array of IN records
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [customersList, setCustomerList] =useState([]);

// Fetch categories on component mount
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

// Fetch subcategories when a category is selected
const handleCategoryChange = async (selectedCategory) => {
  try {
    const subcategoryList = await getSubcategoriesByCategory(selectedCategory);
    setSubcategories(subcategoryList.map((subcat) => subcat.subcategory));
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    setSubcategories([]);
  }
};

  const fetchCustomers = async ()=>{
    try {
      const customerData = await getCustomers();
      // console.log('Customer data',customerData);
      setCustomerList(customerData.map((cust)=> cust.name))
      // console.log('CUST Name',customersList);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  }

  const handleSubmit = (data) => {
    console.log('In data submitted:', data);
    setInData([...inData, data]);
    setIsModalOpen(false);
  };


  const payModes = ['Cash', 'Card', 'Online'];

  // Define table headers for IN records (you can adjust as needed)
  const tableHeaders = ['Customer', 'Payment Mode', 'Deposit'];

  // Map inData to the table data format expected by your Table component.
  // Keys must match the normalized version of the header (e.g. "customer", "payment_mode", "total_amount")
  const tableData = inData.map(record => ({
    customer: record.customer,
    payment_mode: record.payMode,
    total_amount: record.deposit
  }));

  return (
    <>
      
      <Table
        onButtonClick={() => { setSelectedRecord(null); setIsModalOpen(true); }}
        buttonLabel="Add In"
        tableHeaders={tableHeaders}
        tableData={tableData}
        onEdit={(row) => { setSelectedRecord(row); setIsModalOpen(true); }}
        onDelete={(row) => { /* Add deletion logic if needed */ }}
      />

      {isModalOpen && (
        <InOutModal
          show={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialData={selectedRecord}
          onSubmit={handleSubmit}
          mode="in"
          cartFields={inFields(categories, subcategories)}
          customers={customersList}
          payModes={payModes}
          getDepositRate={(cat, sub) => 10} // Dummy deposit rate function
          onCategoryChange={handleCategoryChange} // Pass category change handler
        />
      )}
    </>
  );
};

export default In;
