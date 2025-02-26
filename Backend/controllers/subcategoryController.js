const db = require("../config/db");
const upload = require("../middleware/uploadMiddleware");

// Get all subcategories
exports.getSubcategories = (req, res) => {
  const query = "SELECT * FROM subcategory";
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};

// Get subcategories by category
exports.getSubcategoriesByCategory = (req, res) => {
  const category = req.params.category;
  if (!category) {
    return res.status(400).json({ error: "Category is required" });
  }

  const query = "SELECT subcategory FROM subcategory WHERE category = ?";
  db.query(query, [category], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};

// Add subcategory with image upload
exports.addSubcategory = (req, res) => {
  const { category, subcategory, description } = req.body;
  const image_path = req.file ? `/uploads/subcategories/${req.file.filename}` : null;

  if (!category || !subcategory || !description) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const query =
    "INSERT INTO subcategory (category, subcategory, description, image_path) VALUES (?, ?, ?, ?)";
  const values = [category, subcategory, description, image_path];
console.log('fdaffd',values)
  db.query(query, values, (error, results) => {
    if (error) {
      console.error("Error adding subcategory:", error);
      if (req.file) {
        const fs = require("fs");
        fs.unlinkSync(req.file.path);
      }
      return res.status(500).json({ error: "Error adding subcategory" });
    }

    res.json({
      message: "Subcategory added successfully",
      id: results.insertId,
      imagePath: image_path,
    });
  });
};
