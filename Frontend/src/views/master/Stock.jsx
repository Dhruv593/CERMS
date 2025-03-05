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
  const [searchValue, setSearchValue] = useState('');
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
      if (data) {
        setStockData(data);
      }
    } catch (error) {
      console.error('Error loading stock data:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const categoriesData = await getCategories();
      setCategories(categoriesData.map((cat) => cat.category));
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
    try {
      console.log('Submitting data:', data);
      if (selectedRowData) {
        await updateStock(selectedRowData.id, data);
        showSuccessAlert('Stock updated successfully!');
      } else {
        await addStock(data);
        showSuccessAlert('Stock added successfully!');
      }
      loadStockData();
      setIsModalOpen(false);
      setSelectedRowData(null);
    } catch (error) {
      console.error('Error submitting stock data:', error);
      showErrorAlert('Error submitting stock data!');
    }
  };

  const handleEditClick = (row) => {
    if (!row || !row.id) {
      showErrorAlert('Invalid stock item selected for editing.');
      return;
    }

    console.log('Editing row:', row);

    // Convert date-time to required format
    const formattedDateTime = row.purchaseDateTime
      ? moment(row.purchaseDateTime).format('YYYY-MM-DDTHH:mm') // Required format for input[type="datetime-local"]
      : '';

    setSelectedRowData({
      ...row,
      purchaseDateTime: formattedDateTime,
    });

    setIsModalOpen(true);
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

  const tableData = stockData.map((row) => ({
    id: row.id, // Ensure ID is included
    category: row.category || '—',
    subcategory: row.subcategory || '—',
    party_name: row.partyName || '—',
    party_contact: row.partyContact || '—',
    purchase_from: row.purchaseFrom || '—',
    purchase_date_time: row.purchaseDateTime ? moment(row.purchaseDateTime).format('YYYY-MM-DD HH:mm:ss') : '—',
    quantity: row.purchaseQuantity || '—',
    payment_mode: row.paymentMode || '—',
    transport: row.transportInclude || '—',
    stock_photo: row.stockPhoto ? `${IMG_URL}/${row.stockPhoto}` : 'N/A',
    bill_photo: row.billPhoto ? `${IMG_URL}/${row.billPhoto}` : 'N/A',
    remarks: row.remarks || '—'
  }));

  return (
    <>
      <Table
        onButtonClick={() => setIsModalOpen(true)}
        headerTitle="Stock"
        buttonLabel="Add New Stock"
        searchProps={{
          value: searchValue,
          onChange: (e) => setSearchValue(e.target.value),
          placeholder: 'Search Stock...'
        }}
        tableHeaders={[
          'Category',
          'Subcategory',
          'Party Name',
          'Party Contact',
          'Purchase From',
          'Purchase Date & Time',
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
