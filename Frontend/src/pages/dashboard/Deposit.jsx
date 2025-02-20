import React, { useState } from "react";
import Tables from "./tables";
import ReusableModal from "./ReusableModal";
import { depositData } from "@/data/deposit-data";
import { depositFields } from "@/data/deposit-modal";


function Deposit() {
    const [isModalOpen, setIsModalOpen] = useState(false);
      const [searchValue, setSearchValue] = useState("");
    
      // Modal toggle handlers
      const handleOpenModal = () => setIsModalOpen(true);
      const handleCloseModal = () => setIsModalOpen(false);

      const handleSubmit = (data) => {
        console.log("Deposit Data Submitted:", data);
        // Perform further actions (e.g., API call)
      };

      const filteredData = depositData.filter((row) =>
          row.category.toLowerCase().includes(searchValue.toLowerCase()) ||
          row.subcategory.toLowerCase().includes(searchValue.toLowerCase())
        );

      const renderStockRow = (row, index) => (
        <tr key={index} className="border-b hover:bg-gray-100 transition">
          <td className="px-2 py-2">{row.category}</td>
          <td className="px-2 py-2">{row.subcategory}</td>
          <td className="px-2 py-2">{row.deposit}</td>
        </tr>
      );
  return (
    <>
          <Tables
            onButtonClick={handleOpenModal}
            headerTitle="Deposit"
            buttonLabel="Add Deposit"
            searchProps={{
              value: searchValue,
              onChange: (e) => setSearchValue(e.target.value),
              placeholder: "Search...",
            }}
            tableHeaders={[
              "Category",
              "Sub Category",
              "Deposit",
              
            ]}
            tableData={filteredData}
            renderRow={renderStockRow}
          />
    
          {isModalOpen && (
            // <Stockmodal isOpen={isModalOpen} onClose={handleCloseModal} />
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
  )
}

export default Deposit
