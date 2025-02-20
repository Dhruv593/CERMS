const express = require("express");
const { getRents, addRent } = require("../controllers/rentController");
const router = express.Router();

router.get("/", getRents);
router.post("/add", addRent);

module.exports = router;