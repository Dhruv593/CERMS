import React, { useState, useEffect } from "react";
import Tables from "./tables";
import ReusableModal from "./ReusableModal";
import { addStock, getStockData } from "@/api/newStockapi";
import { getCategories } from "@/api/categoryApi";
import { getSubcategoriesByCategory } from "@/api/subcategoryAPI";
import {stockFields} from "../../data/stock-modal"; // ✅ Importing dynamic fields function

function Newstock() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [stockData, setStockData] = useState([]);
  const [subcategories, setSubcategories] = useState([]); 
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadStockData();
    fetchCategories();
  }, []);

  const loadStockData = async () => {
    try {
      const data = await getStockData();
      if (data) {
        setStockData(data);
      }
    } catch (error) {
      console.error("Error loading stock data:", error);
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
      console.log("Fetched Subcategories:", subcategoryList);
      setSubcategories(subcategoryList.map((subcat) => subcat.subcategory));
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      setSubcategories([]);
    }
  };

  const handleSubmit = async (data) => {
    try {
      await addStock(data);
      console.log(data);
      loadStockData(); 
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to add deposit:", error);
    }
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const renderStockRow = (row, index) => (
    <tr key={index} className="border-b hover:bg-gray-100 transition">
      <td className="px-2 py-2">{row.category}</td>
      <td className="px-2 py-2">{row.subcategory}</td>
      <td className="px-2 py-2">{row.partyName}</td>
      <td className="px-2 py-2">{row.purchaseDateTime}</td>
      <td className="px-2 py-2">{row.purchaseQuantity}</td>
      <td className="px-2 py-2">{row.paymentMode}</td>
      <td className="px-2 py-2">{row.transportInclude}</td>
      <td className="px-2 py-2">
        {row.stockPhoto && <img src={row.stockPhoto} alt="Stock" className="h-8 w-8 object-cover" />}
      </td>
      <td className="px-2 py-2">
        {row.billPhoto && <img src={row.billPhoto} alt="Bill" className="h-8 w-8 object-cover" />}
      </td>
      <td className="px-2 py-2">{row.remarks}</td>
      <td className="px-2 py-2">
        <a href="#" className="text-blue-600 hover:underline">Edit</a>
      </td>
    </tr>
  );

  const filteredData = stockData.filter((row) =>
    (row.category?.toLowerCase() || "").includes(searchValue.toLowerCase()) ||
    (row.subcategory?.toLowerCase() || "").includes(searchValue.toLowerCase()) ||
    (row.partyName?.toLowerCase() || "").includes(searchValue.toLowerCase())
  );
  

  return (
    <>
      <Tables
        onButtonClick={handleOpenModal}
        headerTitle="Stock"
        buttonLabel="Add New Stock"
        searchProps={{
          value: searchValue,
          onChange: (e) => setSearchValue(e.target.value),
          placeholder: "Search Stock...",
        }}
        tableHeaders={[
          "Category",
          "Sub Category",
          "Party Name",
          "Purchase Date & Time",
          "Quantity",
          "Payment Mode",
          "Transport",
          "Stock Photo",
          "Bill Photo",
          "Remarks",
          "Action",
        ]}
        tableData={filteredData}
        renderRow={renderStockRow}
      />

      {isModalOpen && (
        <ReusableModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title="Add New Stock"
          fields={stockFields(categories, subcategories)} // ✅ Calling function to get dynamic fields
          onSubmit={handleSubmit}
          submitButtonLabel="Add Stock"
          onCategoryChange={handleCategoryChange}
        />
      )}
    </>
  );
}

export default Newstock;
