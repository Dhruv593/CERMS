import { useState } from "react";
import Tables from "./tables";
import { Modal } from "./modal";
import { Plus } from 'lucide-react';



export function Subcategory() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <>
      <div className="flex justify-between items-center p-4 bg-white shadow-md rounded-md mt-5">
        <h2 className="text-xl font-semibold">Subcategories</h2>
        <button onClick={handleOpenModal} className="flex bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
        <Plus />Add Subcategory
        </button>
      </div>
      <Tables />
      {isModalOpen && (
        <Modal 
          isOpen={isModalOpen} 
          onClose={handleCloseModal}
          categories={["Category 1", "Category 2", "Category 3"]} // Example categories
        />
      )}
    </>
  );
}
