const express = require("express");
const { getRents, addRent, editRent, deleteRent } = require("../controllers/rentController");
const router = express.Router();

router.get("/", getRents);
router.post("/add", addRent);
router.put("/edit/:id", editRent);
router.delete("/delete/:id", deleteRent);

module.exports = router;