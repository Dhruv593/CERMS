import { useState } from "react";
import Tables from "./tables";
import { subcategoryData } from "@/data/subcategory-table.data";
import ReusableModal from "./ReusableModal";
import { subcategoryFields } from "@/data/subcategory-modal";

export function Subcategory() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const filteredData = subcategoryData.filter((row) =>
      row.category.toLowerCase().includes(searchValue.toLowerCase()) ||
      row.subcategory.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleSubmit = (data) => {
    console.log("Subcategory Data Submitted:", data);
    // Perform further actions (e.g., API call)
  };

  // Custom renderRow function for subcategory rows
  const renderSubcategoryRow = (row, index) => (
    <tr key={index} className="border-b hover:bg-gray-100 transition">
      <td className="px-2 py-2">{row.category}</td>
      <td className="px-2 py-2">{row.subcategory}</td>
      <td className="px-2 py-2">{row.description}</td>
      <td className="px-2 py-2">{row.rent}</td>
      <td className="px-2 py-2">{row.deposit}</td>
      <td className="px-2 py-2">
        <img
          src={row.image}
          alt={row.subcategory}
          className="h-8 w-8 object-cover"
        />
      </td>
    </tr>
  );

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <>
      <Tables
        onButtonClick={handleOpenModal}
        headerTitle="Subcategory"
        buttonLabel="Add Subcategory"
        searchProps={{
          value: searchValue,
          onChange: (e) => setSearchValue(e.target.value),
          placeholder: "Search Subcategory...",
        }}
        tableHeaders={[
          "Category",
          "Subcategory",
          "Description",
          "Rent per piece per day",
          "Deposit per piece per day",
          "Item image",
        ]}
        tableData={filteredData}
        renderRow={renderSubcategoryRow}
      />
      {isModalOpen && (
        <ReusableModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Add Subcategory"
        fields={subcategoryFields}
        onSubmit={handleSubmit}
        submitButtonLabel="Add Subcategory"
      />
      )}
    </>
  );
}

export default Subcategory;
