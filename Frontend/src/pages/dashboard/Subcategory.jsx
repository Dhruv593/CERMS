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
  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
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
      const categories = await getCategories();
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
    console.log("Submitting data:", data);
    const response = await addSubcategory(data);
    if (response) {
      loadSubcategories();
      setIsModalOpen(false);
      showSuccessAlert("Subcategory added successfully");
    }
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const openImageModal = (imageUrl) => {
    setSelectedImage(`${IMG_URL}/${imageUrl}`);
    setIsImageModalOpen(true);
  };

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
        tableHeaders={["Category", "Subcategory", "Description", "Item Image"]}
        tableData={subcategoryData}
        renderRow={(row, index) => (
          <tr key={index} className="border-b hover:bg-gray-100 transition">
            <td className="px-2 py-2">{row.category}</td>
            <td className="px-2 py-2">{row.subcategory}</td>
            <td className="px-2 py-2">{row.description}</td>
            <td className="px-2 py-2">
              {row.image_path && (
                <img
                  src={`${IMG_URL}/${row.image_path}`}
                  alt={row.subcategory}
                  className="h-8 w-8 object-cover cursor-pointer"
                  onClick={() => openImageModal(row.image_path)}
                />
              )}
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

      {isImageModalOpen && selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
          onClick={() => setIsImageModalOpen(false)}
        >
          <img
            src={selectedImage}
            alt="Preview"
            className="max-w-full max-h-full cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}

export default Subcategory;
