import { useState, useEffect } from 'react';
import Table from '@/components/Table/Table';
import { getSubcategories, addSubcategory, updateSubcategory, deleteSubcategory } from '@/api/subcategoryAPI';
import { getCategories } from '@/api/categoryApi';
import ReusableModal from '@/components/Modal/ReusableModal';
import DeletePopUp from '@/components/PopUp/DeletePopUp';
import { subcategoryFields as initialSubcategoryFields } from '@/data/subcategory-modal';
import { showSuccessAlert, showErrorAlert } from '@/utils/AlertService';
import { Edit, Trash2 } from 'lucide-react';

const Subcategory = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [subcategoryData, setSubcategoryData] = useState([]);
  const [subcategoryFields, setSubcategoryFields] = useState(initialSubcategoryFields);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const pageSize = 10; // Rows per page
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
        prevFields.map((field) => (field.name === 'category' ? { ...field, options: categoryOptions } : field))
      );
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Handle form submission
  const handleSubmit = async (data) => {
    try {
      if (selectedRowData) {
        // Update existing subcategory
        await updateSubcategory(selectedRowData.id, data);
        showSuccessAlert('Subcategory updated successfully');
      } else {
        // Add new subcategory
        await addSubcategory(data);
        showSuccessAlert('Subcategory added successfully');
      }
      loadSubcategories();
      setIsModalOpen(false);
      setSelectedRowData(null);
    } catch (error) {
      console.error('Error saving subcategory:', error);
      showErrorAlert('Error saving subcategory');
    }
  };

  const handleEditClick = (e, rowData) => {
    e.stopPropagation(); // Prevent row click from triggering
    setSelectedRowData(rowData);
    setIsModalOpen(true);
    setSelectedImagePath(rowData.image);
  };

  const handleDeleteClick = (e, rowData) => {
    e.stopPropagation(); // Prevent row click from triggering
    console.log('Delete Clicked', rowData);
    setRowToDelete(rowData);
    setIsDeletePopupOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteSubcategory(rowToDelete.id);
      loadSubcategories(); // Refresh table after delete
      setIsDeletePopupOpen(false);
      showSuccessAlert('Subcategory Deleted Successfully');
    } catch (error) {
      console.error('Error deleting subcategory:', error);
      showErrorAlert('Error deleting subcategory');
    }
  };

  const handleOpenModal = () => {
    setSelectedRowData(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedRowData(null);
    setIsModalOpen(false);
  };

  const openImageModal = (imageUrl) => {
    setSelectedImage(`${IMG_URL}/${imageUrl}`);
    setIsImageModalOpen(true);
  };

  // Pagination Logic
  const startIndex = (currentPage - 1) * pageSize;

  return (
    <>
      <Table
        onButtonClick={handleOpenModal}
        headerTitle="Subcategory"
        buttonLabel="Add Subcategory"
        searchProps={{
          value: searchValue,
          onChange: (e) => setSearchValue(e.target.value),
          placeholder: 'Search Subcategory...'
        }}
        tableHeaders={['Id','Category', 'Subcategory', 'Description', 'Item Image', 'Actions']}
        tableData={subcategoryData}
        renderRow={(row, index) => (
          <tr key={index} className="border-b hover:bg-gray-100 transition">
            <td className="p-2 text-center">{startIndex + index + 1}</td>
            <td className="px-2 py-2">{row.category}</td>
            <td className="px-2 py-2">{row.subcategory}</td>
            <td className="px-2 py-2">{row.description}</td>
            <td className="px-2 py-2">
              {row.image_path && (
                <img
                  src={`${IMG_URL}/${row.image_path}`}
                  alt={row.subcategory}
                  style={{ width: '30px', height: '30px', objectFit: 'cover', cursor: 'pointer' }}
                  onClick={() => openImageModal(row.image_path)}
                />
              )}
            </td>

            <td className="px-2 py-2">
              <div className="d-flex justify-content-center gap-2">
                <button onClick={(e) => handleEditClick(e, row)} className="btn btn-sm btn-success d-flex align-items-center gap-1">
                  <Edit size={16} />
                </button>
                <button onClick={(e) => handleDeleteClick(e, row)} className="btn btn-sm btn-danger d-flex align-items-center gap-1">
                  <Trash2 size={16} />
                </button>
              </div>
            </td>
          </tr>
        )}
      />

      {isModalOpen && (
        <ReusableModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={selectedRowData ? 'Edit Subcategory' : 'Add Subcategory'}
          fields={subcategoryFields}
          initialFormData={selectedRowData}
          onSubmit={handleSubmit}
          submitButtonLabel={selectedRowData ? 'Update Subcategory' : 'Add Subcategory'}
        />
      )}

      {isDeletePopupOpen && (
        <DeletePopUp
          isOpen={isDeletePopupOpen}
          onClose={() => setIsDeletePopupOpen(false)}
          onConfirm={confirmDelete}
          title="Confirm Deletion"
          message="Are you sure you want to delete this subcategory?"
          confirmLabel="Delete"
          cancelLabel="Cancel"
        />
      )}

      {isImageModalOpen && selectedImage && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-75"
          style={{ zIndex: 1050 }}
          onClick={() => setIsImageModalOpen(false)}
        >
          <img
            src={selectedImage}
            alt="Preview"
            className="img-fluid cursor-pointer"
            style={{ maxWidth: '100%', maxHeight: '100%' }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};

export default Subcategory;

// import { useState, useEffect } from "react";
// import Table from "@/components/Table/Table";
// import { getSubcategories, addSubcategory } from "@/api/subcategoryAPI";
// import { getCategories } from "@/api/categoryApi";
// import ReusableModal from "@/components/Modal/ReusableModal";
// import { subcategoryFields as initialSubcategoryFields } from "@/data/subcategory-modal";
// import { showSuccessAlert } from "@/utils/AlertService";

// const Subcategory = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [searchValue, setSearchValue] = useState("");
//   const [subcategoryData, setSubcategoryData] = useState([]);
//   const [subcategoryFields, setSubcategoryFields] = useState(initialSubcategoryFields);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [isImageModalOpen, setIsImageModalOpen] = useState(false);
//   const IMG_URL = import.meta.env.VITE_IMG_URL;

//   useEffect(() => {
//     loadSubcategories();
//     fetchCategories();
//   }, []);

//   // Load subcategories from API
//   const loadSubcategories = async () => {
//     const data = await getSubcategories();
//     if (data) {
//       setSubcategoryData(data);
//     }
//   };

//   // Fetch categories dynamically
//   const fetchCategories = async () => {
//     try {
//       const categories = await getCategories();
//       const categoryOptions = categories.map((cat) => cat.category);

//       setSubcategoryFields((prevFields) =>
//         prevFields.map((field) =>
//           field.name === "category" ? { ...field, options: categoryOptions } : field
//         )
//       );
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//     }
//   };

//   // Handle form submission
//   const handleSubmit = async (data) => {
//     console.log("Submitting data:", data);
//     const response = await addSubcategory(data);
//     if (response) {
//       loadSubcategories();
//       setIsModalOpen(false);
//       showSuccessAlert("Subcategory added successfully");
//     }
//   };

//   const handleOpenModal = () => setIsModalOpen(true);
//   const handleCloseModal = () => setIsModalOpen(false);

//   const openImageModal = (imageUrl) => {
//     setSelectedImage(`${IMG_URL}/${imageUrl}`);
//     setIsImageModalOpen(true);
//   };

//   return (
//     <>
//       <Table
//         onButtonClick={handleOpenModal}
//         headerTitle="Subcategory"
//         buttonLabel="Add Subcategory"
//         searchProps={{
//           value: searchValue,
//           onChange: (e) => setSearchValue(e.target.value),
//           placeholder: "Search Subcategory...",
//         }}
//         tableHeaders={["Category", "Subcategory", "Description", "Item Image"]}
//         tableData={subcategoryData}
//         renderRow={(row, index) => (
//           <tr key={index} className="border-b hover:bg-gray-100 transition">
//             <td className="px-2 py-2">{row.category}</td>
//             <td className="px-2 py-2">{row.subcategory}</td>
//             <td className="px-2 py-2">{row.description}</td>
//             <td className="px-2 py-2">
//               {row.image_path && (
//                 <img
//                   src={`${IMG_URL}/${row.image_path}`}
//                   alt={row.subcategory}
//                   className="h-8 w-8 object-cover cursor-pointer"
//                   onClick={() => openImageModal(row.image_path)}
//                 />
//               )}
//             </td>
//           </tr>
//         )}
//       />

//       {isModalOpen && (
//         <ReusableModal
//           isOpen={isModalOpen}
//           onClose={handleCloseModal}
//           title="Add Subcategory"
//           fields={subcategoryFields}
//           onSubmit={handleSubmit}
//           submitButtonLabel="Add Subcategory"
//         />
//       )}

//       {isImageModalOpen && selectedImage && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
//           onClick={() => setIsImageModalOpen(false)}
//         >
//           <img
//             src={selectedImage}
//             alt="Preview"
//             className="max-w-full max-h-full cursor-pointer"
//             onClick={(e) => e.stopPropagation()}
//           />
//         </div>
//       )}
//     </>
//   );
// }

// export default Subcategory;
