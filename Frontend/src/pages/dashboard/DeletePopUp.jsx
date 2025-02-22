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
  confirmColor = "bg-red-600", 
  zIndex = 10000 
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm" 
      style={{ zIndex }}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        exit={{ opacity: 0, scale: 0.9 }} 
        className="bg-white p-6 rounded-lg shadow-lg w-[400px] max-w-full"
      >
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <p className="text-gray-700">{message}</p>
        
        <div className="mt-4 flex justify-end gap-4">
          <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">
            {cancelLabel}
          </button>
          <button onClick={onConfirm} className={`${confirmColor} text-white px-4 py-2 rounded`}>
            {confirmLabel}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default DeletePopUp;
