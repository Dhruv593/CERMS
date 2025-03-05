  import { useState, useEffect } from 'react';
  import Table from '@/components/Table/Table';
  import { getSubcategories, addSubcategory, updateSubcategory, deleteSubcategory } from '@/api/subcategoryAPI';
  import { getCategories } from '@/api/categoryApi';
  import ReusableModal from '@/components/Modal/ReusableModal';
  import DeletePopUp from '@/components/PopUp/DeletePopUp';
  import { subcategoryFields as initialSubcategoryFields } from '@/data/subcategory-modal';
  import { showSuccessAlert, showErrorAlert } from '@/utils/AlertService';
  import { Edit, Trash2 } from 'lucide-react';

  const Subcategory = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [subcategoryData, setSubcategoryData] = useState([]);
    const [subcategoryFields, setSubcategoryFields] = useState(initialSubcategoryFields);
    const [selectedRowData, setSelectedRowData] = useState(null);
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
    const [rowToDelete, setRowToDelete] = useState(null);
    const IMG_URL = import.meta.env.VITE_IMG_URL;

    useEffect(() => {
      loadSubcategories();
      fetchCategories();
    }, []);

    // Fetch Subcategories
    const loadSubcategories = async () => {
      try {
        const data = await getSubcategories();
        if (data) setSubcategoryData(data);
      } catch (error) {
        console.error('Error fetching subcategories:', error);
      }
    };

    // Fetch Categories for Dropdown
    const fetchCategories = async () => {
      try {
        const categories = await getCategories();
        const categoryOptions = categories.map((cat) => cat.category);
        setSubcategoryFields((prevFields) =>
          prevFields.map((field) => (field.name === 'category' ? { ...field, options: categoryOptions } : field))
        );
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    // Handle Add / Update Subcategory
    const handleSubmit = async (data) => {
      try {
        if (selectedRowData) {
          await updateSubcategory(selectedRowData.id, data);
          showSuccessAlert('Subcategory updated successfully');
        } else {
          await addSubcategory(data);
          showSuccessAlert('Subcategory added successfully');
        }
        loadSubcategories();
        setIsModalOpen(false);
        setSelectedRowData(null);
      } catch (error) {
        console.error('Error saving subcategory:', error);
        showErrorAlert('Error saving subcategory');
      }
    };

    // Edit Subcategory
    const handleEditClick = (row) => {
      console.log("Editing subcategory:", row); // Debugging log
    
      if (!row || !row.id) {
        showErrorAlert("Invalid subcategory selected for editing.");
        return;
      }
    
      setSelectedRowData(row);
      setIsModalOpen(true);
    };
    

    // Delete Subcategory
    const handleDeleteClick = (row) => {
      if (!row || !row.id) {
        showErrorAlert('Invalid subcategory selected for deletion.');
        return;
      }
      setRowToDelete(row);
      setIsDeletePopupOpen(true);
    };

    // Confirm Delete
    const confirmDelete = async () => {
      if (!rowToDelete || !rowToDelete.id) {
        showErrorAlert('Error deleting subcategory. Invalid subcategory selected.');
        return;
      }
      try {
        await deleteSubcategory(rowToDelete.id);
        loadSubcategories();
        setIsDeletePopupOpen(false);
        showSuccessAlert('Subcategory Deleted Successfully');
      } catch (error) {
        console.error('Error deleting subcategory:', error);
        showErrorAlert('Error deleting subcategory');
      }
    };

    const tableData = subcategoryData.map((row) => ({
      id: row.id,
      category: row.category || 'N/A',
      subcategory: row.subcategory || 'N/A',
      description: row.description || 'N/A',
      item_image: row.image_path ? `${IMG_URL}/${row.image_path}` : null,
    }));
    

    return (
      <>
        <Table
          onButtonClick={() => setIsModalOpen(true)}
          buttonLabel="Add Subcategory"
          tableHeaders={['Category', 'Subcategory', 'Description', 'Item Image']}
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
            title={selectedRowData ? 'Edit Subcategory' : 'Add Subcategory'}
            fields={subcategoryFields}
            initialFormData={selectedRowData || {}}
            onSubmit={handleSubmit}
            submitButtonLabel={selectedRowData ? 'Update Subcategory' : 'Add Subcategory'}
          />
        )}

        {isDeletePopupOpen && (
          <DeletePopUp
            isOpen={isDeletePopupOpen}
            onClose={() => setIsDeletePopupOpen(false)}
            onConfirm={confirmDelete}
            title="Confirm Deletion"
            message="Are you sure you want to delete this subcategory?"
            confirmLabel="Delete"
            cancelLabel="Cancel"
          />
        )}
      </>
    );
  };

  export default Subcategory;
