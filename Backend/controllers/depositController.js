const db = require("../config/db");

exports.getDeposits = (req, res) => {
  const sql = "SELECT * FROM deposit_master ORDER BY deposit_date DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching deposits:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};

exports.addDeposit = (req, res) => {
  const { deposit_date, deposit_amount, payment_method, reference_number, depositor_name, account_details, remarks } = req.body;
  const sql = `
    INSERT INTO deposit_master 
      (deposit_date, deposit_amount, payment_method, reference_number, depositor_name, account_details, remarks)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [deposit_date, deposit_amount, payment_method, reference_number, depositor_name, account_details, remarks];
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error adding deposit:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Deposit added successfully", id: result.insertId });
  });
};
