import React, { useState, useEffect } from "react";
import Tables from "./tables";
import ReusableModal from "./ReusableModal";
import { stockFields as initialStockFields } from "@/data/stock-modal";
import { addStock, getStockData } from "@/api/newStockapi"; // newStockapi.js now includes getStockData as well
import { getCategories } from "@/api/categoryApi";
import { getSubcategories } from "@/api/subcategoryAPI";

function Newstock() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [stockData, setStockData] = useState([]);
  const [stockFields, setStockFields] = useState(initialStockFields);

  // Load stock data from DB on mount
  useEffect(() => {
    loadStockData();
    fetchCategories();
    fetchSubcategories();
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

  // Fetch categories to update the stockFields for category select
  const fetchCategories = async () => {
    try {
      const categories = await getCategories(); // assuming API returns an array of objects with at least { id, category }
      // Map to an array of options (if you need the name, adjust accordingly)
      const categoryOptions = categories.map((cat) => cat.category);
      setStockFields((prevFields) =>
        prevFields.map((field) =>
          field.name === "category" ? { ...field, options: categoryOptions } : field
        )
      );
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Fetch subcategories to update the stockFields for subcategory select
  const fetchSubcategories = async () => {
    try {
      const subcategories = await getSubcategories(); // assuming API returns an array of objects with at least { id, subcategory }
      const subcategoryOptions = subcategories.map((sub) => sub.subcategory);
      setStockFields((prevFields) =>
        prevFields.map((field) =>
          field.name === "subcategory" ? { ...field, options: subcategoryOptions } : field
        )
      );
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  const handleSubmit = async (data) => {
    const response = await addStock(data);
    if (response) {
      // Reload stock data after adding new stock
      loadStockData();
      setIsModalOpen(false);
    }
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  // Render each stock row from DB data
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
        {row.stockPhoto && (
          <img src={row.stockPhoto} alt="Stock" className="h-8 w-8 object-cover" />
        )}
      </td>
      <td className="px-2 py-2">
        {row.billPhoto && (
          <img src={row.billPhoto} alt="Bill" className="h-8 w-8 object-cover" />
        )}
      </td>
      <td className="px-2 py-2">{row.remarks}</td>
      <td className="px-2 py-2">
        <a href="#" className="text-blue-600 hover:underline">
          Edit
        </a>
      </td>
    </tr>
  );

  // Filter stock data based on search input
  const filteredData = stockData.filter((row) =>
    row.category.toLowerCase().includes(searchValue.toLowerCase()) ||
    row.subcategory.toLowerCase().includes(searchValue.toLowerCase()) ||
    row.partyName.toLowerCase().includes(searchValue.toLowerCase())
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
          fields={stockFields}
          onSubmit={handleSubmit}
          submitButtonLabel="Add Stock"
        />
      )}
    </>
  );
}

export default Newstock;




// import React, { useState } from "react";
// import Tables from "./tables";
// // import { Stockmodal } from "./Stockmodal";
// import { stockData } from "@/data/stock-data";
// import ReusableModal from "./ReusableModal";
// import { stockFields } from "@/data/stock-modal";

// function Newstock() {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [searchValue, setSearchValue] = useState("");

//   // Modal toggle handlers
//   const handleOpenModal = () => setIsModalOpen(true);
//   const handleCloseModal = () => setIsModalOpen(false);

//   const filteredData = stockData.filter((row) =>
//     row.category.toLowerCase().includes(searchValue.toLowerCase()) ||
//     row.subcategory.toLowerCase().includes(searchValue.toLowerCase()) ||
//     row.partyName.toLowerCase().includes(searchValue.toLowerCase())
//   );

//   const handleSubmit = (data) => {
//     console.log("Stock Data Submitted:", data);
//     // Perform further actions (e.g., API call)
//   };


//   const renderStockRow = (row, index) => (
//     <tr key={index} className="border-b hover:bg-gray-100 transition">
//       <td className="px-2 py-2">{row.category}</td>
//       <td className="px-2 py-2">{row.subcategory}</td>
//       <td className="px-2 py-2">{row.partyName}</td>
//       <td className="px-2 py-2">{row.purchaseDateTime}</td>
//       <td className="px-2 py-2">{row.purchaseQuantity}</td>
//       <td className="px-2 py-2">{row.paymentMode}</td>
//       <td className="px-2 py-2">{row.transportInclude}</td>
//       <td className="px-2 py-2">
//         <img src={row.stockPhoto} alt="Stock" className="h-8 w-8 object-cover" />
//       </td>
//       <td className="px-2 py-2">
//         <img src={row.billPhoto} alt="Bill" className="h-8 w-8 object-cover" />
//       </td>
//       <td className="px-2 py-2">{row.remarks}</td>
//       <td className="px-2 py-2">
//         <a href="#" className="text-blue-600 hover:underline">Edit</a>
//       </td>
//     </tr>
//   );

//   return (
//     <>
//       <Tables
//         onButtonClick={handleOpenModal}
//         headerTitle="Stock"
//         buttonLabel="Add New Stock"
//         searchProps={{
//           value: searchValue,
//           onChange: (e) => setSearchValue(e.target.value),
//           placeholder: "Search Stock...",
//         }}
//         tableHeaders={[
//           "Category",
//           "Sub Category",
//           "Party Name",
//           "Purchase Date & Time",
//           "Quantity",
//           "Payment Mode",
//           "Transport",
//           "Stock Photo",
//           "Bill Photo",
//           "Remarks",
//           "Action",
//         ]}
//         tableData={filteredData}
//         renderRow={renderStockRow}
//       />

//       {isModalOpen && (
//         // <Stockmodal isOpen={isModalOpen} onClose={handleCloseModal} />
//         <ReusableModal
//         isOpen={isModalOpen}
//         onClose={handleCloseModal}
//         title="Add New Stock"
//         fields={stockFields}
//         onSubmit={handleSubmit}
//         submitButtonLabel="Add Stock"
//       />
//       )}
//     </>
//   );
// }

// export default Newstock;
