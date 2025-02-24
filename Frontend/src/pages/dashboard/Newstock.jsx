import React, { useState, useEffect } from "react";
import Tables from "./tables";
import ReusableModal from "./ReusableModal";
import DeletePopUp from "./DeletePopUp"; // Import the delete confirmation popup
import { addStock, getStockData, updateStock, deleteStock } from "@/api/newStockapi";
import { getCategories } from "@/api/categoryApi";
import { getSubcategoriesByCategory } from "@/api/subcategoryAPI";
import { stockFields } from "../../data/stock-modal"; // ✅ Importing dynamic fields function
import { Trash2, Edit } from "lucide-react";

function Newstock() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [stockData, setStockData] = useState([]);
  const [subcategories, setSubcategories] = useState([]); 
  const [categories, setCategories] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

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
      if (selectedRowData) {
        // Update stock if a row is selected
        await updateStock(selectedRowData.id, data);
      } else {
        // Otherwise, add new stock
        await addStock(data);
      }
      loadStockData();
      setIsModalOpen(false);
      setSelectedRowData(null);
    } catch (error) {
      console.error("Error submitting stock data:", error);
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
      await deleteStock(rowToDelete.id);
      loadStockData();
      setIsDeletePopupOpen(false);
    } catch (error) {
      console.error("Error deleting stock:", error);
    }
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRowData(null);
  };

  const handleRowClick = (row) => {
    setSelectedRow(row);
    setIsViewModalOpen(true);
  };

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsImageModalOpen(true);
  };

  const renderStockRow = (row, index) => (
    <tr key={index} className="border-b hover:bg-gray-100 transition" onClick={() => handleRowClick(row)}>
      <td className="px-2 py-2">{row.category}</td>
      <td className="px-2 py-2">{row.subcategory}</td>
      <td className="px-2 py-2">{row.partyName}</td>
      <td className="px-2 py-2">{row.purchaseDateTime}</td>
      <td className="px-2 py-2">{row.purchaseQuantity}</td>
      <td className="px-2 py-2">{row.paymentMode}</td>
      <td className="px-2 py-2">{row.transportInclude}</td>
      <td className="px-2 py-2">
        {row.stockPhoto && (
          <img
            src={row.stockPhoto}
            alt="Stock"
            className="h-8 w-8 object-cover cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              openImageModal(row.stockPhoto);
            }}
          />
        )}
      </td>
      <td className="px-2 py-2">
        {row.billPhoto && (
          <img
            src={row.billPhoto}
            alt="Bill"
            className="h-8 w-8 object-cover cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              openImageModal(row.billPhoto);
            }}
          />
        )}
      </td>
      <td className="px-2 py-2">{row.remarks}</td>
      <td className="px-2 py-2 flex gap-2">
        <button
          onClick={(e) => handleEditClick(e, row)}
          className="text-white bg-blue-600 hover:bg-blue-700 flex items-center gap-1 p-2 rounded-lg"
        >
          <Edit size={18}/> Edit
        </button>
        <button
          onClick={(e) => handleDeleteClick(e, row)}
          className="text-white bg-red-600 hover:bg-red-700 flex items-center gap-1 p-2 rounded-lg"
        >
          <Trash2 size={18} /> Delete
        </button>
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
          "Actions",
        ]}
        tableData={filteredData}
        renderRow={renderStockRow}
      />

      {isModalOpen && (
        <ReusableModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={selectedRowData ? "Edit Stock" : "Add New Stock"}
          fields={stockFields(categories, subcategories)}
          initialFormData={selectedRowData}  // Pre-populate the modal when editing
          onSubmit={handleSubmit}
          submitButtonLabel={selectedRowData ? "Update Stock" : "Add Stock"}
          onCategoryChange={handleCategoryChange}
        />
      )}
      {isViewModalOpen && selectedRow && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setIsViewModalOpen(false)}
        >
          <div
            className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">Stock Details</h3>
            <div className="space-y-4">
              <p>
                <strong>Category:</strong> {selectedRow.category}
              </p>
              <p>
                <strong>Sub Category:</strong> {selectedRow.subcategory}
              </p>
              <p>
                <strong>Party Name:</strong> {selectedRow.partyName}
              </p>
              <p>
                <strong>Purchase Date & Time:</strong>{" "}
                {selectedRow.purchaseDateTime}
              </p>
              <p>
                <strong>Quantity:</strong> {selectedRow.purchaseQuantity}
              </p>
              <p>
                <strong>Payment Mode:</strong> {selectedRow.paymentMode}
              </p>
              <p>
                <strong>Transport:</strong> {selectedRow.transportInclude}
              </p>
              <p>
                <strong>Remarks:</strong> {selectedRow.remarks}
              </p>
              <p>
                <strong>Stock Photo:</strong>{" "}
                {selectedRow.stockPhoto && (
                  <img
                    src={selectedRow.stockPhoto}
                    alt="Stock"
                    className="h-16 w-16 object-cover cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      openImageModal(selectedRow.stockPhoto);
                    }}
                  />
                )}
              </p>
              <p>
                <strong>Bill Photo:</strong>{" "}
                {selectedRow.billPhoto && (
                  <img
                    src={selectedRow.billPhoto}
                    alt="Bill"
                    className="h-16 w-16 object-cover cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      openImageModal(selectedRow.billPhoto);
                    }}
                  />
                )}
              </p>
            </div>
            <button
              onClick={() => setIsViewModalOpen(false)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
      {/* >> NEW */}

      {/* << NEW: Image Preview Modal */}
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

export default Newstock;




// import React, { useState, useEffect } from "react";
// import Tables from "./tables";
// import ReusableModal from "./ReusableModal";
// import { addStock, getStockData } from "@/api/newStockapi";
// import { getCategories } from "@/api/categoryApi";
// import { getSubcategoriesByCategory } from "@/api/subcategoryAPI";
// import {stockFields} from "../../data/stock-modal"; // ✅ Importing dynamic fields function

// function Newstock() {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [searchValue, setSearchValue] = useState("");
//   const [stockData, setStockData] = useState([]);
//   const [subcategories, setSubcategories] = useState([]); 
//   const [categories, setCategories] = useState([]);

//   useEffect(() => {
//     loadStockData();
//     fetchCategories();
//   }, []);

//   const loadStockData = async () => {
//     try {
//       const data = await getStockData();
//       if (data) {
//         setStockData(data);
//       }
//     } catch (error) {
//       console.error("Error loading stock data:", error);
//     }
//   };

//   const fetchCategories = async () => {
//     try {
//       const categoriesData = await getCategories();
//       setCategories(categoriesData.map((cat) => cat.category));
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//     }
//   };

//   const handleCategoryChange = async (selectedCategory) => {
//     try {
//       const subcategoryList = await getSubcategoriesByCategory(selectedCategory);
//       console.log("Fetched Subcategories:", subcategoryList);
//       setSubcategories(subcategoryList.map((subcat) => subcat.subcategory));
//     } catch (error) {
//       console.error("Error fetching subcategories:", error);
//       setSubcategories([]);
//     }
//   };

//   const handleSubmit = async (data) => {
//     try {
//       await addStock(data);
//       console.log(data);
//       loadStockData(); 
//       setIsModalOpen(false);
//     } catch (error) {
//       console.error("Failed to add deposit:", error);
//     }
//   };

//   const handleOpenModal = () => setIsModalOpen(true);
//   const handleCloseModal = () => setIsModalOpen(false);

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
//         {row.stockPhoto && <img src={row.stockPhoto} alt="Stock" className="h-8 w-8 object-cover" />}
//       </td>
//       <td className="px-2 py-2">
//         {row.billPhoto && <img src={row.billPhoto} alt="Bill" className="h-8 w-8 object-cover" />}
//       </td>
//       <td className="px-2 py-2">{row.remarks}</td>
//       <td className="px-2 py-2">
//         <a href="#" className="text-blue-600 hover:underline">Edit</a>
//       </td>
//     </tr>
//   );

//   const filteredData = stockData.filter((row) =>
//     (row.category?.toLowerCase() || "").includes(searchValue.toLowerCase()) ||
//     (row.subcategory?.toLowerCase() || "").includes(searchValue.toLowerCase()) ||
//     (row.partyName?.toLowerCase() || "").includes(searchValue.toLowerCase())
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
//         <ReusableModal
//           isOpen={isModalOpen}
//           onClose={handleCloseModal}
//           title="Add New Stock"
//           fields={stockFields(categories, subcategories)} // ✅ Calling function to get dynamic fields
//           onSubmit={handleSubmit}
//           submitButtonLabel="Add Stock"
//           onCategoryChange={handleCategoryChange}
//         />
//       )}
//     </>
//   );
// }

// export default Newstock;