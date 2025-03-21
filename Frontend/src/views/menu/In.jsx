// In.jsx
import { useState, useEffect } from 'react';
import InOutModal from '@/components/Modal/InOutModal';
import Table from '@/components/Table/Table';
import { inFields } from '@/data/in-modal';
import { inMainFields } from '@/data/inMainFields';
import { getCategories } from '@/api/categoryApi';
import { getCustomers } from '@/api/customerApi';
import { getSubcategoriesByCategory } from '@/api/subcategoryAPI';

const In = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inData, setInData] = useState([]); 
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

  const handleCategoryChange = async (selectedCategory) => {
    try {
      const subcategoryList = await getSubcategoriesByCategory(selectedCategory);
      setSubcategories(subcategoryList.map((subcat) => subcat.subcategory));
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      setSubcategories([]);
    }
  };

  const fetchCustomers = async () => {
    try {
      const customerData = await getCustomers();
      setCustomerList(customerData.map((cust) => cust.name));
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleSubmit = (data) => {
    console.log('In data submitted:', data);
    setInData([...inData, data]);
    setIsModalOpen(false);
  };

  const payModes = ['Cash', 'Card', 'Online'];
  const tableHeaders = ['Customer','Category','Sub category','Receiver Name','Payment Mode','Deposit','Deposit Return','Rent','Return Date','Total Days','Return Quantity','Invoice','Total Amount','Aadhar Photo','Other Proof','Remark'];
  const tableData = inData.map(record => ({
    customer: record.cartItems[0].customer,
    category: record.cartItems[0].category,
    sub_category: record.cartItems[0].subcategory,
    receiver_name:record.receiver,
    payment_mode: record.payMode,
    deposit: record.cartItems[0].deposit,
    deposit_return: record.depositReturn,
    rent: record.cartItems[0].rent,
    return_date: record.cartItems[0].returnDate,
    total_days: record.cartItems[0].totalDays,
    return_quantity: record.cartItems[0].returnQuantity,
    invoice: record.cartItems[0].invoice,
    total_amount: record.totalAmount,
    aadhar_photo: record.aadharPhoto,
    other_proof: record.otherProof,
    remark: record.remark,
  }));

  // Get dynamic cart fields and main fields
  const cartFields = inFields(categories, subcategories);
  const mainFields = inMainFields(customersList, payModes);

  return (
    <>
      <Table
        onButtonClick={() => {
          setSelectedRecord(null);
          setIsModalOpen(true);
        }}
        buttonLabel="Add In"
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
          mode="in"
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

export default In;
