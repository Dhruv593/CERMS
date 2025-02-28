import React, { useEffect, useState } from "react";
import Tables from "./tables";
import ReusableModal from "./ReusableModal";
import DeletePopUp from "./DeletePopUp";
import { addRent, getRents, updateRent, deleteRent } from "@/api/rentApi";
import { getCategories } from "@/api/categoryApi";
import { getSubcategoriesByCategory } from "@/api/subcategoryAPI";
import { rentFields } from "@/data/rent-modal";
import { Trash2, Edit } from "lucide-react";
import { showSuccessAlert, showErrorAlert } from "@/utils/AlertService";

function Rent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [rents, setRents] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);

  useEffect(() => {
    fetchRents();
    fetchCategories();
  }, []);

  const fetchRents = async () => {
    try {
      const data = await getRents();
      setRents(data);
    } catch (error) {
      console.error("Error fetching rents:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const categoriesData = await getCategories();
      setCategories(categoriesData.map((cat) => cat.category));
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleCategoryChange = async (selectedCategory) => {
    try {
      const subcategoryList = await getSubcategoriesByCategory(selectedCategory);
      setSubcategories(subcategoryList.map((subcat) => subcat.subcategory));
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      setSubcategories([]);
    }
  };

  const handleEditClick = (e, rowData) => {
    e.stopPropagation(); // Prevent row click from triggering
    setSelectedRowData(rowData);
    setIsModalOpen(true);
  };

 
  

  const handleDeleteClick = (e, rowData) => {
    e.stopPropagation(); // Prevent row click from triggering
    setRowToDelete(rowData);
    setIsDeletePopupOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteRent(rowToDelete.id);
      fetchRents(); // Refresh table after delete
      setIsDeletePopupOpen(false);
      showSuccessAlert("Rent Deleted Successfully");
    } catch (error) {
      console.error("Error deleting rent:", error);
      showErrorAlert("Error deleting rent");
    }
  };

  const handleSubmit = async (data) => {
    try {
      if (selectedRowData) {
        await updateRent(selectedRowData.id, data);
        showSuccessAlert("Rent Update Successfully");
      } else {
        await addRent(data);
        showSuccessAlert("Rent Added Successfully");
      }
      fetchRents();
      setIsModalOpen(false);
      setSelectedRowData(null);
    } catch (error) {
      console.error("Error saving rent:", error);
      showErrorAlert("Error saving rent");
    }
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setSelectedRowData(null);
    setIsModalOpen(false);
  };

  const filteredData = rents.filter(
    (row) =>
      row.category.toLowerCase().includes(searchValue.toLowerCase()) ||
      row.subcategory.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <>
      <Tables
        onButtonClick={handleOpenModal} // ✅ Add Rent button remains unchanged
        headerTitle="Rent"
        buttonLabel="Add Rent"
        searchProps={{
          value: searchValue,
          onChange: (e) => setSearchValue(e.target.value),
          placeholder: "Search...",
        }}
        tableHeaders={["Category", "Sub Category", "Rent", "Actions"]}
        tableData={filteredData}
        renderRow={(row, index) => (
          <tr key={index} className="border-b hover:bg-gray-100 transition">
            <td className="px-2 py-2">{row.category}</td>
            <td className="px-2 py-2">{row.subcategory}</td>
            <td className="px-2 py-2">{row.rent}</td>
            <td className="px-2 py-2 flex gap-2">
              <button
                onClick={(e) => handleEditClick(e, row)}
                className="text-white bg-green-400 hover:bg-green-500 flex items-center gap-1 p-2 rounded-lg"
              >
                <Edit size={18} /> Edit
              </button>
              <button
                onClick={(e) => handleDeleteClick(e, row)}
                className="text-white bg-red-600 hover:bg-red-700 flex items-center gap-1 p-2 rounded-lg"
              >
                <Trash2 size={18} /> Delete
              </button>
            </td>
          </tr>
        )}
      />

      {isModalOpen && (
        <ReusableModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={selectedRowData ? "Edit Rent" : "Add Rent"}
          fields={rentFields(categories, subcategories)}
          initialFormData={selectedRowData}
          onSubmit={handleSubmit}
          submitButtonLabel={selectedRowData ? "Update Rent" : "Add Rent"}
          onCategoryChange={handleCategoryChange}
        />
      )}

      {isDeletePopupOpen && (
        <DeletePopUp
        isOpen={isDeletePopupOpen}
        onClose={() => setIsDeletePopupOpen(false)}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this rent entry?"
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />
      )}
    </>
  );
}

export default Rent;
