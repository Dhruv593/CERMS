const express = require("express");
const {
  getCustomers,
  getCustomerById,
  addCustomer,
  updateCustomer,
  deleteCustomer
} = require("../controllers/customerController");

const upload = require("../middleware/uploadMiddleware");
const router = express.Router();

router.get("/", getCustomers);
router.get("/:id", getCustomerById);
router.post("/add", upload.fields([{ name: "aadharPhoto" }, { name: "other_proof" }]), addCustomer);
router.put("/edit/:id", upload.fields([{ name: "aadharPhoto" }, { name: "other_proof" }]), updateCustomer);
router.delete("/delete/:id", deleteCustomer);

module.exports = router;
