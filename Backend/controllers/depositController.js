const db = require("../config/db");

// Get Deposits with Category and Subcategory Names
exports.getDeposits = (req, res) => {
    const sql = `
        SELECT d.id, c.category, s.subcategory, d.deposit
        FROM deposit d
        JOIN category c ON d.category_id = c.id
        JOIN subcategory s ON d.subcategory_id = s.id
        ORDER BY d.id DESC
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

// Add Deposit
exports.addDeposit = (req, res) => {
  const { category, subcategory, deposit } = req.body;

  // Find category ID based on category name
  const categoryQuery = `SELECT id FROM category WHERE category = ?`;
  db.query(categoryQuery, [category], (err, categoryResult) => {
      if (err || categoryResult.length === 0) {
          return res.status(400).json({ error: "Invalid category." });
      }

      const category_id = categoryResult[0].id;

      // Find subcategory ID based on subcategory name
      const subcategoryQuery = `SELECT id FROM subcategory WHERE subcategory = ?`;
      db.query(subcategoryQuery, [subcategory], (err, subcategoryResult) => {
          if (err || subcategoryResult.length === 0) {
              return res.status(400).json({ error: "Invalid subcategory." });
          }

          const subcategory_id = subcategoryResult[0].id;

          // Insert deposit with IDs
          const insertQuery = `INSERT INTO deposit (category_id, subcategory_id, deposit) VALUES (?, ?, ?)`;
          db.query(insertQuery, [category_id, subcategory_id, deposit], (err, result) => {
              if (err) {
                  return res.status(500).json({ error: err.message });
              }
              res.json({ message: "Deposit added successfully", id: result.insertId });
          });
      });
  });
};
