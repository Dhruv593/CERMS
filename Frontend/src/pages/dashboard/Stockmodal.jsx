import React, { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

export function Stockmodal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    category: "",
    subcategory: "",
    partyName: "",
    contactNumber: "",
    purchaseFrom: "",
    purchaseDate: "",
    purchaseQuantity: "",
    paymentMode: "",
    transportInclude: "",
    stockPhoto: null,
    billPhoto: null,
    remarks: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("New Stock Data:", formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white w-full max-w-lg h-[90vh] rounded-2xl shadow-xl relative flex flex-col"
      >
        {/* Modal Header (Fixed) */}
        <div className="p-4 flex justify-between items-center border-b">
          <h3 className="text-lg font-semibold">Add New Stock</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Select Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Category</option>
                <option value="Category 1">Category 1</option>
                <option value="Category 2">Category 2</option>
              </select>
            </div>

            {/* Subcategory */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Select Subcategory</label>
              <select
                name="subcategory"
                value={formData.subcategory}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Subcategory</option>
                <option value="Subcategory 1">Subcategory 1</option>
                <option value="Subcategory 2">Subcategory 2</option>
              </select>
            </div>

            {/* Party Name & Contact */}
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="partyName"
                value={formData.partyName}
                onChange={handleChange}
                placeholder="Party Name"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                placeholder="Contact Number"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Purchase From & Date */}
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="purchaseFrom"
                value={formData.purchaseFrom}
                onChange={handleChange}
                placeholder="Purchased From"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="datetime-local"
                name="purchaseDate"
                value={formData.purchaseDate}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Purchase Quantity & Payment Mode */}
            <div className="grid grid-cols-2 gap-4">
              <select
                name="purchaseQuantity"
                value={formData.purchaseQuantity}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Quantity</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
              <select
                name="paymentMode"
                value={formData.paymentMode}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Payment Mode</option>
                <option value="Cash">Cash</option>
                <option value="Online">Online</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>

            {/* Transport Include */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Transport Included?</label>
              <select
                name="transportInclude"
                value={formData.transportInclude}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            {/* Upload Stock & Bill Photos */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Stock Photo</label>
                <input
                  type="file"
                  name="stockPhoto"
                  onChange={handleFileChange}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Bill Photo</label>
                <input
                  type="file"
                  name="billPhoto"
                  onChange={handleFileChange}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Remarks */}
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              placeholder="Remarks (Optional)"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </form>
        </div>

        {/* Modal Footer (Fixed) */}
        <div className="p-4 border-t flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          >
            Add Stock
          </button>
        </div>
      </motion.div>
    </div>
  );
}
