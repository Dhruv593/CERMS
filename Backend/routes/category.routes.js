const express = require("express");
const { getCategories, addCategory, editCategory, deleteCategory } = require("../controllers/categoryController");
const router = express.Router();

router.get("/", getCategories);
router.post("/add", addCategory);
router.put("/edit/:id", editCategory);
router.delete("/delete/:id", deleteCategory);

module.exports = router;