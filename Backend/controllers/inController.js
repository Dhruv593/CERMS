const db = require("../config/db");


exports.getInData = (req, res) => {
  const sql = "SELECT * FROM in_out WHERE mode = 'in' ORDER BY in_out_id DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching out data:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
}

exports.getMaterialInfoById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Material Info ID is required" });
    }

    // Split the comma-separated IDs into an array
    const idsArray = id.split(",").map(Number);

    // Check if valid numbers
    if (idsArray.some(isNaN)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    // SQL query to fetch data from material_info_in instead of material_info
    const query = `SELECT * FROM material_info_in WHERE insert_id IN (?)`;

    db.query(query, [idsArray], (error, results) => {
      if (error) {
        console.error("Database query error:", error);
        return res.status(500).json({ message: "Internal server error" });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "Material Info not found" });
      }

      res.json(results);
    });
  } catch (error) {
    console.error("Error fetching material info:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.addInData = (req, res) => {
  console.log("Received Data:", req.body);

  try {
    const {
      customer,
      receiver,
      payMode,
      deposit,
      remark,
      cartItems = [], // Ensure cartItems is always an array
    } = req.body;

    // Handling Aadhar Photo Upload
    const inAadhar = req.files?.aadharPhoto
      ? `uploads/customer/aadhar/${req.files.aadharPhoto[0].filename}`
      : null;

    // Handling Other Proof Upload
    const otherProof = req.files?.other_proof
      ? `uploads/customer/other/${req.files.other_proof[0].filename}`
      : null;

    console.log(`inAadhar: ${inAadhar} \n otherProof: ${otherProof}`);

    // ✅ Validate cartItems
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ error: "Cart items are required" });
    }

    // ✅ Check for missing required fields
    for (const item of cartItems) {
      if (!item.returnQuantity || !item.returnDate) {
        return res
          .status(400)
          .json({ error: "Each item must have returnQuantity, and returnDate" });
      }
    }

    // ✅ Insert materials into `material_info_in`
    const materialValues = cartItems.map((m) => [
      m.category,
      m.subcategory,
      m.returnQuantity,
      m.returnDate,
      m.invoice || null,
      m.totalAmount || 0,
      m.deposit || 0,
      m.rent || 0,
      m.totalDays || 0,
      m.depositReturn || 0,
    ]);

    const materialSql = `
      INSERT INTO material_info_in (category, subcategory, return_quantity, return_date, invoice, amount, deposit, rent, totalDays, depositReturn) 
      VALUES ?
    `;

    db.query(materialSql, [materialValues], (err, materialResult) => {
      if (err) {
        console.error("Error inserting material data:", err);
        return res.status(500).json({ error: err.message });
      }

      // ✅ Retrieve inserted material IDs
      const materialIds = [...Array(materialResult.affectedRows)].map(
        (_, i) => materialResult.insertId + i
      );
      const materialInfoString = materialIds.join(",");

      // ✅ Insert data into `in_out` with mode = "in"
      const inSql = `
        INSERT INTO in_out (customer, material_info, receiver, aadharPhoto, other_proof, payMode, deposit, remark, mode) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'in')
      `;

      const inValues = [
        customer,
        materialInfoString,
        receiver,
        inAadhar,
        otherProof,
        payMode,
        deposit,
        remark,
      ];

      db.query(inSql, inValues, (err, inResult) => {
        if (err) {
          console.error("Error inserting in data:", err);
          return res.status(500).json({ error: err.message });
        }

        res.json({
          message: "In data added successfully",
          in_out_id: inResult.insertId,
          material_ids: materialIds,
          inAadhar,
          otherProof,
        });
      });
    });
  } catch (error) {
    console.error("Error in addInData:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.updateInData = (req, res) => {
  try {
    const { id } = req.params;
    const {
      customer,
      receiver,
      payMode,
      deposit,
      remark,
      cartItems = [], // Ensure cartItems is always an array
    } = req.body;

    // Handling Aadhar Photo Upload
    const inAadhar = req.files?.aadharPhoto
      ? `uploads/customer/aadhar/${req.files.aadharPhoto[0].filename}`
      : null;

    // Handling Other Proof Upload
    const otherProof = req.files?.other_proof
      ? `uploads/customer/other/${req.files.other_proof[0].filename}`
      : null;

    // Validate cartItems
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ error: "Cart items are required" });
    }

    // Check for missing required fields in cartItems
    for (const item of cartItems) {
      if (!item.returnQuantity || !item.returnDate) {
        return res
          .status(400)
          .json({ error: "Each item must have returnQuantity and returnDate" });
      }
    }

    // Update materials in `material_info_in`
    const materialValues = cartItems.map((m) => [
      m.category,
      m.subcategory,
      m.returnQuantity,
      m.returnDate,
      m.invoice || null,
      m.totalAmount || 0,
      m.deposit || 0,
      m.rent || 0,
      m.totalDays || 0,
      m.depositReturn || 0,
    ]);

    const deleteMaterialSql = `DELETE FROM material_info_in WHERE insert_id IN (SELECT material_info FROM in_out WHERE in_out_id = ?)`;
    db.query(deleteMaterialSql, [id], (err) => {
      if (err) {
        console.error("Error deleting old material data:", err);
        return res.status(500).json({ error: err.message });
      }

      const insertMaterialSql = `
        INSERT INTO material_info_in (category, subcategory, return_quantity, return_date, invoice, amount, deposit, rent, totalDays, depositReturn) 
        VALUES ?
      `;
      db.query(insertMaterialSql, [materialValues], (err, materialResult) => {
        if (err) {
          console.error("Error inserting updated material data:", err);
          return res.status(500).json({ error: err.message });
        }

        // Retrieve inserted material IDs
        const materialIds = [...Array(materialResult.affectedRows)].map(
          (_, i) => materialResult.insertId + i
        );
        const materialInfoString = materialIds.join(",");

        // Update `in_out` table
        const updateInSql = `
          UPDATE in_out 
          SET customer = ?, material_info = ?, receiver = ?, aadharPhoto = ?, other_proof = ?, payMode = ?, deposit = ?, remark = ? 
          WHERE in_out_id = ? AND mode = 'in'
        `;
        const updateValues = [
          customer,
          materialInfoString,
          receiver,
          inAadhar,
          otherProof,
          payMode,
          deposit,
          remark,
          id,
        ];

        db.query(updateInSql, updateValues, (err) => {
          if (err) {
            console.error("Error updating in_out data:", err);
            return res.status(500).json({ error: err.message });
          }

          res.json({
            message: "In data updated successfully",
            in_out_id: id,
            material_ids: materialIds,
            inAadhar,
            otherProof,
          });
        });
      });
    });
  } catch (error) {
    console.error("Error in updateInData:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteInData = (req, res) => {
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
      db.query(`DELETE FROM in_out WHERE in_out_id = ? AND mode = 'in'`, [id], (err) => {
          if (err) {
              console.error("Error deleting in_out:", err);
              return res.status(500).json({ message: "Failed to delete in_out", error: err });
          }

          // If material_info contains multiple IDs (comma-separated), delete them
          if (materialInfoIds.includes(',')) {
              const idsArray = materialInfoIds.split(',').map(id => id.trim());

              // Construct dynamic query for multiple IDs
              const placeholders = idsArray.map(() => '?').join(',');
              const query = `DELETE FROM material_info_in WHERE insert_id IN (${placeholders})`;

              db.query(query, idsArray, (err) => {
                  if (err) {
                      console.error("Error deleting material_info_in:", err);
                      return res.status(500).json({ message: "Failed to delete material_info_in", error: err });
                  }

                  res.status(200).json({ message: "in_out and related material_info_in deleted successfully" });
              });

          } else {
              // If only a single ID exists, delete it directly
              db.query(`DELETE FROM material_info_in WHERE insert_id = ?`, [materialInfoIds], (err) => {
                  if (err) {
                      console.error("Error deleting material_info_in:", err);
                      return res.status(500).json({ message: "Failed to delete material_info_in", error: err });
                  }

                  res.status(200).json({ message: "in_out and related material_info_in deleted successfully" });
              });
          }
      });
  });
};


