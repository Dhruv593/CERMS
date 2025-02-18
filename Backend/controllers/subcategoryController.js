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
    }
    res.json(results);
  });
};

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
