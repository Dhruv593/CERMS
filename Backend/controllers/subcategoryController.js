const db = require("../config/db");

exports.getSubcategories = (req, res) => {
  const query = "SELECT * FROM subcategory";
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};

exports.addSubcategory = (req, res) => {
  console.log("Request Body:", req.body);
  console.log("Uploaded File:", req.file);

  const { category, subcategory, description } = req.body;
  const image_path = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const sql = `
      INSERT INTO subcategory (category, subcategory, description, image_path) 
      VALUES ((SELECT id FROM category WHERE category = ?), ?, ?, ?);
    `;

    db.query(
      sql,
      [category, subcategory, description, image_path],
      (err, result) => {
        if (err) {
          console.error("Database Error:", err);
          return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Subcategory added successfully" });
      }
    );
  } catch (error) {
    console.error("Error adding subcategory:", error);
    res.status(500).json({ error: "Error adding subcategory" });
  }
};






// exports.addSubcategory = (req, res) => {
//   const { category, subcategory, description } = req.body;
//   const image_path = req.file ? `/uploads/${req.file.filename}` : null;

//   try {
//     db.query(
//       "INSERT INTO subcategory (category, subcategory, description, image_path) VALUES (?, ?, ?, ?)",
//       [category, subcategory, description, image_path]
//     );

//     res.json({ message: "Subcategory added successfully" });
//   } catch (error) {
//     res.status(500).json({ error: "Error adding subcategory" });
//   }
// };
