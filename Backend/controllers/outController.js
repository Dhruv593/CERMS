const db = require("../config/db");
const path = require("path");

exports.getOutData = (req, res) => {
  const sql = "SELECT * FROM in_out ORDER BY in_out_id DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching out data:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};


exports.addOutData = (req, res) => {
  console.log("Received Data:", req.body);

    try {
      const {
        customer,
        receiver,
        // other_proof,
        payMode,
        deposit,
        remark,
        cartItems = [] // Ensure cartItems is always an array
      } = req.body;
  
    // Handling Aadhar Photo Upload
      const aadhar = req.files?.aadharPhoto
      ? `uploads/in_out/aadhar/${req.files.aadharPhoto[0].filename}`
      : null;

    // Handling Other Proof Upload
    const otherProof = req.files?.other_proof
      ? `uploads/in_out/otherproof/${req.files.other_proof[0].filename}`
      : null;
  
      // ✅ Validate cartItems
      if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
        return res.status(400).json({ error: "Cart items are required" });
      }
  
      // ✅ Check for missing 'date' field
      for (const item of cartItems) {
        if (!item.date) {
          return res.status(400).json({ error: "Each item in cartItems must have a valid date" });
        }
      }
  
      // ✅ Insert materials into `material_info`
      const materialValues = cartItems.map(m => [m.category, m.subcategory, m.quantity, m.date]);
  
      const materialSql = `INSERT INTO material_info (category, subcategory, quantity, date) VALUES ?`;
  
      db.query(materialSql, [materialValues], (err, materialResult) => {
        if (err) {
          console.error("Error inserting material data:", err);
          return res.status(500).json({ error: err.message });
        }
  
        // ✅ Retrieve inserted material IDs
        const materialIds = [...Array(materialResult.affectedRows)].map((_, i) => materialResult.insertId + i);
        const materialInfoString = materialIds.join(",");
  
        // ✅ Insert data into `in_out`
        const outSql = `
          INSERT INTO in_out (customer, material_info, receiver, aadharPhoto, other_proof, payMode, deposit, remark) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
  
        const outValues = [customer, materialInfoString, receiver, aadhar, otherProof, payMode, deposit, remark];
  
        db.query(outSql, outValues, (err, outResult) => {
          if (err) {
            console.error("Error inserting out data:", err);
            return res.status(500).json({ error: err.message });
          }
  
          res.json({
            message: "Out data added successfully",
            in_out_id: outResult.insertId,
            material_ids: materialIds,
            aadhar,
            otherProof
          });
        });
      });
    } catch (error) {
      console.error("Error in addOutData:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
