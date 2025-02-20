const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth.routes');
const categoryRoutes = require('./routes/category.routes');
const subcategoryRoutes = require('./routes/subcategory.routes');
const newStockRoutes = require('./routes/newStock.routes');
const db = require('./config/db');
const path = require('path');
  
// const subcategoryRoutes = require('./routes/subcategory.routes');

dotenv.config();

const app = express();
app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true
  }));
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
// app.use("/uploads", express.static("uploads"));
app.use("/api/subcategories", subcategoryRoutes);
app.use("/api/stockdata",newStockRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
