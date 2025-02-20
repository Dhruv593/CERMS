import React, { useEffect, useState } from "react";
import Tables from "./tables";
import ReusableModal from "./ReusableModal";
import { rentData } from "@/data/rent-data";
import { rentFields } from "@/data/rent-modal";
import { addRent, getRents } from "@/api/rentApi";


function Rent() {
    const [isModalOpen, setIsModalOpen] = useState(false);
      const [searchValue, setSearchValue] = useState("");
      const [rents, setRents] = useState([]);

      useEffect(() => {
        const fetchRents = async () => {
                try {
                  const data = await getRents();
                  setRents(data);
                } catch (error) {
                  console.error("Error fetching rents:", error);
                }
              };
              fetchRents();
      }, []);
    
      // Modal toggle handlers
      const handleOpenModal = () => setIsModalOpen(true);
      const handleCloseModal = () => setIsModalOpen(false);

     
      const handleSubmit = async (data) => {
            try {
              const newRent = await addRent(data);
              setRents([...rents, newRent]);
            } catch (error) {
              console.error("Error adding rent:", error);
            }
        };

      const filteredData = rents.filter((row) =>
          row.category.toLowerCase().includes(searchValue.toLowerCase()) ||
          row.subcategory.toLowerCase().includes(searchValue.toLowerCase())
        );

      const renderStockRow = (row, index) => (
        <tr key={index} className="border-b hover:bg-gray-100 transition">
          <td className="px-2 py-2">{row.category}</td>
          <td className="px-2 py-2">{row.subcategory}</td>
          <td className="px-2 py-2">{row.rent}</td>
        </tr>
      );
  return (
    <>
          <Tables
            onButtonClick={handleOpenModal}
            headerTitle="Rent"
            buttonLabel="Add Rent"
            searchProps={{
              value: searchValue,
              onChange: (e) => setSearchValue(e.target.value),
              placeholder: "Search...",
            }}
            tableHeaders={[
              "Category",
              "Sub Category",
              "Rent",
              
            ]}
            tableData={filteredData}
            renderRow={renderStockRow}
          />
    
          {isModalOpen && (
            // <Stockmodal isOpen={isModalOpen} onClose={handleCloseModal} />
            <ReusableModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            title="Add New Stock"
            fields={rentFields}
            onSubmit={handleSubmit}
            submitButtonLabel="Add Rent"
          />
          )}
        </>
  )
}

export default Rent
