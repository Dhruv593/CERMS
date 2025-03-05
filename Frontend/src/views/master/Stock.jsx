import React, { useState, useEffect } from 'react';
import Table from '@/components/Table/Table';
import ReusableModal from '@/components/Modal/ReusableModal';
import DeletePopUp from '@/components/PopUp/DeletePopUp';
import { addStock, getStockData, updateStock, deleteStock } from '@/api/newStockapi';
import { getCategories } from '@/api/categoryApi';
import { getSubcategoriesByCategory } from '@/api/subcategoryAPI';
import { stockFields } from '../../data/stock-modal';
import { Trash2, Edit } from 'lucide-react';
import ReusablePopUp from '@/components/PopUp/ReusablePopUp';
import { showErrorAlert, showSuccessAlert } from '@/utils/AlertService';

function Stock() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [stockData, setStockData] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
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
        // Update stock if a row is selected for editing
        await updateStock(selectedRowData.id, data);
        showSuccessAlert('Stock updated successfully!');
      } else {
        // Otherwise, add new stock
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

  const handleEditClick = (e, rowData) => {
    console.log('checkdata', rowData);
    console.log('eefsmadfkl', e);
    e.stopPropagation();
    const formattedDateTime = rowData.purchaseDateTime ? new Date(rowData.purchaseDateTime).toISOString().slice(0, 16) : '';

    setSelectedRowData({
      ...rowData,
      purchaseDateTime: formattedDateTime
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (e, rowData) => {
    e.stopPropagation();
    setRowToDelete(rowData);
    setIsDeletePopupOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteStock(rowToDelete.id);
      loadStockData();
      setIsDeletePopupOpen(false);
    } catch (error) {
      console.error('Error deleting stock:', error);
    }
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRowData(null);
  };

  const handleRowClick = (row) => {
    setSelectedRow(row);
    setIsViewModalOpen(true);
  };

  const openImageModal = (imageUrl) => {
    setSelectedImage(`${IMG_URL}/${imageUrl}`);
    setIsImageModalOpen(true);
  };

  // Pagination Logic
  const startIndex = (currentPage - 1) * pageSize;

  const renderStockRow = (row, index) => (
    <tr key={index} className="border-b hover:bg-gray-100 transition" onClick={() => handleRowClick(row)}>
      <td className="p-2 text-center">{startIndex + index + 1}</td>
      <td className="p-2">{row.category}</td>
      <td className="p-2">{row.subcategory}</td>
      <td className="p-2">{row.partyName}</td>
      <td className="p-2">{row.partyContact || 'N/A'}</td>
      <td className="p-2">{row.purchaseFrom}</td>
      <td className="p-2">{row.purchaseDateTime}</td>
      <td className="p-2">{row.purchaseQuantity}</td>
      <td className="p-2">{row.paymentMode}</td>
      <td className="p-2">{row.transportInclude}</td>
      <td className="p-2">
        {row.stockPhoto && (
          <img
            src={`${IMG_URL}/${row.stockPhoto}`}
            alt={row.stockPhoto}
            style={{ width: '30px', height: '30px', objectFit: 'cover', cursor: 'pointer' }}
            onClick={(e) => {
              e.stopPropagation();
              openImageModal(row.stockPhoto);
            }}
          />
        )}
      </td>
      <td className="p-2">
        {row.billPhoto && (
          <img
            src={`${IMG_URL}/${row.billPhoto}`}
            alt={row.billPhoto}
            style={{ width: '30px', height: '30px', objectFit: 'cover', cursor: 'pointer' }}
            onClick={(e) => {
              e.stopPropagation();
              openImageModal(row.billPhoto);
            }}
          />
        )}
      </td>
      <td className="p-2">{row.remarks}</td>
      <td className="p-3 d-flex justify-content-center gap-2">
        <button onClick={(e) => handleEditClick(e, row)} className="btn btn-sm btn-success d-flex align-items-center gap-1">
          <Edit size={16} />
        </button>
        <button onClick={(e) => handleDeleteClick(e, row)} className="btn btn-sm btn-danger d-flex align-items-center gap-1">
          <Trash2 size={16} />
        </button>
      </td>
    </tr>
  );

  const filteredData = stockData.filter(
    (row) =>
      (row.category?.toLowerCase() || '').includes(searchValue.toLowerCase()) ||
      (row.subcategory?.toLowerCase() || '').includes(searchValue.toLowerCase()) ||
      (row.partyName?.toLowerCase() || '').includes(searchValue.toLowerCase())
  );

  return (
    <>
      <Table
        onButtonClick={handleOpenModal}
        headerTitle="Stock"
        buttonLabel="Add New Stock"
        searchProps={{
          value: searchValue,
          onChange: (e) => setSearchValue(e.target.value),
          placeholder: 'Search Stock...'
        }}
        tableHeaders={[
          'Id',
          'Category',
          'Sub Category',
          'Party Name',
          'Party Contact',
          'Purchase From',
          'Purchase Date & Time',
          'Quantity',
          'Payment Mode',
          'Transport',
          'Stock Photo',
          'Bill Photo',
          'Remarks',
          'Actions'
        ]}
        tableData={filteredData}
        renderRow={renderStockRow}
      />

      {isModalOpen && (
        <ReusableModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={selectedRowData ? 'Edit Stock' : 'Add New Stock'}
          fields={stockFields(categories, subcategories)}
          initialFormData={selectedRowData} // Pre-populate the modal when editing
          onSubmit={handleSubmit}
          submitButtonLabel={selectedRowData ? 'Update Stock' : 'Add Stock'}
          onCategoryChange={handleCategoryChange}
        />
      )}
      {isViewModalOpen && selectedRow && (
        <ReusablePopUp isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Stock Details">
          <div className="space-y-4">
            <p>
              <strong>Category:</strong> {selectedRow.category}
            </p>
            <p>
              <strong>Sub Category:</strong> {selectedRow.subcategory}
            </p>
            <p>
              <strong>Party Name:</strong> {selectedRow.partyName}
            </p>
            <p>
              <strong>Party Contact:</strong> {selectedRow.partyContact}
            </p>
            <p>
              <strong>Purchase From</strong> {selectedRow.purchaseFrom}
            </p>
            <p>
              <strong>Purchase Date & Time:</strong> {selectedRow.purchaseDateTime}
            </p>
            <p>
              <strong>Quantity:</strong> {selectedRow.purchaseQuantity}
            </p>
            <p>
              <strong>Payment Mode:</strong> {selectedRow.paymentMode}
            </p>
            <p>
              <strong>Transport:</strong> {selectedRow.transportInclude}
            </p>
            <p>
              <strong>Remarks:</strong> {selectedRow.remarks}
            </p>
            <p>
              <strong>Stock Photo:</strong>{' '}
              {selectedRow.stockPhoto && (
                <img
                  src={`${IMG_URL}/${selectedRow.stockPhoto}`}
                  alt="Stock"
                  style={{ width: '50px', height: '50px', objectFit: 'cover', cursor: 'pointer' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    openImageModal(selectedRow.stockPhoto);
                  }}
                />
              )}
            </p>
            <p>
              <strong>Bill Photo:</strong>{' '}
              {selectedRow.billPhoto && (
                <img
                  src={`${IMG_URL}/${selectedRow.billPhoto}`}
                  alt="Bill"
                  style={{ width: '50px', height: '50px', objectFit: 'cover', cursor: 'pointer' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    openImageModal(selectedRow.billPhoto);
                  }}
                />
              )}
            </p>
          </div>
        </ReusablePopUp>
      )}
      {isDeletePopupOpen && (
        <DeletePopUp
          isOpen={isDeletePopupOpen}
          onClose={() => setIsDeletePopupOpen(false)}
          onConfirm={confirmDelete}
          title = "Confirm Delete"
          message="Are you sure you want to delete this stock?"
        />
      )}
      {isImageModalOpen && selectedImage && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-75"
          style={{ zIndex: 1050 }}
          onClick={() => setIsImageModalOpen(false)}
        >
          <img
            src={selectedImage}
            alt="Preview"
            className="img-fluid cursor-pointer"
            style={{ maxWidth: '100%', maxHeight: '100%' }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}

export default Stock;
