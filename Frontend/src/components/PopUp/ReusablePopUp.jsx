import React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

export function ReusablePopUp({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" 
      onClick={onClose}
    >
      <motion.div
        className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        {/* Modal Title */}
        {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default ReusablePopUp;
