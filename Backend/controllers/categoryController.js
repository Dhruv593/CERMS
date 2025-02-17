const db = require("../config/db");

exports.getCategories = (req, res) => {
  const query = "SELECT * FROM category";
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