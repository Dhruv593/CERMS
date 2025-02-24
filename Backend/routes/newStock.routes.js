const express = require("express");
const { addStock, getStockData, editStock, deleteStock } = require("../controllers/newStockcontroller");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Configure multer to handle multiple file fields.
const cpUpload = upload.fields([
  { name: "stockPhoto", maxCount: 1 },
  { name: "billPhoto", maxCount: 1 }
]);

// Get all stock data
router.get("/", getStockData);

// Add new stock entry
router.post("/add", cpUpload, addStock);

// Edit an existing stock entry
router.put("/edit/:id", cpUpload, editStock);

// Delete a stock entry
router.delete("/delete/:id", deleteStock);

module.exports = router;




// const express = require("express");
// const { addStock, getStockData } = require("../controllers/newStockcontroller");
// const upload = require("../middleware/uploadMiddleware");

// const router = express.Router();

// // For multiple file uploads, configure fields using multer’s fields() method.
// // Here we expect two file fields: stockPhoto and billPhoto.
// const cpUpload = upload.fields([
//   { name: "stockPhoto", maxCount: 1 },
//   { name: "billPhoto", maxCount: 1 }
// ]);

// router.get("/", getStockData);
// router.post("/add", cpUpload, addStock);

// // You can also add a GET route to retrieve stock data if needed
// // router.get("/", getStockData);

// module.exports = router;