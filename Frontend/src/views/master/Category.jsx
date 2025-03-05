import { useState, useEffect } from "react";
import Table from "@/components/Table/Table";
import { categoryFields } from "@/data/category-modal";
import ReusableModal from "@/components/Modal/ReusableModal";
import DeletePopUp from "@/components/PopUp/DeletePopUp"; 
import { addCategory, getCategories, updateCategory, deleteCategory } from "@/api/categoryApi";
import { showSuccessAlert, showErrorAlert } from "@/utils/AlertService";
import { Edit, Trash2 } from "lucide-react";

const Category = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false); 
  const [rowToDelete, setRowToDelete] = useState(null);
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
        await updateCategory(selectedCategory.id, data);
        showSuccessAlert("Category Updated Successfully");
      } else {
        await addCategory(data);
        showSuccessAlert("Category Added Successfully");
      }
      fetchCategories(); // Refresh table
      setIsModalOpen(false);
      setSelectedCategory(null);
    } catch (error) {
      console.error("Error processing category:", error);
      showErrorAlert("Error Processing Category");
    }
  };

  const handleEditClick = (e, row) => {
    e.stopPropagation(); 
    setSelectedCategory(row);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (e, row) => {
    e.stopPropagation();
    setRowToDelete(row);
    setIsDeletePopupOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteCategory(rowToDelete.id); 
      fetchCategories(); 
      setIsDeletePopupOpen(false);
      showSuccessAlert("Category Deleted Successfully");
    } catch (error) {
      console.error("Error deleting category:", error);
      showErrorAlert("Error deleting category");
    }
  };

  // Filter Data for Search
  const filteredData = categories.filter((row) =>
    row.category.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Pagination Logic
  const startIndex = (currentPage - 1) * pageSize;

  // Render Category Row
  const renderCategoryRow = (row, index) => (
    <tr key={index} className="border-b hover:bg-gray-100 transition ">
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
        tableHeaders={["Id", "Category", "Description", "Actions"]}
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

      {isDeletePopupOpen && (
        <DeletePopUp
          isOpen={isDeletePopupOpen}
          onClose={() => setIsDeletePopupOpen(false)}
          onConfirm={confirmDelete}
          title="Confirm Deletion"
          message="Are you sure you want to delete this category?"
          confirmLabel="Delete"
          cancelLabel="Cancel"
        />
      )}
    </>
  );
};

export default Category;


// import { useState, useEffect } from "react";
// import Table from "@/components/Table/Table";
// import { categoryFields } from "@/data/category-modal";
// import ReusableModal from "@/components/Modal/ReusableModal";
// import DeletePopUp from "@/components/PopUp/DeletePopUp"; 
// import { addCategory, getCategories, updateCategory, deleteCategory } from "@/api/categoryApi";
// import { showSuccessAlert, showErrorAlert } from "@/utils/AlertService";
// import { Edit, Trash2 } from "lucide-react";

// const Category = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [searchValue, setSearchValue] = useState("");
//   const [categories, setCategories] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false); 
//   const [rowToDelete, setRowToDelete] = useState(null); 

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const fetchCategories = async () => {
//     try {
//       const data = await getCategories();
//       setCategories(data);
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//     }
//   };

//   const handleSubmit = async (data) => {
//     try {
//       if (selectedCategory) {
//         await updateCategory(selectedCategory.id, data);
//         showSuccessAlert("Category Updated Successfully");
//       } else {
//         await addCategory(data);
//         showSuccessAlert("Category Added Successfully");
//       }
//       fetchCategories(); // Refresh table
//       setIsModalOpen(false);
//       setSelectedCategory(null);
//     } catch (error) {
//       console.error("Error processing category:", error);
//       showErrorAlert("Error Processing Category");
//     }
//   };

//   const handleEditClick = (e, row) => {
//     e.stopPropagation(); 
//     setSelectedCategory(row);
//     setIsModalOpen(true);
//   };

//   const handleDeleteClick = (e, row) => {
//     e.stopPropagation();
//     setRowToDelete(row);
//     setIsDeletePopupOpen(true);
//   };

//   const confirmDelete = async () => {
//     try {
//       await deleteCategory(rowToDelete.id); 
//       fetchCategories(); 
//       setIsDeletePopupOpen(false);
//       showSuccessAlert("Category Deleted Successfully");
//     } catch (error) {
//       console.error("Error deleting category:", error);
//       showErrorAlert("Error deleting category");
//     }
//   };

//   // Filter Data for Search
//   const filteredData = categories.filter((row) =>
//     row.category.toLowerCase().includes(searchValue.toLowerCase())
//   );

//   // Render Category Row
//   const renderCategoryRow = (row, index) => (
//     <tr key={index} className="border-b hover:bg-gray-100 transition ">
//       <td className="p-2">{row.category}</td>
//       <td className="p-2">{row.description}</td>
//       <td className="p-2 d-flex justify-content-center gap-2">
//         <button
//           onClick={(e) => handleEditClick(e, row)}
//           className="btn btn-sm btn-success d-flex align-items-center gap-1"
//         >
//           <Edit size={16} />
//         </button>
//         <button
//           onClick={(e) => handleDeleteClick(e, row)}
//           className="btn btn-sm btn-danger d-flex align-items-center gap-1"
//         >
//           <Trash2 size={16} />
//         </button>
//       </td>
//     </tr>
//   );

//   return (
//     <>
//       <Table
//         onButtonClick={() => setIsModalOpen(true)}
//         buttonLabel="Add Category"
//         searchProps={{
//           value: searchValue,
//           onChange: (e) => setSearchValue(e.target.value),
//           placeholder: "Search Category...",
//         }}
//         tableHeaders={["Category", "Description", "Actions"]}
//         tableData={filteredData}
//         renderRow={renderCategoryRow}
//       />

//       {isModalOpen && (
//         <ReusableModal
//           isOpen={isModalOpen}
//           onClose={() => {
//             setIsModalOpen(false);
//             setSelectedCategory(null);
//           }}
//           title={selectedCategory ? "Edit Category" : "Add Category"}
//           fields={categoryFields}
//           initialFormData={selectedCategory}
//           onSubmit={handleSubmit}
//           submitButtonLabel={selectedCategory ? "Update Category" : "Add Category"}
//         />
//       )}

//       {isDeletePopupOpen && (
//         <DeletePopUp
//           isOpen={isDeletePopupOpen}
//           onClose={() => setIsDeletePopupOpen(false)}
//           onConfirm={confirmDelete}
//           title="Confirm Deletion"
//           message="Are you sure you want to delete this category?"
//           confirmLabel="Delete"
//           cancelLabel="Cancel"
//         />
//       )}
//     </>
//   );
// };

// export default Category;
