import { useState, useEffect } from "react";
import Table from "@/components/Table/Table";
import { getCustomers, addCustomer, updateCustomer, deleteCustomer } from "@/api/customerApi";
import ReusableModal from "@/components/Modal/ReusableModal";
import DeletePopUp from "@/components/PopUp/DeletePopUp";
import { customerFields } from "@/data/customer-modal";
import { showSuccessAlert, showErrorAlert } from "@/utils/AlertService";

const Customer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
const [currentImage, setCurrentImage] = useState(null);
  const IMG_URL = import.meta.env.VITE_IMG_URL;

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    const data = await getCustomers();
    console.log("data: ", data)
    setCustomers(data);
  };

  const handleSubmit = async (data) => {
    try {
      let updatedData = { ...data };

      if (!data.aadharPhoto && selectedRowData?.aadharPhoto) {
        updatedData.aadharPhoto = selectedRowData.aadharPhoto;
      }
      if (!data.other_proof && selectedRowData?.other_proof) {
        updatedData.other_proof = selectedRowData.other_proof;
      }

      if (selectedRowData) {
        await updateCustomer(selectedRowData.id, updatedData);
        showSuccessAlert("Customer updated successfully");
      } else {
        await addCustomer(updatedData);
        showSuccessAlert("Customer added successfully");
      }

      loadCustomers();
      setIsModalOpen(false);
      setSelectedRowData(null);
    } catch (error) {
      showErrorAlert("Error saving customer");
    }
  };

  const handleEditClick = (row) => {
    if (!row || !row.id) {
      showErrorAlert("Invalid customer selected for editing.");
      return;
    }

    setSelectedRowData(row);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (row) => {
    if (!row || !row.id) {
      showErrorAlert("Invalid customer selected for deletion.");
      return;
    }

    setRowToDelete(row);
    setIsDeletePopupOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteCustomer(rowToDelete.id);
      loadCustomers();
      setIsDeletePopupOpen(false);
      showSuccessAlert("Customer deleted successfully");
    } catch (error) {
      showErrorAlert("Error deleting customer");
    }
  };

  const handleImageClick = (image) => {
    setCurrentImage(image);
    setIsImageModalOpen(true);
  };
  

  // Table data processing
  const tableData = customers.map((row) => ({ 
    id: row.id,
    name: row.name || "N/A",
    email: row.email || "N/A",
    mobile: row.mobile || "N/A",
    address: row.address || "N/A",
    site_address: row.site_address || "N/A",
    aadhar_photo: row.aadharPhoto ? `${IMG_URL}/${row.aadharPhoto}` : "N/A",
    other_proof: row.other_proof ? `${IMG_URL}/${row.other_proof}` : "N/A",
}));


  return (
    <>
      <Table
        onButtonClick={() => setIsModalOpen(true)}
        buttonLabel="Add Customer"
        tableHeaders={["Name", "Email", "Mobile", "Address", "Site Address", "Aadhar Photo", "Other Proof"]}
        tableData={tableData}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      {isModalOpen && (
        <ReusableModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedRowData(null);
          }}
          title={selectedRowData ? "Edit Customer" : "Add Customer"}
          fields={customerFields}
          initialFormData={selectedRowData || {}}
          onSubmit={handleSubmit}
          submitButtonLabel={selectedRowData ? "Update Customer" : "Add Customer"}
        />
      )}

      {isDeletePopupOpen && (
        <DeletePopUp
          isOpen={isDeletePopupOpen}
          onClose={() => setIsDeletePopupOpen(false)}
          onConfirm={confirmDelete}
          title="Confirm Deletion"
          message="Are you sure you want to delete this customer?"
          confirmLabel="Delete"
          cancelLabel="Cancel"
        />
      )}
    </>
  );
};

export default Customer;
