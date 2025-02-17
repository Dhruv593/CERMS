const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const dotenv = require('dotenv');

dotenv.config();
const jwtKey = process.env.JWT_SECRET;

// Register User
const registerUser = async (req, res) => {
    const { first_name, last_name, email, username, password, user_contact, user_role } = req.body;

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const query = 'INSERT INTO user_registration (first_name, last_name, email, username, password, user_contact, user_role) VALUES (?, ?, ?, ?, ?, ?, ?)';
        db.query(query, [first_name, last_name, email, username, hashedPassword, user_contact, user_role], (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Database error' });
            }
            res.status(201).json({ message: 'User registered successfully' });
        });
    } catch (error) {
        res.status(500).json({ error: 'Error registering user' });
    }
};

// Login User
const loginUser = (req, res) => {
    const { username, password, user_role } = req.body;
    console.log('Login attempt:', { username, user_role }); // Log input

    if (![1, 2, 3].includes(Number(user_role))) {
        console.log('Invalid user role:', user_role); // Log invalid role
        return res.status(400).json({ error: 'Invalid user role' });
    }

    console.log('Querying database...'); // Log before query
    db.query('SELECT * FROM user_registration WHERE username = ? AND user_role = ?', [username, user_role], async (err, results) => {
        if (err) {
            console.error('Database error:', err); // Log full error
            return res.status(500).json({ error: 'Database error' });
        }
        console.log('Query results:', results); // Log results

        if (results.length === 0) {
            console.log('User not found:', { username, user_role }); // Log user not found
            return res.status(401).json({ error: 'Invalid username, role, or password' });
        }

        const user = results[0];

        console.log('Comparing passwords...'); // Log before comparison
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            console.log('Password mismatch'); // Log password mismatch
            return res.status(401).json({ error: 'Invalid username, role, or password' });
        }

        const token = jwt.sign({ id: user.userid, role: user.user_role }, process.env.jwtKey, { expiresIn: '1h' });

        console.log('Login successful'); // Log success
        res.json({ message: 'Login successful', token, role: user.user_role });
    });
};


// Protected Route Example
const protectedRoute = (req, res) => {
    res.json({ message: 'You have accessed a protected route', user: req.user });
};

module.exports = { registerUser, loginUser, protectedRoute };
