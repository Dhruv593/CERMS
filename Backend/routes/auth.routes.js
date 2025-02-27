const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/login", authController.login);

module.exports = router;


// const express = require('express');
// const { registerUser, loginUser, protectedRoute } = require('../controllers/authController');
// const { authenticateToken } = require('../middleware/authMiddleware');

// const router = express.Router();

// router.post('/register', registerUser);
// router.post('/login', loginUser);
// router.get('/protected', authenticateToken, protectedRoute);

// module.exports = router;
