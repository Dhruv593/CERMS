const express = require("express");
const { getDeposits, addDeposit, editDeposit, deleteDeposit } = require("../controllers/depositController");
const router = express.Router();

router.get("/", getDeposits);
router.post("/add", addDeposit);
router.put("/edit/:id", editDeposit);
router.delete("/delete/:id", deleteDeposit);

module.exports = router;


