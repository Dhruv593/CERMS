import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

export function ReusableModal({
  isOpen,
  onClose,
  title,
  fields,
  onSubmit,
  submitButtonLabel = "Submit",
  onCategoryChange,
  initialFormData = null,
}) {
  const initialState = fields.reduce((acc, field) => {
    acc[field.name] = field.initialValue || (field.type === "file" ? null : "");
    return acc;
  }, {});
console.log("initialFormData",initialFormData)
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({}); // ✅ Validation State

  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormData ? { ...initialFormData } : initialState);
      setErrors({}); // ✅ Reset errors on modal open
    }
  }, [isOpen, initialFormData]);

  const validateField = (name, value) => {
    let error = "";

    if (name === "category" || name === "subcategory") {
      if (!/^[A-Za-z\s]+$/.test(value)) {
        error = `${name} must contain only letters and spaces.`;
      }
    }
    
    if (name === "partyName") {
      if (!/^[A-Za-z\s]+$/.test(value)) {
        error = `Party Name must contain only letters and spaces.`;
      }
    }
    
    if (name === "partyContact") {
      if (!/^\d{10}$/.test(value)) {
        error = "Contact number must be exactly 10 digits.";
      }
    }

    if (name.includes("deposit") || name.includes("rent") || name.includes("purchaseQuantity")) {
      if (!/^\d+(\.\d{1,2})?$/.test(value)) {
        error = `${name} must be a valid number.`;
      }
    }

    if (name.includes("purchaseQuantity")) {
      if (!/^\d+(\.\d{1,2})?$/.test(value)) {
        error = `Purchase Quantity must be a valid number.`;
      }
    }

    if (name.includes("Photo") && !value) {
      error = "Please upload an image.";
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    validateField(name, value); 

    if (name === "category" && onCategoryChange) {
      onCategoryChange(value);
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      setFormData((prev) => ({ ...prev, [name]: files[0] })); 
      validateField(name, files[0]); 
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (Object.values(errors).some((err) => err)) return;

    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  const formWrapperClass = fields.length >= 5 ? "grid grid-cols-2 gap-4" : "space-y-4";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
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
          <form onSubmit={handleSubmit} encType="multipart/form-data">
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
                          className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                            errors[field.name] ? "border-red-500" : ""
                          }`} // ✅ Red border for errors
                        />
                        {errors[field.name] && (
                          <p className="text-red-500 text-sm">{errors[field.name]}</p>
                        )}
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
                          <option value="">{field.placeholder || `Select ${field.label}`}</option>
                          {field.options.map((option, index) => (
                            <option key={index} value={option}>
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
                        {errors[field.name] && (
                          <p className="text-red-500 text-sm">{errors[field.name]}</p>
                        )}
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
            disabled={Object.values(errors).some((err) => err)} // ✅ **Disable button if errors exist**
            className={`px-4 py-2 rounded-md transition ${
              Object.values(errors).some((err) => err)
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            {submitButtonLabel}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default ReusableModal;
