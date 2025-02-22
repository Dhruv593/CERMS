import React, { useEffect, useState } from "react";
import Tables from "./tables";
import ReusableModal from "./ReusableModal";
import DeletePopUp from "./DeletePopUp";
import { addDeposit, getDeposits, updateDeposit, deleteDeposit } from "@/api/depositAPI";
import { getCategories } from "@/api/categoryApi";
import { getSubcategoriesByCategory } from "@/api/subcategoryAPI";
import { depositFields } from "@/data/deposit-modal";
import { Trash2, Edit } from "lucide-react";

function Deposit() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [depositData, setDepositData] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);

  useEffect(() => {
    loadDepositData();
    fetchCategories();
  }, []);

  const loadDepositData = async () => {
    try {
      const data = await getDeposits();
      setDepositData(data);
    } catch (error) {
      console.error("Error loading deposit data:", error);
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
    e.stopPropagation();
    setSelectedRowData(rowData);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (e, rowData) => {
    e.stopPropagation();
    setRowToDelete(rowData);
    setIsDeletePopupOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteDeposit(rowToDelete.id);
      loadDepositData();
      setIsDeletePopupOpen(false);
    } catch (error) {
      console.error("Error deleting deposit:", error);
    }
  };

  const handleSubmit = async (data) => {
    try {
      if (selectedRowData) {
        await updateDeposit(selectedRowData.id, data);
      } else {
        await addDeposit(data);
      }
      loadDepositData();
      setIsModalOpen(false);
      setSelectedRowData(null);
    } catch (error) {
      console.error("Error saving deposit:", error);
    }
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setSelectedRowData(null);
    setIsModalOpen(false);
  };

  const filteredData = depositData.filter(
    (row) =>
      row.category.toLowerCase().includes(searchValue.toLowerCase()) ||
      row.subcategory.toLowerCase().includes(searchValue.toLowerCase())
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
          placeholder: "Search Deposit...",
        }}
        tableHeaders={["Category", "Subcategory", "Deposit", "Actions"]}
        tableData={filteredData}
        renderRow={(row, index) => (
          <tr key={index} className="border-b hover:bg-gray-100 transition">
            <td className="px-2 py-2">{row.category}</td>
            <td className="px-2 py-2">{row.subcategory}</td>
            <td className="px-2 py-2">{row.deposit}</td>
            <td className="px-2 py-2 flex gap-2">
              <button
                onClick={(e) => handleEditClick(e, row)}
                className="text-white bg-blue-600 hover:bg-blue-700 flex items-center gap-1 p-2 rounded-lg"
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
          title={selectedRowData ? "Edit Deposit" : "Add Deposit"}
          fields={depositFields(categories, subcategories)}
          initialFormData={selectedRowData}
          onSubmit={handleSubmit}
          submitButtonLabel={selectedRowData ? "Update Deposit" : "Add Deposit"}
          onCategoryChange={handleCategoryChange}
        />
      )}

      {isDeletePopupOpen && (
        <DeletePopUp
          isOpen={isDeletePopupOpen}
          onClose={() => setIsDeletePopupOpen(false)}
          onConfirm={confirmDelete}
          title="Confirm Deletion"
          message="Are you sure you want to delete this deposit entry?"
          confirmLabel="Delete"
          cancelLabel="Cancel"
        />
      )}
    </>
  );
}

export default Deposit;
