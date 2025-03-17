import { useState, useEffect } from 'react';
import InOutModal from '@/components/Modal/InOutModal';
import Table from '@/components/Table/Table';
import { outFields } from '@/data/out-modal';
import { getCategories } from '@/api/categoryApi';
import { getSubcategoriesByCategory } from '@/api/subcategoryAPI';

const Out = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [outData, setOutData] = useState([]); // Array of OUT records
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  
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

  const handleSubmit = (data) => {
    console.log('Out data submitted:', data);
    setOutData([...outData, data]);
    setIsModalOpen(false);
  };

  const customers = ['Customer X', 'Customer Y'];
  const payModes = ['Cash', 'Card', 'Online'];

  // Define table headers for OUT records
  const tableHeaders = ['Customer', 'Payment Mode', 'Deposit'];

  // Map outData to the table data format
  const tableData = outData.map(record => ({
    customer: record.customer,
    payment_mode: record.payMode,
    total_amount: record.deposit
  }));

  return (
    <>
      
      <Table
        onButtonClick={() => { setSelectedRecord(null); setIsModalOpen(true); }}
        buttonLabel="Add Out"
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
          mode="out"
          cartFields={outFields(categories, subcategories)}
          customers={customers}
          payModes={payModes}
          getDepositRate={(cat, sub) => 10} // Dummy deposit rate function
          onCategoryChange={handleCategoryChange}
        />
      )}
    </>
  );
};

export default Out;
