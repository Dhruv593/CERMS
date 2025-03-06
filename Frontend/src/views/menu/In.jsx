import { useState } from 'react';
import Table from '@/components/Table/Table';
import { inFields } from '@/data/in-modal';
import ReusableModal from '@/components/Modal/ReusableModal';

const In = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const tableData = [];

  const handleEditClick = (row) => {
    setSelectedItem(row);
    setIsModalOpen(true);
  };

  return (
    <>
      <Table
        onButtonClick={() => setIsModalOpen(true)}
        buttonLabel="Add In"
        tableHeaders={['Customer', 'Category', 'Subcategory', 'Quantity', 'Payment Mode']}
        tableData={tableData}
        onEdit={handleEditClick}
      />

      {isModalOpen && (
        <ReusableModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={selectedItem ? 'Edit In' : 'Add In'}
          fields={inFields()}
          initialFormData={selectedItem || {}}
          submitButtonLabel={selectedItem ? 'Update' : 'Add'}
        />
      )}
    </>
  );
};

export default In;
