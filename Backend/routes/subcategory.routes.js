const express = require("express");
const {
  getSubcategories,
  addSubcategory,
  getSubcategoriesByCategory,
  updateSubcategory,
  deleteSubcategory
} = require("../controllers/subcategoryController");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Define routes
router.get("/", getSubcategories);
router.get("/:category", getSubcategoriesByCategory);
router.post("/add", upload.single("image_path"), addSubcategory);
router.put("/:id", upload.single("image_path"), updateSubcategory);
router.delete("/:id", deleteSubcategory);

module.exports = router;


// const express = require("express");
// const { getSubcategories, addSubcategory, getSubcategoriesByCategory } = require("../controllers/subcategoryController");
// const upload = require("../middleware/uploadMiddleware");

// const router = express.Router();

// // Define routes
// router.get("/", getSubcategories);
// router.get("/:category", getSubcategoriesByCategory);
// router.post("/add", upload.single("image_path"), addSubcategory);

// module.exports = router;
