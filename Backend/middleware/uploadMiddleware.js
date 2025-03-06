const multer = require("multer");
const path = require("path");
const fs = require("fs");

const subcategoryDir = path.join(__dirname, "../uploads/subcategories");
const stockDir = path.join(__dirname, "../uploads/stock/stock");
const billDir = path.join(__dirname, "../uploads/stock/bill");
const aadharDir = path.join(__dirname, "../uploads/customer/aadhar");
const otherDir = path.join(__dirname, "../uploads/customer/other");

if (!fs.existsSync(subcategoryDir)) {
  fs.mkdirSync(subcategoryDir, { recursive: true });
}
if (!fs.existsSync(stockDir)) {
  fs.mkdirSync(stockDir, { recursive: true });
}
if (!fs.existsSync(billDir)) {
  fs.mkdirSync(billDir, { recursive: true });
}
if (!fs.existsSync(aadharDir)) {
  fs.mkdirSync(aadharDir, { recursive: true });
}
if (!fs.existsSync(otherDir)) {
  fs.mkdirSync(otherDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "stockPhoto") {
      cb(null, stockDir);
    } else if (file.fieldname === "billPhoto") {
      cb(null, billDir);
    } else if (file.fieldname === "image_path") {
      cb(null, subcategoryDir);
    } else if (file.fieldname === "aadharPhoto") {
      cb(null, aadharDir);
    } else if (file.fieldname === "other_proof") {
      cb(null, otherDir);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + file.originalname;
    cb(null, uniqueSuffix);
  },
});

const upload = multer({ storage });

module.exports = upload;
