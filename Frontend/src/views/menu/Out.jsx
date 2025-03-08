import { useState } from 'react';
import OutModal from '@/components/Modal/OutModal';
import Table from '@/components/Table/Table';
import DeletePopUp from '@/components/PopUp/DeletePopUp';

const Out = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [tableData, setTableData] = useState([]); // This will store your submitted Out records

  const handleEditClick = (row) => {
    setSelectedItem(row);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (row) => {
    setIsDeletePopupOpen(true);
    // Add delete logic as needed
  };

  const handleModalSubmit = (data) => {
    console.log("Final data submitted:", data);
    // For demonstration, add the submitted record to tableData.
    // In a real app, you would call your API and then update tableData.
    setTableData([...tableData, data]);
    setIsModalOpen(false);
  };

  // Dummy dropdown arrays
  const renters = ['Renter A', 'Renter B', 'Renter C'];
  const categories = ['Category 1', 'Category 2'];
  const subcategories = ['Subcategory 1', 'Subcategory 2'];
  const payModes = ['Cash', 'Card', 'Online'];

  // Dummy deposit rate function (could be a lookup from your deposit table)
  const getDepositRate = (category, subcategory) => {
    return 10; // fixed rate for demonstration
  };

  // Updated table headers (adjust as needed)
  const tableHeaders = ['Customer', 'Payment Mode', 'Total Deposit'];

  return (
    <>
      <Table
        onButtonClick={() => {
          setSelectedItem(null);
          setIsModalOpen(true);
        }}
        buttonLabel="Add Out"
        tableHeaders={tableHeaders}
        tableData={tableData.map((item) => ({
          customer: item.renter,
          payment_mode: item.payMode,
          total_deposit: item.totalDeposit
        }))}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      {isModalOpen && (
        <OutModal
          show={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialData={selectedItem}
          onSubmit={handleModalSubmit}
          categories={categories}
          subcategories={subcategories}
          renters={renters}
          payModes={payModes}
          getDepositRate={getDepositRate}
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
