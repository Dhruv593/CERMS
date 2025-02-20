const db = require("../config/db");

exports.getSubcategories = (req, res) => {
  const query = "SELECT * FROM subcategory";
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};

exports.addSubcategory = (req, res) => {
  const { category, subcategory, description } = req.body;
  const image_path = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    db.query(
      "INSERT INTO subcategory (category, subcategory, description, image_path) VALUES (?, ?, ?, ?)",
      [category, subcategory, description, image_path]
    );

    res.json({ message: "Subcategory added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error adding subcategory" });
  }
};
