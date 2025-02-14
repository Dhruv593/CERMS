import { useState } from "react";
import Tables from "./tables";
import ReusableModal from "./ReusableModal";
import { categoryFields } from "@/data/category-modal";
import { categoryData } from "@/data/category-data";

export function Category() {
  const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");
  
    const filteredData = categoryData.filter((row) =>
        row.category.toLowerCase().includes(searchValue.toLowerCase())
    );
  
    const handleSubmit = (data) => {
      console.log("Subcategory Data Submitted:", data);
      // Perform further actions (e.g., API call)
    };
  
    // Custom renderRow function for subcategory rows
    const renderSubcategoryRow = (row, index) => (
      <tr key={index} className="border-b hover:bg-gray-100 transition">
        <td className="px-2 py-2">{row.category}</td>
        <td className="px-2 py-2">{row.description}</td>
      </tr>
    );
  
    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);
  
    return (
      <>
        <Tables
          onButtonClick={handleOpenModal}
          headerTitle="Category"
          buttonLabel="Add Category"
          searchProps={{
            value: searchValue,
            onChange: (e) => setSearchValue(e.target.value),
            placeholder: "Search Category...",
          }}
          tableHeaders={[
            "Category",
            "Description",
          ]}
          tableData={filteredData}
          renderRow={renderSubcategoryRow}
        />
        {isModalOpen && (
          <ReusableModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title="Add Subcategory"
          fields={categoryFields}
          onSubmit={handleSubmit}
          submitButtonLabel="Add Subcategory"
        />
        )}
      </>
    );
  
}
