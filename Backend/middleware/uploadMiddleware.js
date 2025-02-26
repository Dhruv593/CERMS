const multer = require("multer");
const path = require("path");
const fs = require("fs");

const subcategoryDir = path.join(__dirname, "../uploads/subcategories");
const stockDir = path.join(__dirname, "../uploads/stock/stock");
const billDir = path.join(__dirname, "../uploads/stock/bill");

if (!fs.existsSync(subcategoryDir)) {
  fs.mkdirSync(subcategoryDir, { recursive: true });
}
if (!fs.existsSync(stockDir)) {
  fs.mkdirSync(stockDir, { recursive: true });
}
if (!fs.existsSync(billDir)) {
  fs.mkdirSync(billDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "stockPhoto") {
      cb(null, stockDir);
    } else if (file.fieldname === "billPhoto") {
      cb(null, billDir);
    } else if (file.fieldname === "image_path") {
      cb(null, subcategoryDir);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + file.originalname;
    cb(null, uniqueSuffix);
  },
});

const upload = multer({ storage });

module.exports = upload;
