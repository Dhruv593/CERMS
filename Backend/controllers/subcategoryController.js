<<<<<<< HEAD
const path = require('path');
const db = require("../config/db");

exports.createSubcategory = (req, res) => {
  const { category, subcategory, description, rent, deposit } = req.body;
  let imagePath = null;
  
  if (req.file) {
    imagePath = `${req.protocol}://${req.get('host')}/uploads/subcategories/${req.file.filename}`;
  }
  
  const sql = `
    INSERT INTO subcategory (category, subcategory, description, rent, deposit, image_path)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(
    sql,
    [category, subcategory, description, rent, deposit, imagePath],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database insertion failed' });
      }
      res.status(201).json({
        message: 'Subcategory created successfully',
        id: result.insertId,
      });
    }
  );
};

exports.getSubcategories = (req, res) => {
  const sql = 'SELECT * FROM subcategory';
  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to retrieve subcategories' });
=======
const db = require("../config/db");

// ✅ Get all subcategories
exports.getSubCategories = (req, res) => {
  const query = "SELECT * FROM subcategory";
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
>>>>>>> 709db8077004780322f76bbe9403f380aa921e6d
    }
    res.json(results);
  });
};

<<<<<<< HEAD
exports.getFormSubcategories = (req, res) => {
    const sql = `
      SELECT subcategory.*, category.category AS category_name FROM subcategory LEFT JOIN category ON subcategory.category = category.id
    `;
    db.query(sql, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to retrieve subcategories' });
      }
      res.json(results);
    });
  };
=======
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
>>>>>>> 709db8077004780322f76bbe9403f380aa921e6d
