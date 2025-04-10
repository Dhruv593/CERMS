// In.jsx 
import { useState, useEffect } from 'react';
import InOutModal from '@/components/Modal/InOutModal';
import Table from '@/components/Table/Table';
import { inFields } from '@/data/in-modal';
import { inMainFields } from '@/data/inMainFields';
import { getCategories } from '@/api/categoryApi';
import { getCustomers } from '@/api/customerApi';
import { getSubcategoriesByCategory } from '@/api/subcategoryAPI';
import { getInData, addInData, updateInData, deleteInData } from 'api/inApi';
import { getOutData } from 'api/outApi';
import { showErrorAlert, showSuccessAlert } from '@/utils/AlertService';
import { getMaterialInfoById } from '@/api/inApi';
import { getMaterialInfoById as getMaterialInfoForCustomer } from 'api/outApi';
import { getDeposits } from 'api/depositAPI';
import {getRents} from 'api/rentApi';
import MaterialInfoModal from '@/components/Modal/MaterialInfoModal';
import DeletePopUp from '@/components/PopUp/DeletePopUp';


const In = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inData, setInData] = useState([]); 
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [quantity, setQuantity] = useState([]);
  const [customersList, setCustomerList] = useState([]);
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [selectedMaterialInfo, setSelectedMaterialInfo] = useState(null);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [materialInfoList, setMaterialInfoList] = useState([]);
  
  const IMG_URL = import.meta.env.VITE_IMG_URL;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Initialize with empty arrays instead of fetching all categories
        setCategories([]);
        setSubcategories([]);
      } catch (error) {
        console.error('Error initializing categories:', error);
      }
    };
    fetchCategories();
    fetchCustomers();
    loadInData();
  }, []);

  const loadInData = async () => {
    const outRecords = await getInData();
      setInData(outRecords);
      console.log("loadInData: ",outRecords);
  }

  const handleCategoryChange = async (selectedCategory) => {
    try {
      // Filter subcategories from materialInfoList based on the selected category
      const filteredSubcategories = materialInfoList
        .filter(item => item.category.toLowerCase() === selectedCategory.toLowerCase())
        .map(item => item.subcategory);
      
      // Remove duplicates
      const uniqueSubcategories = [...new Set(filteredSubcategories)];
      
      console.log('Filtered subcategories for category:', selectedCategory, uniqueSubcategories);
      setSubcategories(uniqueSubcategories);
    } catch (error) {
      console.error('Error filtering subcategories:', error);
      setSubcategories([]);
    }
  };

  const handleDepositRate = async (cat, sub) =>{
    try {
      const depositData = await getDeposits();
      // console.log('Deposit Data:', depositData);

      // Find the deposit value based on category and subcategory
      const depositEntry = depositData.find(entry =>
          entry.category.toLowerCase() === cat.toLowerCase() &&
          entry.subcategory.toLowerCase() === sub.toLowerCase()
      );

      if (depositEntry) {
          console.log(`Deposit Value for Category: ${cat}, Subcategory: ${sub} is ${depositEntry.deposit}`);
          return depositEntry.deposit;
      } else {
          console.log(`No deposit value found for Category: ${cat}, Subcategory: ${sub}`);
          return null;
      }
     } catch (error) {
      console.error('Error fetching deposit data:', error);
      return null;
    } 
  }

  const handleRentRate = async (cat,sub) => {
    try {
      const rentData = await getRents();
      // console.log('Rent Data:', rentData);
  
      // Find the rent rate value based on category and subcategory
      const rentEntry = rentData.find(entry =>
        entry.category.toLowerCase() === cat.toLowerCase() &&
        entry.subcategory.toLowerCase() === sub.toLowerCase()
      );
  
      if (rentEntry) {
        console.log(`Rent Rate for Category: ${cat}, Subcategory: ${sub} is ${rentEntry.rent}`);
        return rentEntry.rent;
      } else {
        console.log(`No rent rate found for Category: ${cat}, Subcategory: ${sub}`);
        return null;
      }
    } catch (error) {
      console.error('Error fetching rent data:', error);
      return null;
    }
  }


  const handleCustomerChange = async (selectedCustomer) => {
    console.log('Selected Customer:', selectedCustomer);
    try {
        const outData = await getOutData();
        console.log('outdata from API in handleCustomerChange: ', outData);

        // Find ALL material_info entries for the selected customer
        const materialInfoIds = outData
            .filter(entry => entry.customer.toLowerCase() === selectedCustomer.toLowerCase())
            .map(entry => entry.material_info);

        if (materialInfoIds.length > 0) {
            console.log(`Material Info IDs for ${selectedCustomer}:`, materialInfoIds);
            try {
                // Fetch material info for all IDs and combine the results
                const allMaterialLists = await Promise.all(
                    materialInfoIds.map(id => getMaterialInfoForCustomer(id))
                );
                
                // Flatten the array of arrays into a single array
                const materialList = allMaterialLists.flat();
                
                // Create a map to store combined quantities for each category-subcategory pair
                const combinedMaterials = new Map();
                
                materialList.forEach(item => {
                    const key = `${item.category}-${item.subcategory}`;
                    if (combinedMaterials.has(key)) {
                        const existingItem = combinedMaterials.get(key);
                        // Add quantities together
                        existingItem.quantity = (parseInt(existingItem.quantity) + parseInt(item.quantity)).toString();
                        // Update other fields if needed (keeping the most recent values)
                        existingItem.invoice = item.invoice;
                        existingItem.return_date = item.return_date;
                        existingItem.amount = item.amount;
                    } else {
                        combinedMaterials.set(key, { ...item });
                    }
                });
                
                // Convert the map back to an array
                const combinedMaterialList = Array.from(combinedMaterials.values());
                
                console.log("Combined materialList with summed quantities: ", combinedMaterialList);
                setMaterialInfoList(combinedMaterialList);
                
                // Extract unique categories and subcategories from combined list
                const uniqueCategories = [...new Set(combinedMaterialList.map(item => item.category))];
                const uniqueSubcategories = [...new Set(combinedMaterialList.map(item => item.subcategory))];
                const uniqueQuantity = [...new Set(combinedMaterialList.map(item => item.quantity))];
                
                console.log("All categories for this customer:", uniqueCategories);
                console.log("All subcategories for this customer:", uniqueSubcategories);
                console.log("Combined quantities for this customer:", uniqueQuantity);
                
                // Update states
                setCategories(uniqueCategories);
                setSubcategories(uniqueSubcategories);
                setQuantity(uniqueQuantity);
            } catch (error) {
                console.error('Error fetching Customer Material Info by Id:', error);
                setMaterialInfoList([]);
                setCategories([]);
                setSubcategories([]);
                setQuantity([]);
            }
        } else {
            console.log(`No material info found for ${selectedCustomer}`);
            setMaterialInfoList([]);
            setCategories([]);
            setSubcategories([]);
            setQuantity([]);
        }
    } catch (error) {
        console.error('Error fetching Customer Material Info:', error);
        setMaterialInfoList([]);
        setCategories([]);
        setSubcategories([]);
    }
};

  useEffect(() => {
    console.log('materialInfoList state: ', materialInfoList);
}, [materialInfoList]);

  const fetchCustomers = async () => {
    try {
      const customerData = await getCustomers();
      setCustomerList(customerData.map((cust) => cust.name));
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };
  const handleDetails = async (materialInfoId) => {
    try {
      const materialInfo = await getMaterialInfoById(materialInfoId);
      console.log('Material Info:', materialInfo);
      setSelectedMaterialInfo(materialInfo);
      setIsMaterialModalOpen(true);
    } catch (error) {
      console.error('Error fetching material info:', error);
    }
  }

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
        await deleteInData(rowToDelete);
        const updatedData = await getInData();
        setInData(updatedData);
        setIsDeletePopupOpen(false);
        showSuccessAlert('Indata Deleted Successfully');
      } catch (error) {
        console.error('Error deleting data:', error);
        showErrorAlert('Error deleting data');
      }
    };

    const handleEditClick = async (row) => {
      if (!row?.id) {
          showErrorAlert('Invalid data item selected for editing.');
          return;
      }
      console.log('row', row);
    
      try {
          const materialData = await getMaterialInfoById(row.material_info_id);
          console.log('Material Data in handle Edit:', materialData);

          const updatedMaterialData = materialData.map((item) => ({
              ...item,
              category: item.category || '',
              subcategory: item.subcategory || '',
              invoice: item.invoice || '',
              returnQuantity: item.return_quantity || '',
              returnDate: item.return_date.split("T")[0] || '',
              totalAmount : item.amount || '',
          })); // Ensure correct assignment   
          console.log('Updated Material Data:', updatedMaterialData);
          const newRecord = {
              in_out_id: row.id || '',
              customer: row.customer || '',  // Ensure correct assignment
              receiver: row.receiver_name || '',
              payMode: row.payment_mode || '',
              deposit: row.deposit || '',
              aadharPhoto: row.aadharPhoto || '',
              other_proof: row.other_proof || '',
              remark: row.remark || '',
              cartItems: updatedMaterialData || [],
          };
    
          console.log('Updated selectedRecord:', newRecord);
          setSelectedRecord(newRecord);
          setIsModalOpen(true);
      } catch (error) {
          console.error('Error fetching material info:', error);
          showErrorAlert('Failed to fetch material info');
      }
    };

  const handleSubmit = async (data) => {
   
    console.log('In data submitted:', data);

      try {
          if (selectedRecord) {
              // Update existing record
              await updateInData(selectedRecord.in_out_id,data);
              showSuccessAlert('In data updated successfully!');
          } else {
              // Add new record
              await addInData(data);
              showSuccessAlert('In data added successfully!');
          }

          setIsModalOpen(false);
          setSelectedRecord(null);

          const updatedData = await getInData();
          setInData(updatedData);
      } catch (error) {
          console.error('Error submitting In data:', error);
          showErrorAlert('Error submitting In data!');
      }
  };

  const payModes = ['Cash', 'Card', 'Online'];
  const tableHeaders = ['Customer','Material Info','Receiver Name','Payment Mode','Aadhar Photo','Other Proof','Remark'];
  const tableData = inData.map(record => ({
    id: record.in_out_id,
    customer: record.customer,
    material_info_id: record.material_info,
    material_info:(<button onClick={() => handleDetails(record.material_info)} className='btn btn-outline-primary btn-sm'>Details</button>),
    // material_info:(<button className='bg-primary text-white rounded border-0' onClick={() => handleDetails(record.material_info)}>Details</button>),
    receiver_name:record.receiver,
    payment_mode: record.payMode,
    aadhar_photo: record.aadharPhoto ? `${IMG_URL}/${record.aadharPhoto}` : '',
    other_proof: record.other_proof ? `${IMG_URL}/${record.other_proof}` : '',
    remark: record.remark,
  }));

  // Get dynamic cart fields and main fields
  const cartFields = inFields(categories, subcategories, quantity);
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
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
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
          materialDataOfCustomer={materialInfoList}
          onCustomerChange={handleCustomerChange}
          getDepositRate={handleDepositRate}
          getRentRate={handleRentRate}
          onCategoryChange={handleCategoryChange}
        />
      )}
      
      {isMaterialModalOpen && selectedMaterialInfo && (
          <MaterialInfoModal
            materialData={selectedMaterialInfo}
            onClose={() => setIsMaterialModalOpen(false)}
            show={isMaterialModalOpen}
            mode="in"
          />
        )}
      {isDeletePopupOpen && (
        <DeletePopUp
        isOpen={isDeletePopupOpen}
        onClose={() => setIsDeletePopupOpen(false)}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this In data?"
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />
      )}
    </>
  );
};

export default In;
