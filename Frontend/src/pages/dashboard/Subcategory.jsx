import { useState, useEffect } from "react";
import Tables from "./tables";
import { subcategoryData } from "@/data/subcategory-table.data";
import ReusableModal from "./ReusableModal";
import { subcategoryFields } from "@/data/subcategory-modal";
<<<<<<< HEAD
import axios from "axios";
=======
// import { getCategories } from "@/api/categoryApi"; // Fetch categories from API
import {addSubCategory, getSubCategories} from "@/api/subcategoryAPI";
>>>>>>> 709db8077004780322f76bbe9403f380aa921e6d

export function Subcategory() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
<<<<<<< HEAD
  const [subcategoryData, setSubcategoryData] = useState([]);

  useEffect(() => {
    fetchSubcategories();
  }, []);

  const fetchSubcategories = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/subcategories");
      setSubcategoryData(response.data);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };
=======
  const [categories, setCategories] = useState([]); // Store category data

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getSubCategories(); // Fetch categories from API
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);
>>>>>>> 709db8077004780322f76bbe9403f380aa921e6d

  const filteredData = subcategoryData.filter((row) =>
    row.category.toLowerCase().includes(searchValue.toLowerCase()) ||
    row.subcategory.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleSubmit = async (data) => {
<<<<<<< HEAD
    // Create FormData to include file upload
    const formData = new FormData();
    formData.append("category", data.category);
    formData.append("subcategory", data.subcategory);
    formData.append("description", data.description);
    formData.append("rent", data.rent);
    formData.append("deposit", data.deposit);
    if (data.image) {
      formData.append("image", data.image);
    }

    try {
      const response = await axios.post("http://localhost:5000/api/subcategories", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Subcategory created:", response.data);
      fetchSubcategories(); // Refresh table data
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error creating subcategory:", error);
    }
  };


  const renderSubcategoryRow = (row, index) => (
    <tr key={index} className="border-b hover:bg-gray-100 transition">
      {/* Use category_name from the join query; if it's missing, fallback to row.category */}
      <td className="px-2 py-2">{row.category_name || row.category}</td>
      <td className="px-2 py-2">{row.subcategory}</td>
      <td className="px-2 py-2">{row.description}</td>
      <td className="px-2 py-2">{row.rent}</td>
      <td className="px-2 py-2">{row.deposit}</td>
      <td className="px-2 py-2">
        <img  
          src={row.image_path}
          alt={row.subcategory}
          className="h-8 w-8 object-cover"
        />
      </td>
    </tr>
  );

=======
    console.log("Subcategory Data Submitted:", data);
    try {
            const newCategory = await addSubCategory(data);
            setCategories([...categories, newCategory]);
          } catch (error) {
            console.error("Error adding subcategory:", error);
          }
    // Perform further actions (e.g., API call)
  };

>>>>>>> 709db8077004780322f76bbe9403f380aa921e6d
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
          "Rent per piece per day",
          "Deposit per piece per day",
          "Item image",
        ]}
        tableData={filteredData}
        renderRow={(row, index) => (
          <tr key={index} className="border-b hover:bg-gray-100 transition">
            <td className="px-2 py-2">{row.category}</td>
            <td className="px-2 py-2">{row.subcategory}</td>
            <td className="px-2 py-2">{row.description}</td>
            <td className="px-2 py-2">{row.rent}</td>
            <td className="px-2 py-2">{row.deposit}</td>
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
