import { useState, useEffect } from "react";
import Tables from "./tables";
import ReusableModal from "./ReusableModal";
import { categoryFields } from "@/data/category-modal";
// import { categoryData } from "@/data/category-data";
import { addCategory, getCategories } from "@/api/categoryApi";
import { showSuccessAlert, showErrorAlert } from "@/utils/AlertService";

export function Category() {
  const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [categories, setCategories] = useState([]);
    useEffect(() => {
      const fetchCategories = async () => {
        try {
          const data = await getCategories();
          setCategories(data);

        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      };
      fetchCategories();
    }, []);
  
    const filteredData = categories.filter((row) =>
        row.category.toLowerCase().includes(searchValue.toLowerCase())
    );
  
    const handleSubmit = async (data) => {
      try {
        const newCategory = await addCategory(data);
        setCategories([...categories, newCategory]);
        showSuccessAlert("Category Added Successfully");
      } catch (error) {
        console.error("Error adding category:", error);
        showErrorAlert("Error Adding Category");
      }
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
          title="Add Category"
          fields={categoryFields}
          onSubmit={handleSubmit}
          submitButtonLabel="Add Category"
        />
        )}
      </>
    );
  
}
