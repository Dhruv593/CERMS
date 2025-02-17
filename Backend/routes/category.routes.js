const express = require("express");
const { getCategories, addCategory } = require("../controllers/categoryController");
const router = express.Router();

router.get("/", getCategories);
router.post("/add", addCategory);

module.exports = router;