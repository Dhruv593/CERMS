const db = require("../config/db");

exports.getRents = (req, res) => {
    const query = "SELECT * FROM rent";
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
};

exports.addRent = (req, res) => {
    const { category, subcategory, rent } = req.body;

    const getCategoryIdQuery = "SELECT category FROM category WHERE category = ?";

    db.query(getCategoryIdQuery, [category], (err, categoryResults) => {
        if (err) {
            console.error("Error fetching category:", err);
            return res.status(500).json({ error: err.message });
        }

        if (categoryResults.length === 0) {
            return res.status(400).json({ error: "Invalid category" });
        }

        const selectedCategory = categoryResults[0].category; // Renamed variable to avoid conflict

        const getSubcategoryIdQuery = "SELECT subcategory FROM subcategory WHERE subcategory = ? AND category = ?";

        db.query(getSubcategoryIdQuery, [subcategory, selectedCategory], (err, subcategoryResults) => {
            if (err) {
                console.error("Error fetching subcategory ID:", err);
                return res.status(500).json({ error: err.message });
            }

            const insertRentQuery = "INSERT INTO rent (category, subcategory, rent) VALUES (?, ?, ?)";

            db.query(insertRentQuery, [selectedCategory, subcategory, rent], (err, result) => {
                if (err) {
                    console.error("Error adding rent:", err);
                    return res.status(500).json({ error: err.message });
                }

                res.json({ id: result.insertId, category: selectedCategory, subcategory, rent });
            });
        });
    });
};

exports.editRent = (req, res) => {
    const { id } = req.params;
    const { category, subcategory, rent } = req.body;

    if (!category || !subcategory || !rent) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const updateRentQuery = "UPDATE rent SET category = ?, subcategory = ?, rent = ? WHERE id = ?";
    db.query(updateRentQuery, [category, subcategory, rent, id], (err, result) => {
        if (err) {
            console.error("Error updating rent:", err);
            return res.status(500).json({ error: err.message });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Rent entry not found" });
        }

        res.json({ message: "Rent updated successfully" });
    });
};

exports.deleteRent = (req, res) => {
    const { id } = req.params;

    const deleteRentQuery = "DELETE FROM rent WHERE id = ?";
    db.query(deleteRentQuery, [id], (err, result) => {
        if (err) {
            console.error("Error deleting rent:", err);
            return res.status(500).json({ error: err.message });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Rent entry not found" });
        }

        res.json({ message: "Rent deleted successfully" });
    });
};
