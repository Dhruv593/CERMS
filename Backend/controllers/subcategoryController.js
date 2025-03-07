const db = require("../config/db");
const upload = require("../middleware/uploadMiddleware");
const fs = require("fs");

// Get all subcategories
exports.getSubcategories = (req, res) => {
  const query = "SELECT * FROM subcategory ORDER BY id DESC";
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};

// Get subcategories by category
exports.getSubcategoriesByCategory = (req, res) => {
  const category = req.params.category;
  if (!category) {
    return res.status(400).json({ error: "Category is required" });
  }

  const query = "SELECT subcategory FROM subcategory WHERE category = ?";
  db.query(query, [category], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};

// Add subcategory with image upload
exports.addSubcategory = (req, res) => {
  console.log("Request File Data:", req.file); // Debugging
  console.log("Request Body Data:", req.body);

  const { category, subcategory, description } = req.body;
  const image_path = req.file ? `uploads/subcategories/${req.file.filename}` : null;

  if (!category || !subcategory || !description) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const query = "INSERT INTO subcategory (category, subcategory, description, image_path) VALUES (?, ?, ?, ?)";
  const values = [category, subcategory, description, image_path];

  db.query(query, values, (error, results) => {
    if (error) {
      console.error("Database Insert Error:", error);
      if (req.file) fs.unlinkSync(req.file.path); // Remove file if DB insert fails
      return res.status(500).json({ error: "Error adding subcategory" });
    }

    res.json({
      message: "Subcategory added successfully",
      id: results.insertId,
      imagePath: image_path,
    });
  });
};


// Update subcategory
exports.updateSubcategory = (req, res) => {
  console.log(req.body);
  const { category, subcategory, description } = req.body;
  const id = req.params.id;
  const newImagePath = req.file ? `uploads/subcategories/${req.file.filename}` : null;

  if (!category || !subcategory || !description) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Fetch existing image path if no new image is provided
  const fetchQuery = "SELECT image_path FROM subcategory WHERE id = ?";
  
  db.query(fetchQuery, [id], (fetchError, fetchResults) => {
    if (fetchError) {
      console.error("Error fetching existing image path:", fetchError);
      return res.status(500).json({ error: "Error updating subcategory" });
    }

    const oldImagePath = fetchResults.length > 0 ? fetchResults[0].image_path : null;
    const imagePath = newImagePath || oldImagePath; // Use old image if new one isn't provided

    const updateQuery = "UPDATE subcategory SET category = ?, subcategory = ?, description = ?, image_path = ? WHERE id = ?";
    const values = [category, subcategory, description, imagePath, id];

    db.query(updateQuery, values, (updateError, updateResults) => {
      if (updateError) {
        console.error("Error updating subcategory:", updateError);
        if (newImagePath) {
          fs.unlinkSync(newImagePath); // Delete uploaded file if update fails
        }
        return res.status(500).json({ error: "Error updating subcategory" });
      }

      // If a new image was uploaded, delete the old one
      if (newImagePath && oldImagePath) {
        fs.unlink(oldImagePath, (unlinkError) => {
          if (unlinkError) {
            console.error("Error deleting old image:", unlinkError);
          }
        });
      }

      res.json({
        message: "Subcategory updated successfully",
        imagePath,
      });
    });
  });
};

// Delete subcategory
exports.deleteSubcategory = (req, res) => {
  const id = req.params.id;

  const query = "DELETE FROM subcategory WHERE id = ?";
  db.query(query, [id], (error, results) => {
    if (error) {
      return res.status(500).json({ error: "Error deleting subcategory" });
    }

    res.json({
      message: "Subcategory deleted successfully",
    });
  });
};

