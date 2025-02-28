import { useState, useEffect } from "react";
import Tables from "./tables";
import { getSubcategories, addSubcategory } from "@/api/subcategoryAPI";
import { getCategories } from "@/api/categoryApi";
import ReusableModal from "./ReusableModal";
import { subcategoryFields as initialSubcategoryFields } from "@/data/subcategory-modal";
import { showSuccessAlert } from "@/utils/AlertService";

export function Subcategory() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [subcategoryData, setSubcategoryData] = useState([]);
  const [subcategoryFields, setSubcategoryFields] = useState(initialSubcategoryFields);
  const IMG_URL = import.meta.env.VITE_IMG_URL;

  useEffect(() => {
    loadSubcategories();
    fetchCategories();
  }, []);

  // Load subcategories from API
  const loadSubcategories = async () => {
    const data = await getSubcategories();
    if (data) {
      setSubcategoryData(data);
    }
  };

  // Fetch categories dynamically
  const fetchCategories = async () => {
    try {
      const categories = await getCategories(); // Assume API returns [{ id: 1, category: "Category 1" }, { id: 2, category: "Category 2" }]
      const categoryOptions = categories.map((cat) => cat.category);

      setSubcategoryFields((prevFields) =>
        prevFields.map((field) =>
          field.name === "category" ? { ...field, options: categoryOptions } : field
        )
      );
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Handle form submission
  const handleSubmit = async (data) => {
    console.log('checkdata',data)
    const response = await addSubcategory(data);
    if (response) {
      loadSubcategories();
      setIsModalOpen(false);
      showSuccessAlert("Subcategory added successfully");
    }
  };


  

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
          "Item image",
        ]}
        tableData={subcategoryData}
        renderRow={(row, index) => (
          <tr key={index} className="border-b hover:bg-gray-100 transition">
            <td className="px-2 py-2">{row.category}</td>
            <td className="px-2 py-2">{row.subcategory}</td>
            <td className="px-2 py-2">{row.description}</td>
            <td className="px-2 py-2">
              <img
                src={`${IMG_URL}/${row.image_path}`}
                alt={row.image_path}
                className="h-8 w-8 object-cover"
              />
            </td>
          </tr>
        )}
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

