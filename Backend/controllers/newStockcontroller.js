const db = require("../config/db");

exports.getStockData = (req, res) => {
    // Joining stockdata with category and subcategory tables to get their names.
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
  console.log("Request Body:", req.body);
  console.log("Uploaded Files:", req.files);

  // Destructure fields from req.body
  const {
    category,        // Expected to be category name
    subcategory,     // Expected to be subcategory name
    partyName,
    partyContact,
    purchaseFrom,
    purchaseDateTime,
    purchaseQuantity,
    paymentMode,
    transportInclude,
    remarks
  } = req.body;

  // Get file paths if files are uploaded. Expecting two files: stockPhoto and billPhoto.
  const stockPhotoPath = req.files && req.files.stockPhoto 
    ? `/uploads/${req.files.stockPhoto[0].filename}` 
    : null;
  const billPhotoPath = req.files && req.files.billPhoto 
    ? `/uploads/${req.files.billPhoto[0].filename}` 
    : null;

  // Prepare SQL with subqueries to get the correct foreign key IDs.
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
    stockPhotoPath,
    billPhotoPath,
    remarks
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Database Error:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Stock added successfully", id: result.insertId });
  });
};
