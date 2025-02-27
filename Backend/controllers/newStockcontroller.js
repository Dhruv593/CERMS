const db = require("../config/db");

exports.getStockData = (req, res) => {
  const sql = `
    SELECT 
      s.id,
      s.partyName,
      s.partyContact,
      s.purchaseFrom,
      s.purchaseDateTime,
      s.purchaseQuantity,
      s.paymentMode,
      s.transportInclude,
      s.stockPhoto,
      s.billPhoto,
      s.remarks,
      c.category AS category,
      sc.subcategory AS subcategory
    FROM stockdata s
    LEFT JOIN category c ON s.category_id = c.id
    LEFT JOIN subcategory sc ON s.subcategory_id = sc.id
    ORDER BY s.id DESC
  `;
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching stock data:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};

exports.addStock = (req, res) => {
  // See your existing addStock code
  console.log("Request Body:", req.body);
  console.log("Uploaded Files:", req.files);

  const {
    category,
    subcategory,
    partyName,
    partyContact,
    purchaseFrom,
    purchaseDateTime,
    purchaseQuantity,
    paymentMode,
    transportInclude,
    remarks,
  } = req.body;

  const stockPhoto = req.files?.stockPhoto
    ? `/uploads/stock/stock/${req.files.stockPhoto[0].filename}`
    : null;
  
  const billPhoto = req.files?.billPhoto
    ? `/uploads/stock/bill/${req.files.billPhoto[0].filename}`
    : null;

  const sql = `
    INSERT INTO stockdata 
      (category_id, subcategory_id, partyName, partyContact, purchaseFrom, purchaseDateTime, purchaseQuantity, paymentMode, transportInclude, stockPhoto, billPhoto, remarks)
    VALUES 
      (
        (SELECT id FROM category WHERE category = ?), 
        (SELECT id FROM subcategory WHERE subcategory = ?), 
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )
  `;

  const values = [
    category,
    subcategory,
    partyName,
    partyContact,
    purchaseFrom,
    purchaseDateTime,
    purchaseQuantity,
    paymentMode,
    transportInclude,
    stockPhoto,
    billPhoto,
    remarks,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Database Error:", err);
      if (req.file) {
        const fs = require("fs");
        fs.unlinkSync(req.file.path);
      }
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Stock added successfully", id: result.insertId, stockPhoto, billPhoto });
  });
};

exports.editStock = (req, res) => {
  
  const { id } = req.params;
  const {
    category,
    subcategory,
    partyName,
    partyContact,
    purchaseFrom,
    purchaseDateTime,
    purchaseQuantity,
    paymentMode,
    transportInclude,
    remarks,
  } = req.body;

  const stockPhoto = req.files?.stockPhoto
    ? `/uploads/stock/${req.files.stockPhoto[0].filename}`
    : null;
  
  const billPhoto = req.files?.billPhoto
    ? `/uploads/bill/${req.files.billPhoto[0].filename}`
    : null;

  let sql = `
    UPDATE stockdata 
    SET 
      category_id = (SELECT id FROM category WHERE category = ?), 
      subcategory_id = (SELECT id FROM subcategory WHERE subcategory = ?),
      partyName = ?,
      partyContact = ?,
      purchaseFrom = ?,
      purchaseDateTime = ?,
      purchaseQuantity = ?,
      paymentMode = ?,
      transportInclude = ?,
      remarks = ?
  `;

  const values = [
    category,
    subcategory,
    partyName,
    partyContact,
    purchaseFrom,
    purchaseDateTime,
    purchaseQuantity,
    paymentMode,
    transportInclude,
    remarks,
  ];

  if (stockPhoto) {
    sql += `, stockPhoto = ?`;
    values.push(stockPhoto);
  }

  if (billPhoto) {
    sql += `, billPhoto = ?`;
    values.push(billPhoto);
  }

  sql += ` WHERE id = ?`;
  values.push(id);

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error updating stock:", err);
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Stock entry not found" });
    }
    res.json({ message: "Stock updated successfully" });
  });
};

exports.deleteStock = (req, res) => {
  const { id } = req.params;

  const sql = `DELETE FROM stockdata WHERE id = ?`;

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error deleting stock:", err);
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Stock entry not found" });
    }
    res.json({ message: "Stock deleted successfully" });
  });
};





// const db = require("../config/db");

// exports.getStockData = (req, res) => {
//     // Joining stockdata with category and subcategory tables to get their names.
//     const sql = `
//       SELECT 
//         s.id,
//         s.partyName,
//         s.partyContact,
//         s.purchaseFrom,
//         s.purchaseDateTime,
//         s.purchaseQuantity,
//         s.paymentMode,
//         s.transportInclude,
//         s.stockPhoto,
//         s.billPhoto,
//         s.remarks,
//         c.category AS category,
//         sc.subcategory AS subcategory
//       FROM stockdata s
//       LEFT JOIN category c ON s.category_id = c.id
//       LEFT JOIN subcategory sc ON s.subcategory_id = sc.id
//       ORDER BY s.id DESC
//     `;
    
//     db.query(sql, (err, results) => {
//       if (err) {
//         console.error("Error fetching stock data:", err);
//         return res.status(500).json({ error: err.message });
//       }
//       res.json(results);
//     });
//   };


// exports.addStock = (req, res) => {
//   console.log("Request Body:", req.body);
//   console.log("Uploaded Files:", req.files);

//   // Destructure fields from req.body
//   const {
//     category,        // Expected to be category name
//     subcategory,     // Expected to be subcategory name
//     partyName,
//     partyContact,
//     purchaseFrom,
//     purchaseDateTime,
//     purchaseQuantity,
//     paymentMode,
//     transportInclude,
//     remarks
//   } = req.body;

//   // Get file paths if files are uploaded. Expecting two files: stockPhoto and billPhoto.
//   const stockPhoto = req.files && req.files.stockPhoto 
//     ? `/uploads/${req.files.stockPhoto[0].filename}` 
//     : null;
//   const billPhoto = req.files && req.files.billPhoto 
//     ? `/uploads/${req.files.billPhoto[0].filename}` 
//     : null;

//   // Prepare SQL with subqueries to get the correct foreign key IDs.
//   const sql = `
//     INSERT INTO stockdata 
//       (category_id, subcategory_id, partyName, partyContact, purchaseFrom, purchaseDateTime, purchaseQuantity, paymentMode, transportInclude, stockPhoto, billPhoto, remarks)
//     VALUES 
//       (
//         (SELECT id FROM category WHERE category = ?), 
//         (SELECT id FROM subcategory WHERE subcategory = ?), 
//         ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
//       )
//   `;

//   const values = [
//     category,
//     subcategory,
//     partyName,
//     partyContact,
//     purchaseFrom,
//     purchaseDateTime,
//     purchaseQuantity,
//     paymentMode,
//     transportInclude,
//     stockPhoto,
//     billPhoto,
//     remarks
//   ];

//   db.query(sql, values, (err, result) => {
//     if (err) {
//       console.error("Database Error:", err);
//       return res.status(500).json({ error: err.message });
//     }
//     res.json({ message: "Stock added successfully", id: result.insertId });
//   });
// };