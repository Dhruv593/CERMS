import React from 'react'
import { motion } from "framer-motion";
import { X } from "lucide-react";


export function Modal({ isOpen, onClose, categories }) {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white p-6 rounded-2xl shadow-xl w-[500px] relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
        <h3 className="text-lg font-semibold mb-4">Add Subcategory</h3>
        <select className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 mb-2">
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Subcategory Name"
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 mb-2"
        />
        <textarea
          placeholder="Description"
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 mb-2"
        />
        <input
          type="number"
          placeholder="Rent per piece per day"
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 mb-2"
        />
        <input
          type="number"
          placeholder="Deposit per piece per day"
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 mb-2"
        />
        <input
          type="file"
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 mb-2"
        />
        <div className="flex flex-col space-y-2 mt-4">
          <button className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
            Add
          </button>
        </div>
      </motion.div>
    </div>
    );
}
