import React from 'react'

import { useState } from "react";
import Tables from "./tables";

import {Stockmodal} from './Stockmodal';
import { Plus } from 'lucide-react';

function Newstock() {

    const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <>
        <div>
        <div className="flex justify-between items-center p-4 bg-white shadow-md rounded-md mt-5">
        <h2 className="text-xl font-semibold">New Stock</h2>
        <button onClick={handleOpenModal} className="flex bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
        <Plus />Add New Stock
        </button>
      </div>
      <Tables />
      {isModalOpen && (
        <Stockmodal 
            isOpen={isModalOpen} 
            onClose={handleCloseModal}
        />

      )}
        </div>
    </>
  )
}

export default Newstock
