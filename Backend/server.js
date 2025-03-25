const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth.routes');
const categoryRoutes = require('./routes/category.routes');
const subcategoryRoutes = require('./routes/subcategory.routes');
const rentRoutes = require('./routes/rent.routes');
const newStockRoutes = require('./routes/newStock.routes');
const depositRoutes = require('./routes/deposit.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const customerRoutes = require('./routes/customer.routes');
const outDataRoutes = require('./routes/out.routes');
const db = require('./config/db');
const path = require('path');
  
// const subcategoryRoutes = require('./routes/subcategory.routes');

dotenv.config();

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL, 
  process.env.LOCALHOST_URL,
  "http://localhost:3000", 
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
  }));
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
// app.use("/uploads", express.static("uploads"));
app.use("/api/subcategories", subcategoryRoutes);
app.use("/api/rents", rentRoutes);
app.use("/api/stockdata",newStockRoutes);
app.use("/api/deposits", depositRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/outdata", outDataRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
