import React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

export function ReusablePopUp({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div 
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50"
      style={{ zIndex: 1050 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white p-4 rounded-3 shadow-lg w-100" 
        style={{ maxWidth: "600px", maxHeight: "90vh", overflowY: "auto", position: "relative" }}
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="btn position-absolute top-0 end-0 m-3"
        >
          <X size={20} />
        </button>

        {/* Modal Title */}
        {title && <h3 className="mb-3 text-center">{title}</h3>}

        {/* Content */}
        <div>
          {children}
        </div>

        {/* Footer */}
        {/* <div className="border-top p-3 d-flex justify-content-end">
          <button
            onClick={onClose}
            className="btn btn-primary"
          >
            Close
          </button>
        </div> */}
      </motion.div>
    </div>
  );
}

export default ReusablePopUp;
