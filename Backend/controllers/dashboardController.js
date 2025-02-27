const db = require("../config/db");

exports.getDashboardStats = async (req, res) => {
  try {
    const categoryCount = await new Promise((resolve, reject) => {
      db.query("SELECT COUNT(*) AS count FROM category", (err, result) => {
        if (err) reject(err);
        else resolve(result[0].count);
      });
    });

    const subcategoryCount = await new Promise((resolve, reject) => {
      db.query("SELECT COUNT(*) AS count FROM subcategory", (err, result) => {
        if (err) reject(err);
        else resolve(result[0].count);
      });
    });

    // ✅ Count total quantity of stock instead of total entries
    const stockQuantity = await new Promise((resolve, reject) => {
      db.query("SELECT SUM(purchaseQuantity) AS totalQuantity FROM stockdata", (err, result) => {
        if (err) reject(err);
        else resolve(result[0].totalQuantity || 0);
      });
    });

    res.json({
      totalCategories: categoryCount,
      totalSubcategories: subcategoryCount,
      totalStock: stockQuantity, // 
    });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
