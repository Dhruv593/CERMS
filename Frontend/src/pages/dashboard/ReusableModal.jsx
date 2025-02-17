import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

export function ReusableModal({
  isOpen,
  onClose,
  title,
  fields, // Array of field definitions
  onSubmit, // Callback function to handle form submission
  submitButtonLabel = "Submit",
}) {
  // Build initial state from fields prop
  const initialState = fields.reduce((acc, field) => {
    acc[field.name] = field.initialValue || (field.type === "file" ? null : "");
    return acc;
  }, {});

  const [formData, setFormData] = useState(initialState);

  // Reset form data whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData(initialState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  // Conditionally choose a layout: grid with 2 columns if 5+ fields, otherwise vertical stack.
  const formWrapperClass =
    fields.length >= 5 ? "grid grid-cols-2 gap-4" : "space-y-4";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        // Increased the width by using max-w-2xl instead of max-w-lg.
        className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] relative flex flex-col"
      >
        {/* Modal Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <X size={20} />
        </button>

        {/* Modal Title */}
        <h3 className="text-lg font-semibold mb-4">{title}</h3>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit}>
            <div className={formWrapperClass}>
              {fields.map((field) => {
                switch (field.type) {
                  case "text":
                  case "number":
                  case "datetime-local":
                  case "tel":
                    return (
                      <div key={field.name}>
                        <label className="block text-sm font-medium text-gray-700">
                          {field.label}
                        </label>
                        <input
                          type={field.type}
                          name={field.name}
                          value={formData[field.name]}
                          onChange={handleChange}
                          placeholder={field.placeholder}
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    );
                  case "textarea":
                    return (
                      <div key={field.name}>
                        <label className="block text-sm font-medium text-gray-700">
                          {field.label}
                        </label>
                        <textarea
                          name={field.name}
                          value={formData[field.name]}
                          onChange={handleChange}
                          placeholder={field.placeholder}
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        ></textarea>
                      </div>
                    );
                  case "select":
                    return (
                      <div key={field.name}>
                        <label className="block text-sm font-medium text-gray-700">
                          {field.label}
                        </label>
                        <select
                          name={field.name}
                          value={formData[field.name]}
                          onChange={handleChange}
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">
                            {field.placeholder || `Select ${field.label}`}
                          </option>
                          {field.options.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  case "file":
                    return (
                      <div key={field.name}>
                        <label className="block text-sm font-medium text-gray-700">
                          {field.label}
                        </label>
                        <input
                          type="file"
                          name={field.name}
                          onChange={handleFileChange}
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    );
                  default:
                    return null;
                }
              })}
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          >
            {submitButtonLabel}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default ReusableModal;
