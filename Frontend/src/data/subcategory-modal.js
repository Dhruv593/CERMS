// const db = require("../config/db");

// exports.getCategories = (req, res) => {
//   const query = "SELECT categoryName FROM category"; // Select only categoryName column
//   db.query(query, (err, results) => {
//     if (err) {
//       return res.status(500).json({ error: err.message });
//     }
//     const categoryNames = results.map((row) => row.categoryName); // Extract category names
//     res.json(categoryNames);
//   });
// };

export const subcategoryFields = [
    {
      name: "category",
      label: "Select Category",
      type: "select",
      options: ["Category 1", "Category 2", "Category 3"],
      placeholder: "Select Category",
    },
    { name: "subcategoryName", label: "Subcategory Name", type: "text", placeholder: "Subcategory Name" },
    { name: "description", label: "Description", type: "textarea", placeholder: "Description" },
    { name: "itemImage", label: "Item Image", type: "file" },
  ];