const db = require("../config/db");

exports.getCategories = (req, res) => {
  const query = "SELECT * FROM category ORDER BY id DESC";
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};

exports.addCategory = (req, res) => {
  const { category, description } = req.body;
  const query = "INSERT INTO category (category, description) VALUES (?, ?)";
  db.query(query, [category, description], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: result.insertId, category, description });
  });
};

exports.editCategory = (req, res) => {
  const { id } = req.params;
  const { category, description } = req.body;

  if (!category || !description) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const updateCategoryQuery =
    "UPDATE category SET category = ?, description = ? WHERE id = ?";
  db.query(updateCategoryQuery, [category, description, id], (err, result) => {
    if (err) {
      console.error("Error updating category:", err);
      return res.status(500).json({ error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json({ message: "Category updated successfully" });
  });
};

// Delete category
exports.deleteCategory = (req, res) => {
  const { id } = req.params;

  const deleteCategoryQuery = "DELETE FROM category WHERE id = ?";
  db.query(deleteCategoryQuery, [id], (err, result) => {
    if (err) {
      console.error("Error deleting category:", err);
      return res.status(500).json({ error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json({ message: "Category deleted successfully" });
  });
};
