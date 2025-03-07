const db = require("../config/db");
const upload = require("../middleware/uploadMiddleware");
const fs = require("fs");

// Get all customers
exports.getCustomers = (req, res) => {
  const query = "SELECT * FROM customer ORDER BY id DESC";
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};

// Get a single customer by ID
exports.getCustomerById = (req, res) => {
  const id = req.params.id;
  const query = "SELECT * FROM customer WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.json(result[0]);
  });
};

// Add a new customer
exports.addCustomer = (req, res) => {
  const { name, email, mobile, address, site_address } = req.body;
  const aadharPhoto = req.files?.aadharPhoto ? `uploads/customer/aadhar/${req.files.aadharPhoto[0].filename}` : null;
  const other_proof = req.files?.other_proof ? `uploads/customer/other/${req.files.other_proof[0].filename}` : null;

  if (!name || !email || !mobile || !address || !site_address) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const query = `INSERT INTO customer (name, email, mobile, address, site_address, aadharPhoto, other_proof) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const values = [name, email, mobile, address, site_address, aadharPhoto, other_proof];

  db.query(query, values, (error, results) => {
    if (error) {
      console.error("Error adding customer:", error);
      return res.status(500).json({ error: "Error adding customer" });
    }

    res.json({ message: "Customer added successfully", id: results.insertId });
  });
};

// Update a customer
exports.updateCustomer = (req, res) => {
  const { name, email, mobile, address, site_address } = req.body;
  const id = req.params.id;
  const aadharPhoto = req.files?.aadharPhoto ? `uploads/customer/aadhar/${req.files.aadharPhoto[0].filename}` : null;
  const other_proof = req.files?.other_proof ? `uploads/customer/other/${req.files.other_proof[0].filename}` : null;

  const query = `UPDATE customer SET name = ?, email = ?, mobile = ?, address = ?, site_address = ?`;
  const values = [name, email, mobile, address, site_address];

  if (aadharPhoto) {
    sql += `, aadharPhoto= ?`;
    values.push(aadharPhoto);
  }

  if (other_proof) {
    sql += `, other_proof = ?`;
    values.push(other_proof);
  }

  query += ` WHERE id = ?`;
  values.push(id);

  db.query(query, values, (error) => {
    if (error) {
      console.error("Error updating customer:", error);
      return res.status(500).json({ error: "Error updating customer" });
    }

    res.json({ message: "Customer updated successfully" });
  });
};

// Delete a customer
exports.deleteCustomer = (req, res) => {
  const id = req.params.id;

  const query = "DELETE FROM customer WHERE id = ?";
  db.query(query, [id], (error) => {
    if (error) {
      return res.status(500).json({ error: "Error deleting customer" });
    }

    res.json({ message: "Customer deleted successfully" });
  });
};
