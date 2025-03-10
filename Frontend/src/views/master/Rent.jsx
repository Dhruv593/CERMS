import React, { useEffect, useState } from 'react';
import Table from '@/components/Table/Table';
import ReusableModal from '@/components/Modal/ReusableModal';
import DeletePopUp from '@/components/PopUp/DeletePopUp';
import { addRent, getRents, updateRent, deleteRent } from '@/api/rentApi';
import { getCategories } from '@/api/categoryApi';
import { getSubcategoriesByCategory } from '@/api/subcategoryAPI';
import { rentFields } from '@/data/rent-modal';
import { Trash2, Edit } from 'lucide-react';
import { showSuccessAlert, showErrorAlert } from '@/utils/AlertService';

function Rent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [rents, setRents] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetchRents();
    fetchCategories();
  }, []);

  const fetchRents = async () => {
    try {
      const data = await getRents();
      setRents(data);
    } catch (error) {
      console.error('Error fetching rents:', error);
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

  const handleEditClick = (row) => {
    console.log('Editing subcategory:', row); // Debugging log

    if (!row || !row.id) {
      showErrorAlert('Invalid subcategory selected for editing.');
      return;
    }

    setSelectedRowData(row);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (rowData) => {
    setRowToDelete(rowData);
    setIsDeletePopupOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteRent(rowToDelete.id);
      fetchRents();
      setIsDeletePopupOpen(false);
      showSuccessAlert('Rent Deleted Successfully');
    } catch (error) {
      console.error('Error deleting rent:', error);
      showErrorAlert('Error deleting rent');
    }
  };

  const handleSubmit = async (data) => {
    console.log("rent data submitted", data)
    try {
      if (selectedRowData) {
        await updateRent(selectedRowData.id, data);
        showSuccessAlert('Rent Updated Successfully');
      } else {
        await addRent(data);
        showSuccessAlert('Rent Added Successfully');
      }
      fetchRents();
      setIsModalOpen(false);
      setSelectedRowData(null);
    } catch (error) {
      console.error('Error saving rent:', error);
      showErrorAlert('Error saving rent');
    }
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setSelectedRowData(null);
    setIsModalOpen(false);
  };

  const filteredData = rents.filter(
    (row) =>
      row.category.toLowerCase().includes(searchValue.toLowerCase()) || row.subcategory.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Pagination Logic
  const startIndex = (currentPage - 1) * pageSize;

  return (
    <>
      <Table
        onButtonClick={handleOpenModal}
        headerTitle="Rent"
        buttonLabel="Add Rent"
        searchProps={{
          value: searchValue,
          onChange: (e) => setSearchValue(e.target.value),
          placeholder: 'Search...'
        }}
        tableHeaders={['Category', 'Subcategory', 'Rent']}
        tableData={filteredData}
        // renderRow={(row, index) => (
        //   <tr key={index} className="border-b hover:bg-gray-100 transition">
        //     <td className="p-2">{row.category}</td>
        //     <td className="p-2">{row.subcategory}</td>
        //     <td className="p-2">{row.rent}</td>
        //     <td className="p-2 d-flex justify-content-center gap-2">
        //       <button
        //         onClick={(e) => handleEditClick(e, row)}
        //         className="btn btn-sm btn-success d-flex align-items-center gap-1"
        //       >
        //         <Edit size={16} />
        //       </button>
        //       <button
        //         onClick={(e) => handleDeleteClick(e, row)}
        //         className="btn btn-sm btn-danger d-flex align-items-center gap-1"
        //       >
        //         <Trash2 size={16} />
        //       </button>
        //     </td>
        //   </tr>
        // )}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      {isModalOpen && (
        <ReusableModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={selectedRowData ? 'Edit Rent' : 'Add Rent'}
          fields={rentFields(categories, subcategories)}
          initialFormData={selectedRowData || {}} // Ensure data pre-fills modal
          onSubmit={handleSubmit}
          submitButtonLabel={selectedRowData ? 'Update Rent' : 'Add Rent'}
          onCategoryChange={handleCategoryChange}
        />
      )}

      {isDeletePopupOpen && (
        <DeletePopUp
          isOpen={isDeletePopupOpen}
          onClose={() => setIsDeletePopupOpen(false)}
          onConfirm={confirmDelete}
          title="Confirm Deletion"
          message="Are you sure you want to delete this rent entry?"
          confirmLabel="Delete"
          cancelLabel="Cancel"
        />
      )}
    </>
  );
}

export default Rent;
