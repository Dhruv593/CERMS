const db = require("../config/db");

// ✅ Get all subcategories
exports.getSubCategories = (req, res) => {
  const query = "SELECT * FROM subcategory";
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};

// ✅ Add a new subcategory
exports.addSubCategory = (req, res) => {
  const { category, subcategory, description, rent, deposit, imagePath } = req.body;
  
  if (!category || !subcategory || !description || !rent || !deposit) {
    return res.status(400).json({ error: "All fields except imagePath are required" });
  }

  const query = "INSERT INTO subcategory (category, subcategory, description, rent, deposit, image_path, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())";
  
  db.query(query, [category, subcategory, description, rent, deposit, imagePath || null], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Subcategory added successfully", id: result.insertId });
  });
};
