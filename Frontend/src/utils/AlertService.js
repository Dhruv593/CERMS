import Swal from "sweetalert2";

/**
 * Displays a success alert with modern styling (Top-Center)
 * @param {string} title - The title of the alert
 * @param {string} text - The message to display
 */
export const showSuccessAlert = (title, text = "") => {
  Swal.fire({
    title,
    text,
    icon: "success",
    timer: 2000,
    showConfirmButton: false,
    position: "top", // Moves alert to the center top
    background: "#f0fff4", // Light green background
    color: "#155724", // Dark green text
    iconColor: "#28a745",
    width: "400px",
    toast: true, // Makes it appear like a notification
    padding: "15px",
    showClass: {
      popup: "swal2-show",
    },
    hideClass: {
      popup: "swal2-hide",
    },
  });
};

/**
 * Displays an error alert with modern styling (Top-Center)
 * @param {string} title - The title of the alert
 * @param {string} text - The error message to display
 */
export const showErrorAlert = (title, text = "") => {
  Swal.fire({
    title,
    text,
    icon: "error",
    confirmButtonText: "Try Again",
    confirmButtonColor: "#d33",
    position: "top", // Moves alert to the center top
    background: "#fff5f5", // Light red background
    color: "#721c24", // Dark red text
    iconColor: "#dc3545",
    width: "400px",
    toast: true, // Makes it appear like a notification
    padding: "15px",
    showClass: {
      popup: "swal2-show",
    },
    hideClass: {
      popup: "swal2-hide",
    },
  });
};

/**
 * Displays a confirmation alert with modern styling (Top-Center)
 * @param {string} title - The title of the alert
 * @param {string} text - The message to display
 * @param {function} onConfirm - Function to execute on confirmation
 */
export const showConfirmAlert = (title, text, onConfirm) => {
  Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, Confirm",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#28a745",
    cancelButtonColor: "#dc3545",
    position: "top", // Moves alert to the center top
    background: "#fffef0", // Light yellow background
    color: "#856404", // Dark yellow text
    iconColor: "#ffc107",
    width: "400px",
    toast: true, // Makes it appear like a notification
    padding: "15px",
    showClass: {
      popup: "swal2-show",
    },
    hideClass: {
      popup: "swal2-hide",
    },
  }).then((result) => {
    if (result.isConfirmed) {
      onConfirm();
    }
  });
};
