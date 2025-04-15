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
    try {
        const outData = await getOutData();
        const inData = await getInData(); // Add this to get all IN records

        // Filter and map material info entries
        const materialInfoEntries = outData
            .filter(entry => entry.customer.toLowerCase() === selectedCustomer.toLowerCase())
            .map(entry => ({
                material_info_id: entry.material_info,
                created_at: entry.created_at,
                outId: entry.in_out_id // Store the OUT ID
            }));

        if (materialInfoEntries.length > 0) {
            try {
                // Fetch all material info
                const allMaterialLists = await Promise.all(
                    materialInfoEntries.map(async entry => {
                        const materialInfo = await getMaterialInfoForCustomer(entry.material_info_id);
                        return materialInfo.map(info => ({ 
                            ...info, 
                            created_at: entry.created_at,
                            outId: entry.outId
                        }));
                    })
                );

                const materialList = allMaterialLists.flat();

                // Track returned quantities
                const returnedQuantities = new Map();
                inData.forEach(inRecord => {
                    if (inRecord.customer.toLowerCase() === selectedCustomer.toLowerCase()) {
                        const materialInfos = inRecord.material_info.split(',');
                        materialInfos.forEach(async materialInfoId => {
                            const returnedItems = await getMaterialInfoById(materialInfoId);
                            returnedItems.forEach(item => {
                                const key = `${item.category}-${item.subcategory}-${item.outId}`;
                                returnedQuantities.set(key, (returnedQuantities.get(key) || 0) + parseInt(item.return_quantity || 0));
                            });
                        });
                    }
                });

                // Add available quantity information to material list
                const materialListWithAvailable = materialList.map(item => {
                    const key = `${item.category}-${item.subcategory}-${item.outId}`;
                    const returnedQty = returnedQuantities.get(key) || 0;
                    const availableQty = parseInt(item.quantity) - returnedQty;
                    return {
                        ...item,
                        availableQuantity: availableQty,
                        originalQuantity: item.quantity
                    };
                });

                setMaterialInfoList(materialListWithAvailable);
                
                // Rest of your existing code...
                const uniqueCategories = [...new Set(materialListWithAvailable.map(item => item.category))];
                setCategories(uniqueCategories);
                
            } catch (error) {
                console.error('Error processing material info:', error);
            }
        }
    } catch (error) {
        console.error('Error in handleCustomerChange:', error);
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
