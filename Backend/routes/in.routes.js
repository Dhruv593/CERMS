const express = require("express");
const { addInData, getInData, getMaterialInfoById, updateInData, deleteInData } = require("../controllers/inController");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Configure multer to handle multiple file fields.
const cpUpload = upload.fields([
    { name: "aadharPhoto", maxCount: 1 },
    { name: "other_proof", maxCount: 1 }
  ]);
  
//   router.get("/", getInData);
  
  router.post("/add", cpUpload, addInData);
  
//   router.get("/materialInfo/:id", getMaterialInfoById);
  
//   router.put("/update/:id", cpUpload, updateInData);
  
//   router.delete("/delete/:id", deleteInData);
  
  module.exports = router;