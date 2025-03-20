const express = require("express");
const { addOutData, getOutData, editOutdata, deleteOutData } = require("../controllers/outController");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Configure multer to handle multiple file fields.
const cpUpload = upload.fields([
    { name: "aadharPhoto", maxCount: 1 },
    { name: "other_proof", maxCount: 1 }
  ]);
  
  // Get all stock data
  router.get("/", getOutData);
  
  // Add new stock entry
  router.post("/add", cpUpload, addOutData);
  
  // Edit an existing stock entry
//   router.put("/edit/:id", cpUpload, editOutdata);
  
  // Delete a stock entry
//   router.delete("/delete/:id", deleteOutData);
  
  module.exports = router;