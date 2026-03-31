var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var User = require('../models/User');
var { authMiddleware } = require('../middleware/auth');

// POST /api/auth/register
router.post('/register', async function(req, res) {
    try {
        var { name, email, password } = req.body;

        // basic validation
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        // check if email already exists
        var existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // create new user
        var user = new User({
            name: name,
            email: email,
            password: password
        });

        await user.save();

        // generate token
        var token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'Registration successful',
            token: token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                hasPaid: user.hasPaid
            }
        });

    } catch (err) {
        console.log('Register error:', err.message);
        res.status(500).json({ message: 'Server error, please try again' });
    }
});

// POST /api/auth/login
router.post('/login', async function(req, res) {
    try {
        var { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // find user
        var user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // check password
        var isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // generate token
        var token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            token: token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                hasPaid: user.hasPaid
            }
        });

    } catch (err) {
        console.log('Login error:', err.message);
        res.status(500).json({ message: 'Server error, please try again' });
    }
});

// GET /api/auth/me - get current user info
router.get('/me', authMiddleware, async function(req, res) {
    try {
        var user = await User.findById(req.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ user: user });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
