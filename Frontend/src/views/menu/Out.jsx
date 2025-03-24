// Out.jsx
import { useState, useEffect } from 'react';
import InOutModal from '@/components/Modal/InOutModal';
import MaterialInfoModal from '@/components/Modal/MaterialInfoModal';
import Table from '@/components/Table/Table';
import DeletePopUp from '@/components/PopUp/DeletePopUp';
import { outFields } from '@/data/out-modal'; // Adjust the path as needed
import { outMainFields } from '@/data/outMainFields'; // Adjust the path as needed
import { getCategories } from '@/api/categoryApi';
import { getCustomers } from '@/api/customerApi';
import { getSubcategoriesByCategory } from '@/api/subcategoryAPI';
import { getOutData, addOutData ,getMaterialInfoById, deleteOutData } from '@/api/outApi';
import { showErrorAlert, showSuccessAlert } from '@/utils/AlertService';

const Out = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [outData, setOutData] = useState([]); // Array of OUT records
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [customersList, setCustomerList] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [selectedMaterialInfo, setSelectedMaterialInfo] = useState(null); // Store fetched material info
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [rowToDelete, setRowToDelete] = useState(null);


  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch categories
        const categoriesData = await getCategories();
        setCategories(categoriesData.map(cat => cat.category));

        // Fetch customers
        const customerData = await getCustomers();
        setCustomerList(customerData.map(cust => cust.name));

        // Fetch OUT data
        const outRecords = await getOutData();
        setOutData(outRecords);
        console.log("outRecord",outRecords);
      } catch (error) {
        console.error('Error initializing data:', error);
      } finally {
        setIsLoading(false); // Set loading to false after fetching
      }
    };

    fetchInitialData();
  }, []);

  const handleCategoryChange = async (selectedCategory) => {
    try {
      const subcategoryList = await getSubcategoriesByCategory(selectedCategory);
      setSubcategories(subcategoryList.map(subcat => subcat.subcategory));
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      setSubcategories([]);
    }
  };

  const handleSubmit = async (data) => {
    console.log('Out data submitted:', data);
    setOutData([...outData, data]);
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

  const handleDetails = async (materialInfoId) => {
    try {
      const materialData = await getMaterialInfoById(materialInfoId);
      console.log('materialData', materialData);
      setSelectedMaterialInfo(materialData);
      setIsMaterialModalOpen(true);
    } catch (error) {
      console.error('Error fetching material info:', error);
      showErrorAlert('Failed to fetch material info');
    }
  };

  const handleDeleteClick = (row) => {
    console.log('row',row);
      if (!row || !row.id) {
        showErrorAlert('Invalid stock item selected for deletion.');
        return;
      }
      setRowToDelete(row);
      setIsDeletePopupOpen(true);
    };
  
    const confirmDelete = async () => {
      if (!rowToDelete || !rowToDelete.id) {
        showErrorAlert('Error deleting data. Invalid item selected.');
        return;
      }
      try {
        await deleteOutData(rowToDelete);
        
        setIsDeletePopupOpen(false);
        showSuccessAlert('Outdata Deleted Successfully');
      } catch (error) {
        console.error('Error deleting data:', error);
        showErrorAlert('Error deleting data');
      }
    };

  const payModes = ['Cash', 'Card', 'Online'];
  const tableHeaders = ['Customer', 'Material Info', 'Receiver Name', 'Payment Mode', 'Deposit', 'Aadhar Photo', 'Other Proof', 'Remark'];

  // Map outData to table format with safety checks for undefined values
  const tableData = outData.map(record => ({
    // customer: record.cartItems?.[0]?.customer ?? '',
    id: record.in_out_id,
    material_info_id: record.material_info,
    material_info:(<button onClick={() => handleDetails(record.material_info)}>Details</button>),
    customer: record.customer ?? '',
    // category: record.cartItems?.[0]?.category ?? '',
    // sub_category: record.cartItems?.[0]?.subcategory ?? '',
    receiver_name: record.receiver ?? '',
    // quantity: record.cartItems?.quantity ?? 0,
    payment_mode: record.payMode ?? '',
    deposit: record.deposit ?? 0,
    // rent: record.cartItems?.[0]?.rent ?? 0,
    // return_date: record.cartItems?.[0]?.date ?? '',
    aadhar_photo: record.aadharPhoto ?? '',
    other_proof: record.otherProof ?? '',
    remark: record.remark ?? '',
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
        onDelete={handleDeleteClick}
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

      {isLoading && <p>Loading...</p>} {/* Optional loading indicator */}

      {isMaterialModalOpen && selectedMaterialInfo && (
          <MaterialInfoModal
            materialData={selectedMaterialInfo}
            onClose={() => setIsMaterialModalOpen(false)}
            show={isMaterialModalOpen}
          />
        )}

      {isDeletePopupOpen && (
              <DeletePopUp
                isOpen={isDeletePopupOpen}
                onClose={() => setIsDeletePopupOpen(false)}
                onConfirm={confirmDelete}
                title="Confirm Deletion"
                message="Are you sure you want to delete this Out data?"
                confirmLabel="Delete"
                cancelLabel="Cancel"
              />
            )}
    </>
  );
};

export default Out;
