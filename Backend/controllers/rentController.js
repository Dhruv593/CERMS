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

    // First, get the category ID from the category table
    const getCategoryIdQuery = "SELECT category FROM category WHERE category = ?";

    db.query(getCategoryIdQuery, [category], (err, categoryResults) => {
        if (err) {
            console.error("Error fetching category:", err);
            return res.status(500).json({ error: err.message });
        }

        if (categoryResults.length === 0) {
            return res.status(400).json({ error: "Invalid category" });
        }

        const category = categoryResults[0].category;

        // Second, get the subcategory ID from the subcategory table based on the category ID and subcategory name
        const getSubcategoryIdQuery = "SELECT subcategory FROM subcategory WHERE subcategory = ? AND category = ?";

        db.query(getSubcategoryIdQuery, [subcategory, categoryId], (err, subcategoryResults) => {
            if (err) {
                console.error("Error fetching subcategory ID:", err);
                return res.status(500).json({ error: err.message });
            }

            if (subcategoryResults.length === 0) {
                return res.status(400).json({ error: "Invalid subcategory for this category" });
            }

            const subcategory = subcategoryResults[0].subcategory;

            // Finally, insert the rent data using the category ID and subcategory ID
            const insertRentQuery = "INSERT INTO rent (category, subcategory, rent) VALUES (?, ?, ?)";

            db.query(insertRentQuery, [category, subcategory, rent], (err, result) => {
                if (err) {
                    console.error("Error adding rent:", err);
                    return res.status(500).json({ error: err.message });
                }

                res.json({ id: result.insertId, category, subcategory, rent });
            });
        });
    });
};
