const db = require("../config/db");

// Get Deposits with Category and Subcategory Names
exports.getDeposits = (req, res) => {
    const sql = 
        "SELECT * FROM deposit"
    ;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};

// Add Deposit
exports.addDeposit = (req, res) => {
    const { category, subcategory, deposit } = req.body;

    if (!category || !subcategory || !deposit) {
        return res.status(400).json({ error: "All fields are required" }); // ✅ Ensure all fields exist
    }

    const getCategoryQuery = `SELECT category FROM category WHERE category = ?`;

    db.query(getCategoryQuery, [category], (err, categoryResult) => {
        if (err || categoryResult.length === 0) {
            return res.status(400).json({ error: "Invalid category" });
        }

        const getSubcategoryQuery = `SELECT subcategory FROM subcategory WHERE subcategory = ?`;

        db.query(getSubcategoryQuery, [subcategory], (err, subcategoryResult) => {
            if (err || subcategoryResult.length === 0) {
                return res.status(400).json({ error: "Invalid subcategory" });
            }

            const insertQuery = `INSERT INTO deposit (category, subcategory, deposit) VALUES (?, ?, ?)`;

            db.query(insertQuery, [category, subcategory, deposit], (err, result) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                res.json({ message: "Deposit added successfully", id: result.insertId });
            });
        });
    });
};


exports.editDeposit = (req, res) => {
    const { id } = req.params;
    const { category, subcategory, deposit } = req.body;

    if (!category || !subcategory || !deposit) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const updateDepositQuery = "UPDATE deposit SET category = ?, subcategory = ?, deposit = ? WHERE id = ?";
    db.query(updateDepositQuery, [category, subcategory, deposit, id], (err, result) => {
        if (err) {
            console.error("Error updating deposit:", err);
            return res.status(500).json({ error: err.message });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Deposit entry not found" });
        }

        res.json({ message: "Deposit updated successfully" });
    });
};

exports.deleteDeposit = (req, res) => {
    const { id } = req.params;

    const deleteDepositQuery = "DELETE FROM deposit WHERE id = ?";
    db.query(deleteDepositQuery, [id], (err, result) => {
        if (err) {
            console.error("Error deleting deposit:", err);
            return res.status(500).json({ error: err.message });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Deposit entry not found" });
        }

        res.json({ message: "Deposit deleted successfully" });
    });
};