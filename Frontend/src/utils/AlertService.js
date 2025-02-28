import Swal from "sweetalert2";

/**
 * Displays a success alert
 * @param {string} title - The title of the alert
 * @param {string} text - The message to display
 */
export const showSuccessAlert = (title, text) => {
  Swal.fire({
    title,
    text,
    icon: "success",
    timer: 1500,
    showConfirmButton: false,
  });
};

/**
 * Displays an error alert
 * @param {string} title - The title of the alert
 * @param {string} text - The error message to display
 */
export const showErrorAlert = (title, text) => {
  Swal.fire({
    title,
    text,
    icon: "error",
    confirmButtonText: "Try Again",
  });
};
