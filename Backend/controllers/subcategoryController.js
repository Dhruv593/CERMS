const db = require("../config/db");
const upload = require("../middleware/uploadMiddleware");

exports.getSubcategories = (req, res) => {
  const query = "SELECT * FROM subcategory";
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};

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

exports.addSubcategory = (req, res) => {
  upload.single("image")(req, res, (err) => {
    

    const { category, subcategory, description } = req.body;
    const image_path = req.file ? `/uploads/${req.file.filename}` : null;

    const query =
      "INSERT INTO subcategory (category, subcategory, description, image_path) VALUES (?, ?, ?, ?)";
    const values = [category, subcategory, description, image_path];

    db.query(query, values, (error, results) => {
      if (error) {
        return res.status(500).json({ error: "Error adding subcategory" });
      }
      res.json({ message: "Subcategory added successfully", id: results.insertId });
    });
  });
};
