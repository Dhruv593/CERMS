import { useState } from 'react';
import Table from '@/components/Table/Table';
import { outFields } from '@/data/out-modal';
import ReusableModal from '@/components/Modal/ReusableModal';
import DeletePopUp from '@/components/PopUp/DeletePopUp';
import { Edit, Trash2 } from 'lucide-react';

const Out = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const tableData = [];

  const handleEditClick = (row) => {
    setSelectedItem(row);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (row) => {
    setIsDeletePopupOpen(true);
  };

  return (
    <>
      <Table
        onButtonClick={() => setIsModalOpen(true)}
        buttonLabel="Add Out"
        tableHeaders={['Customer', 'Category', 'Subcategory', 'Quantity', 'Payment Mode']}
        tableData={tableData}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      {isModalOpen && (
        <ReusableModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={selectedItem ? 'Edit Out' : 'Add Out'} 
          fields={outFields()}
          initialFormData={selectedItem || {}} 
          submitButtonLabel={selectedItem ? 'Update' : 'Add'} 
        />
      )}

      {isDeletePopupOpen && (
        <DeletePopUp
          isOpen={isDeletePopupOpen}
          onClose={() => setIsDeletePopupOpen(false)}
          title="Confirm Deletion"
          message="Are you sure you want to delete this record?"
          confirmLabel="Delete"
          cancelLabel="Cancel"
        />
      )}
    </>
  );
};

export default Out;
