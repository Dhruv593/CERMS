import React, { useState, useEffect } from "react";
import Tables from "./tables";
import ReusableModal from "./ReusableModal";
import { depositFields as initialDepositFields } from "@/data/deposit-modal";
import { addDeposit, getDeposits } from "@/api/depositAPI"; // Ensure these API functions exist
import { getCategories } from "@/api/categoryApi";
import { getSubcategories } from "@/api/subcategoryAPI";

function Deposit() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [depositData, setDepositData] = useState([]);
  const [depositFields, setDepositFields] = useState(initialDepositFields);

  // Load data when component mounts
  useEffect(() => {
    loadDepositData();
    fetchCategories();
    fetchSubcategories();
  }, []);

  // Fetch deposit data from DB
  const loadDepositData = async () => {
    try {
      const data = await getDeposits();
      setDepositData(data);
    } catch (error) {
      console.error("Error loading deposit data:", error);
    }
  };

  // Fetch and update category options
  const fetchCategories = async () => {
    try {
      const categories = await getCategories();
      const categoryOptions = categories.map((cat) => cat.category);
      setDepositFields((prevFields) =>
        prevFields.map((field) =>
          field.name === "category" ? { ...field, options: categoryOptions } : field
        )
      );
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Fetch and update subcategory options
  const fetchSubcategories = async () => {
    try {
      const subcategories = await getSubcategories();
      const subcategoryOptions = subcategories.map((sub) => sub.subcategory);
      setDepositFields((prevFields) =>
        prevFields.map((field) =>
          field.name === "subcategory" ? { ...field, options: subcategoryOptions } : field
        )
      );
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  // Handle form submission
  const handleSubmit = async (data) => {
    try {
      await addDeposit(data);
      console.log(data);
      loadDepositData(); // Refresh table after submission
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to add deposit:", error);
    }
  };

  // Modal controls
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  // Render table rows
  const renderDepositRow = (row, index) => (
    <tr key={index} className="border-b hover:bg-gray-100 transition">
      <td className="px-2 py-2">{row.category}</td>
      <td className="px-2 py-2">{row.subcategory}</td>
      <td className="px-2 py-2">{row.deposit}</td>
    </tr>
  );

  // Filter data based on search input
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
        tableHeaders={["Category", "Subcategory", "Deposit"]}
        tableData={filteredData}
        renderRow={renderDepositRow}
      />

      {isModalOpen && (
        <ReusableModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title="Add Deposit"
          fields={depositFields}
          onSubmit={handleSubmit}
          submitButtonLabel="Add Deposit"
        />
      )}
    </>
  );
}

export default Deposit;

