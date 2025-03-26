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

exports.getMaterialInfoById = async (req, res) => {
  
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'Material Info ID is required' });
    }

    // Split the comma-separated IDs into an array
    const idsArray = id.split(',').map(Number);

    // Check if valid numbers
    if (idsArray.some(isNaN)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    // SQL query to fetch data
    const query = `SELECT * FROM material_info WHERE insert_id IN (?)`;

    db.query(query, [idsArray], (error, results) => {
      if (error) {
        console.error('Database query error:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'Material Info not found' });
      }

      res.json(results);
    });

  } catch (error) {
    console.error('Error fetching material info:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
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
      const outAadhar = req.files?.aadharPhoto
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
  
        const outValues = [customer, materialInfoString, receiver, outAadhar, otherProof, payMode, deposit, remark];
  
        db.query(outSql, outValues, (err, outResult) => {
          if (err) {
            console.error("Error inserting out data:", err);
            return res.status(500).json({ error: err.message });
          }
  
          res.json({
            message: "Out data added successfully",
            in_out_id: outResult.insertId,
            material_ids: materialIds,
            outAadhar,
            otherProof
          });
        });
      });
    } catch (error) {
      console.error("Error in addOutData:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  exports.deleteOutData = (req, res) => {
    const { id } = req.params;

    // Fetch material_info IDs from in_out table
    db.query(`SELECT material_info FROM in_out WHERE in_out_id = ?`, [id], (err, results) => {
        if (err) {
            console.error("Error fetching in_out data:", err);
            return res.status(500).json({ message: "Internal server error", error: err });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "Entry not found in in_out table" });
        }

        const materialInfoIds = results[0].material_info;

        // Delete the in_out row
        db.query(`DELETE FROM in_out WHERE in_out_id = ?`, [id], (err) => {
            if (err) {
                console.error("Error deleting in_out:", err);
                return res.status(500).json({ message: "Failed to delete in_out", error: err });
            }

            // If material_info contains multiple IDs (comma-separated), delete them
            if (materialInfoIds.includes(',')) {
                const idsArray = materialInfoIds.split(',').map(id => id.trim());

                // Construct dynamic query for multiple IDs
                const placeholders = idsArray.map(() => '?').join(',');
                const query = `DELETE FROM material_info WHERE insert_id IN (${placeholders})`;

                db.query(query, idsArray, (err) => {
                    if (err) {
                        console.error("Error deleting material_info:", err);
                        return res.status(500).json({ message: "Failed to delete material_info", error: err });
                    }

                    res.status(200).json({ message: "in_out and related material_info deleted successfully" });
                });

            } else {
                // If only a single ID exists, delete it directly
                db.query(`DELETE FROM material_info WHERE insert_id = ?`, [materialInfoIds], (err) => {
                    if (err) {
                        console.error("Error deleting material_info:", err);
                        return res.status(500).json({ message: "Failed to delete material_info", error: err });
                    }

                    res.status(200).json({ message: "in_out and related material_info deleted successfully" });
                });
            }
        });
    });
};