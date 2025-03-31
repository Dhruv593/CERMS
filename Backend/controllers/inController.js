const db = require("../config/db");


exports.getInData = (req, res) => {
    
}

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
      m.depositReturn || 0,
      m.rent || 0,
    ]);

    const materialSql = `
      INSERT INTO material_info_in (category, subcategory, return_quantity, return_date, invoice, total_amount, deposit_return, rent) 
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

}

exports.deleteInData = (req, res) => {

}