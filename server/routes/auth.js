const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Staff = require('../models/Staff');

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const staff = await Staff.findOne({ username });

        if (!staff || !(await staff.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const token = jwt.sign(
            { id: staff._id, username: staff.username, name: staff.name },
            process.env.JWT_SECRET || 'secretkey',
            { expiresIn: '1d' }
        );

        res.json({ token, staff: { username: staff.username, name: staff.name } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/auth/me (Verify token)
router.get('/me', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
        const staff = await Staff.findById(decoded.id).select('-password');
        if (!staff) return res.status(404).json({ message: 'User not found' });
        res.json(staff);
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
});

module.exports = router;
