const express = require("express");
const { getSubCategories, addSubCategory } = require("../controllers/subcategoryController");
const router = express.Router();

router.get("/", getSubCategories);
router.post("/add", addSubCategory);

module.exports = router;