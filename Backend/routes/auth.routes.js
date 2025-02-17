const express = require('express');
const { registerUser, loginUser, protectedRoute } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/protected', authenticateToken, protectedRoute);

module.exports = router;
