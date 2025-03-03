import React, { useEffect, useState } from "react";
import Table from "@/components/Table/Table";
import ReusableModal from "@/components/Modal/ReusableModal";
import DeletePopUp from "@/components/PopUp/DeletePopUp";
import { addDeposit, getDeposits, updateDeposit, deleteDeposit } from "@/api/depositAPI";
import { getCategories } from "@/api/categoryApi";
import { getSubcategoriesByCategory } from "@/api/subcategoryAPI";
import { depositFields } from "@/data/deposit-modal";
import { Trash2, Edit } from "lucide-react";
import { showSuccessAlert } from "@/utils/AlertService";

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
      showSuccessAlert("Deposit deleted successfully!");
    } catch (error) {
      console.error("Error deleting deposit:", error);
    }
  };

  const handleSubmit = async (data) => {
    try {
      if (selectedRowData) {
        await updateDeposit(selectedRowData.id, data);
        showSuccessAlert("Deposit updated successfully!");
      } else {
        await addDeposit(data);
        showSuccessAlert("Deposit added successfully!");
      }
      loadDepositData();
      setIsModalOpen(false);
      setSelectedRowData(null);
    } catch (error) {
      console.error("Error saving deposit:", error);
      showWarningAlert("Error saving deposit. Please try again.");
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
      <Table
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
          <tr key={index} className="border-bottom text-center">
                      <td className="p-2">{row.category}</td>
                      <td className="p-2">{row.subcategory}</td>
                      <td className="p-2">{row.deposit}</td>
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