import React from "react";
import { motion } from "framer-motion";

const DeletePopUp = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Action", 
  message = "Are you sure?", 
  confirmLabel = "Confirm", 
  cancelLabel = "Cancel", 
  confirmColor = "btn-danger", 
  zIndex = 10000 
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50" 
      style={{ zIndex }}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        exit={{ opacity: 0, scale: 0.9 }} 
        className="bg-white p-4 rounded shadow-lg w-100" 
        style={{ maxWidth: "400px" }}
      >
        <h3 className="mb-3 text-center">{title}</h3>
        <p className="text-secondary text-center">{message}</p>
        
        <div className="mt-4 d-flex justify-content-end gap-2">
          <button onClick={onClose} className="btn btn-secondary">
            {cancelLabel}
          </button>
          <button onClick={onConfirm} className={`btn ${confirmColor}`}>
            {confirmLabel}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default DeletePopUp;