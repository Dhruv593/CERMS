import { useState, useEffect } from "react";
import Tables from "./tables";
import { subcategoryData } from "@/data/subcategory-table.data";
import ReusableModal from "./ReusableModal";
import { subcategoryFields } from "@/data/subcategory-modal";
import { getSubcategories, addSubcategory } from "@/api/subcategoryAPI";

export function Subcategory() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [subcategoryData, setSubcategoryData] = useState([]);

  useEffect(() => {
    loadSubcategories();
  }, []);

  const loadSubcategories = async () => {
    const data = await getSubcategories();
    if (data) {
      setSubcategoryData(data);
    }
  };

  // const filteredData = subcategoryData.filter((row) =>
  //   row.category.toLowerCase().includes(searchValue.toLowerCase()) ||
  //   row.subcategory.toLowerCase().includes(searchValue.toLowerCase())
  // );

  const handleSubmit = async (data) => {
    const response = await addSubcategory(data);
    if (response) {
      loadSubcategories();
      setIsModalOpen(false);
    }
  };


  // const renderSubcategoryRow = (row, index) => (
  //   <tr key={index} className="border-b hover:bg-gray-100 transition">
  //     {/* Use category_name from the join query; if it's missing, fallback to row.category */}
  //     <td className="px-2 py-2">{row.category_name || row.category}</td>
  //     <td className="px-2 py-2">{row.subcategory}</td>
  //     <td className="px-2 py-2">{row.description}</td>
  //     <td className="px-2 py-2">{row.rent}</td>
  //     <td className="px-2 py-2">{row.deposit}</td>
  //     <td className="px-2 py-2">
  //       <img  
  //         src={row.image_path}
  //         alt={row.subcategory}
  //         className="h-8 w-8 object-cover"
  //       />
  //     </td>
  //   </tr>
  // );

    const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <>
      <Tables
        onButtonClick={handleOpenModal}
        headerTitle="Subcategory"
        buttonLabel="Add Subcategory"
        searchProps={{
          value: searchValue,
          onChange: (e) => setSearchValue(e.target.value),
          placeholder: "Search Subcategory...",
        }}
        tableHeaders={[
          "Category",
          "Subcategory",
          "Description",
          "Item image",
        ]}
        tableData={subcategoryData}
        renderRow={(row, index) => (
          <tr key={index} className="border-b hover:bg-gray-100 transition">
            <td className="px-2 py-2">{row.category}</td>
            <td className="px-2 py-2">{row.subcategory}</td>
            <td className="px-2 py-2">{row.description}</td>
            <td className="px-2 py-2">
              <img
                src={row.image}
                alt={row.subcategory}
                className="h-8 w-8 object-cover"
              />
            </td>
          </tr>
        )}
      />
      {isModalOpen && (
        <ReusableModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title="Add Subcategory"
          fields={subcategoryFields} // Pass categories to modal
          onSubmit={handleSubmit}
          submitButtonLabel="Add Subcategory"
        />
      )}
    </>
  );
}

export default Subcategory;
