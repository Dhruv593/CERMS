<<<<<<< HEAD
const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const subcategoryController = require('../controllers/subcategoryController');

// GET all subcategories
router.get('/', subcategoryController.getSubcategories);

// POST a new subcategory with an image upload
router.post('/', upload.single('image'), subcategoryController.createSubcategory);

module.exports = router;
=======
const express = require("express");
const { getSubCategories, addSubCategory } = require("../controllers/subcategoryController");
const router = express.Router();

router.get("/", getSubCategories);
router.post("/add", addSubCategory);

module.exports = router;
>>>>>>> 709db8077004780322f76bbe9403f380aa921e6d
