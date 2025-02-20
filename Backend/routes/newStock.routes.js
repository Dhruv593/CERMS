const express = require("express");
const { addStock, getStockData } = require("../controllers/newStockcontroller");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// For multiple file uploads, configure fields using multer’s fields() method.
// Here we expect two file fields: stockPhoto and billPhoto.
const cpUpload = upload.fields([
  { name: "stockPhoto", maxCount: 1 },
  { name: "billPhoto", maxCount: 1 }
]);

router.get("/", getStockData);
router.post("/add", cpUpload, addStock);

// You can also add a GET route to retrieve stock data if needed
// router.get("/", getStockData);

module.exports = router;
