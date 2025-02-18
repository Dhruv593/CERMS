const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const subcategoryController = require('../controllers/subcategoryController');

// GET all subcategories
router.get('/', subcategoryController.getSubcategories);

// POST a new subcategory with an image upload
router.post('/', upload.single('image'), subcategoryController.createSubcategory);

module.exports = router;
