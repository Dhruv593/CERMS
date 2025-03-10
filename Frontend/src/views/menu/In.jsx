import { useState } from 'react';
import InOutModal from '@/components/Modal/InOutModal';
import Table from '@/components/Table/Table';
import { inFields } from '@/data/in-modal';

const In = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inData, setInData] = useState([]); // Array of IN records
  const [selectedRecord, setSelectedRecord] = useState(null);

  const handleSubmit = (data) => {
    console.log('In data submitted:', data);
    setInData([...inData, data]);
    setIsModalOpen(false);
  };

  const customers = ['Customer A', 'Customer B'];
  const payModes = ['Cash', 'Card', 'Online'];

  // Define table headers for IN records (you can adjust as needed)
  const tableHeaders = ['Customer', 'Payment Mode', 'Total Amount'];

  // Map inData to the table data format expected by your Table component.
  // Keys must match the normalized version of the header (e.g. "customer", "payment_mode", "total_amount")
  const tableData = inData.map(record => ({
    customer: record.customer,
    payment_mode: record.payMode,
    total_amount: record.summary.totalAmount
  }));

  return (
    <>
      
      <Table
        onButtonClick={() => { setSelectedRecord(null); setIsModalOpen(true); }}
        buttonLabel="Add In"
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
          mode="in"
          cartFields={inFields()}
          customers={customers}
          payModes={payModes}
          getDepositRate={(cat, sub) => 10} // Dummy deposit rate function
        />
      )}
    </>
  );
};

export default In;
