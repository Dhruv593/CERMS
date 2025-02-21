const express = require("express");
const { getDeposits, addDeposit } = require("../controllers/depositController");
const router = express.Router();

router.get("/", getDeposits);
router.post("/add", addDeposit);

module.exports = router;


