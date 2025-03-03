import { useState, useEffect } from "react";
import Table from "@/components/Table/Table";
import { categoryFields } from "@/data/category-modal";
import ReusableModal from "@/components/Modal/ReusableModal";
import { addCategory, getCategories } from "@/api/categoryApi";
import { showSuccessAlert, showErrorAlert } from "@/utils/AlertService";
import { Edit, Trash2 } from "lucide-react";

const Category = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // Rows per page

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleSubmit = async (data) => {
    try {
      if (selectedCategory) {
        showSuccessAlert("Category Updated Successfully");
      } else {
        const newCategory = await addCategory(data);
        setCategories([...categories, newCategory]);
        showSuccessAlert("Category Added Successfully");
      }
      setIsModalOpen(false);
      setSelectedCategory(null);
    } catch (error) {
      console.error("Error adding/updating category:", error);
      showErrorAlert("Error Processing Category");
    }
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = (categoryId) => {
    // Implement deleteCategory API call
    showSuccessAlert("Category Deleted Successfully");
  };

  const handleEditClick = (e, row) => {
    handleEdit(row);
  };

  const handleDeleteClick = (e, row) => {
    handleDelete(row.id); // Assuming row.id exists
  };

  // Filter Data for Search
  const filteredData = categories.filter((row) =>
    row.category.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Pagination Logic
  const startIndex = (currentPage - 1) * pageSize;

  // Render Category Row
  const renderCategoryRow = (row, index) => (
    <tr key={index} className="border-b hover:bg-gray-100 transition">
      <td className="p-2 text-center">{startIndex + index + 1}</td>
      <td className="p-2">{row.category}</td>
      <td className="p-2">{row.description}</td>
      <td className="p-2 d-flex justify-content-center gap-2">
        <button
          onClick={(e) => handleEditClick(e, row)}
          className="btn btn-sm btn-success d-flex align-items-center gap-1"
        >
          <Edit size={16} />
        </button>
        <button
          onClick={(e) => handleDeleteClick(e, row)}
          className="btn btn-sm btn-danger d-flex align-items-center gap-1"
        >
          <Trash2 size={16} />
        </button>
      </td>
    </tr>
  );

  return (
    <>
      <Table
        onButtonClick={() => setIsModalOpen(true)}
        buttonLabel="Add Category"
        searchProps={{
          value: searchValue,
          onChange: (e) => setSearchValue(e.target.value),
          placeholder: "Search Category...",
        }}
        tableHeaders={["#", "Category", "Description", "Actions"]}
        tableData={filteredData}
        renderRow={renderCategoryRow}
      />
      {isModalOpen && (
        <ReusableModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedCategory(null);
          }}
          title={selectedCategory ? "Edit Category" : "Add Category"}
          fields={categoryFields}
          initialFormData={selectedCategory}
          onSubmit={handleSubmit}
          submitButtonLabel={selectedCategory ? "Update Category" : "Add Category"}
        />
      )}
    </>
  );
};

export default Category;
