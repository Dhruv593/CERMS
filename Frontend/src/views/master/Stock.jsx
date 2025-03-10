import React, { useState, useEffect } from 'react';
import Table from '@/components/Table/Table';
import ReusableModal from '@/components/Modal/ReusableModal';
import DeletePopUp from '@/components/PopUp/DeletePopUp';
import { addStock, getStockData, updateStock, deleteStock } from '@/api/newStockapi';
import { getCategories } from '@/api/categoryApi';
import { getSubcategoriesByCategory } from '@/api/subcategoryAPI';
import { stockFields } from '../../data/stock-modal';
import { showErrorAlert, showSuccessAlert } from '@/utils/AlertService';
import moment from 'moment';

function Stock() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [stockData, setStockData] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [rowToDelete, setRowToDelete] = useState(null);
  const IMG_URL = import.meta.env.VITE_IMG_URL;

  useEffect(() => {
    loadStockData();
    fetchCategories();
  }, []);

  const loadStockData = async () => {
    try {
      const data = await getStockData();
      if (data) setStockData(data);
    } catch (error) {
      console.error('Error loading stock data:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const categoriesData = await getCategories();
      setCategories(categoriesData.map((cat) => cat.category));
    console.log("onload categories:",categories);

    } catch (error) {
      console.error('Error fetching categories:', error);
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
    console.log("Submitting data:", data);

  //   if (!data.category) {
  //     showErrorAlert("Category is required!");
  //     return;
  // }

    try {
      let updatedData = { ...data };
      console.log("update data: ", updatedData)

      // Preserve existing images if not updated
      if (!data.stockPhoto && selectedRowData?.stockPhoto) {
        updatedData.stockPhoto = selectedRowData.stockPhoto;
      }
      if (!data.billPhoto && selectedRowData?.billPhoto) {
        updatedData.billPhoto = selectedRowData.billPhoto;
      }


      if (selectedRowData) {
        console.log(selectedRowData)
        await updateStock(selectedRowData.id, updatedData);
        showSuccessAlert('Stock updated successfully!');
      } else {
        await addStock(updatedData);
        showSuccessAlert('Stock added successfully!');
      }
      
      loadStockData();
      console.log("Loaded stock data:", data);

      setIsModalOpen(false);
      setSelectedRowData(null);
    } catch (error) {
      console.error('Error submitting stock data:', error);
      showErrorAlert('Error submitting stock data!');
    }
  };

  const handleEditClick = (row) => {
    if (!row?.id) {
      showErrorAlert('Invalid stock item selected for editing.');
      return;
    }

    setSelectedRowData({
      id: row.id,
      category: row.category || '',
      subcategory: row.subcategory || '',
      partyName: row.party_name || '',
      partyContact: row.party_contact || '',
      purchaseFrom: row.purchase_from || '',
      purchaseDateTime: moment(row.purchase_date_time).isValid() 
        ? moment(row.purchase_date_time).format('YYYY-MM-DDTHH:mm') 
        : '',
      purchaseQuantity: row.quantity || '',
      paymentMode: row.payment_mode || '',
      transportInclude: row.transport || '',
      remarks: row.remarks || '',
      stockPhoto: row.stock_photo,
      billPhoto: row.bill_photo
    });
    
    setIsModalOpen(true);
    console.log("data", row)
  };

  const handleDeleteClick = (row) => {
    if (!row || !row.id) {
      showErrorAlert('Invalid stock item selected for deletion.');
      return;
    }
    setRowToDelete(row);
    setIsDeletePopupOpen(true);
  };

  const confirmDelete = async () => {
    if (!rowToDelete || !rowToDelete.id) {
      showErrorAlert('Error deleting stock. Invalid item selected.');
      return;
    }
    try {
      await deleteStock(rowToDelete.id);
      loadStockData();
      setIsDeletePopupOpen(false);
      showSuccessAlert('Stock Deleted Successfully');
    } catch (error) {
      console.error('Error deleting stock:', error);
      showErrorAlert('Error deleting stock');
    }
  };

  const tableData = stockData.map((row) => {
  const processedRow = {
    id: row.id,
    category: row.category || '—',
    subcategory: row.subcategory || '—',
    party_name: row.partyName || '—',
    party_contact: row.partyContact || '—',
    purchase_from: row.purchaseFrom || '—',
    purchase_date_time: row.purchaseDateTime ? 
  new Date(row.purchaseDateTime).toLocaleString('en-GB', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  }) : '',
    quantity: row.purchaseQuantity || '—',
    payment_mode: row.paymentMode || '—',
    transport: row.transportInclude || '—',
    stock_photo: row.stockPhoto ? `${IMG_URL}/${row.stockPhoto}` : 'N/A',
    bill_photo: row.billPhoto ? `${IMG_URL}/${row.billPhoto}` : 'N/A',
    remarks: row.remarks || '—'
  };
  
  // console.log("Processed table row:", processedRow);
  return processedRow;
});


  return (
    <>
      <Table
        onButtonClick={() => setIsModalOpen(true)}
        buttonLabel="Add New Stock"
        tableHeaders={[
          'Category',
          'Subcategory',
          'Party Name',
          'Party Contact',
          'Purchase From',
          'Purchase Date Time',
          'Quantity',
          'Payment Mode',
          'Transport',
          'Stock Photo',
          'Bill Photo',
          'Remarks'
        ]}
        tableData={tableData}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      {isModalOpen && (
        <ReusableModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedRowData(null);
          }}
          title={selectedRowData ? 'Edit Stock' : 'Add Stock'}
          fields={stockFields(categories, subcategories)}
          initialFormData={selectedRowData || {}}
          onSubmit={handleSubmit}
          submitButtonLabel={selectedRowData ? 'Update Stock' : 'Add Stock'}
          onCategoryChange={handleCategoryChange}
        />
      )}

      {isDeletePopupOpen && (
        <DeletePopUp
          isOpen={isDeletePopupOpen}
          onClose={() => setIsDeletePopupOpen(false)}
          onConfirm={confirmDelete}
          title="Confirm Deletion"
          message="Are you sure you want to delete this stock?"
          confirmLabel="Delete"
          cancelLabel="Cancel"
        />
      )}
    </>
  );
}

export default Stock;
