import { useState, useEffect } from "react";
import Tables from "./tables";
import ReusableModal from "./ReusableModal";
import { depositFields } from "@/data/deposit-modal";
import { addDeposit, getDeposits } from "@/api/depositAPI";

export function Deposit() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [deposits, setDeposits] = useState([]);

  useEffect(() => {
    const fetchDeposits = async () => {
      try {
        const data = await getDeposits();
        console.log("Fetched Deposits:", data);
        setDeposits(data);
      } catch (error) {
        console.error("Error fetching deposits:", error);
      }
    };
    fetchDeposits();
  }, []);

//   const filteredData = deposits.filter((row) =>
//     [row.depositor_name, row.account_details, row.reference_number]
//       .some((field) => field?.toLowerCase().includes(searchValue.toLowerCase()))
//   );
  

  const filteredData = deposits.filter((row) =>
    row?.depositor_name?.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleSubmit = async (data) => {
    try {
      const newDeposit = await addDeposit(data);
      setDeposits([...deposits, newDeposit]);
    } catch (error) {
      console.error("Error adding deposit:", error);
    }
  };

  const renderDepositRow = (row, index) => (
    <tr key={index} className="border-b hover:bg-gray-100 transition">
      <td className="px-2 py-2">{row.depositor_name || "N/A"}</td>
      <td className="px-2 py-2">{row.account_details || "N/A"}</td>
      <td className="px-2 py-2">{row.deposit_amount || "N/A"}</td>
      <td className="px-2 py-2">{row.payment_method || "N/A"}</td>
      <td className="px-2 py-2">{row.reference_number || "N/A"}</td>
      <td className="px-2 py-2">{row.remarks || "N/A"}</td>
      <td className="px-2 py-2">{row.status || "N/A"}</td>
      <td className="px-2 py-2">{new Date(row.deposit_date).toLocaleDateString() || "N/A"}</td>
    </tr>
  );
  

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <>
      <Tables
        onButtonClick={handleOpenModal}
        headerTitle="Deposit"
        buttonLabel="Add Deposit"
        searchProps={{
          value: searchValue,
          onChange: (e) => setSearchValue(e.target.value),
          placeholder: "Search Account Holder...",
        }}
        tableHeaders={[
          "Depositor Name",
        "Account Details",
        "Deposit Amount",
        "Payment Method",
        "Reference Number",
        "Remarks",
        "Status",
        "Deposit Date"
        ]}
        tableData={filteredData}
        renderRow={renderDepositRow}
      />

      {isModalOpen && (
        <ReusableModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title="Add Deposit"
          fields={depositFields}
          onSubmit={handleSubmit}
          submitButtonLabel="Add Deposit"
        />
      )}
    </>
  );
}
