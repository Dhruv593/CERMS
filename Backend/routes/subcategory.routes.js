const express = require("express");
const { getSubcategories, addSubcategory } = require("../controllers/subcategoryController");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Define routes
router.get("/", getSubcategories);
router.post("/add", upload.single("image"), addSubcategory);

module.exports = router;
