import { useState } from 'react';
import InOutModal from '@/components/Modal/InOutModal';
import Table from '@/components/Table/Table';
import { outFields } from '@/data/out-modal';

const Out = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [outData, setOutData] = useState([]); // Array of OUT records
  const [selectedRecord, setSelectedRecord] = useState(null);

  const handleSubmit = (data) => {
    console.log('Out data submitted:', data);
    setOutData([...outData, data]);
    setIsModalOpen(false);
  };

  const customers = ['Customer X', 'Customer Y'];
  const payModes = ['Cash', 'Card', 'Online'];

  // Define table headers for OUT records
  const tableHeaders = ['Customer', 'Payment Mode', 'Total Amount'];

  // Map outData to the table data format
  const tableData = outData.map(record => ({
    customer: record.customer,
    payment_mode: record.payMode,
    total_amount: record.summary.totalAmount
  }));

  return (
    <>
      
      <Table
        onButtonClick={() => { setSelectedRecord(null); setIsModalOpen(true); }}
        buttonLabel="Add Out"
        tableHeaders={tableHeaders}
        tableData={tableData}
        onEdit={(row) => { setSelectedRecord(row); setIsModalOpen(true); }}
        onDelete={(row) => { /* Add deletion logic if needed */ }}
      />

      {isModalOpen && (
        <InOutModal
          show={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialData={selectedRecord}
          onSubmit={handleSubmit}
          mode="out"
          cartFields={outFields()}
          customers={customers}
          payModes={payModes}
          getDepositRate={(cat, sub) => 10} // Dummy deposit rate function
        />
      )}
    </>
  );
};

export default Out;
