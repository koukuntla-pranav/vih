// Coordinator Login
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const { User } = require('../models');
const bcrypt = require('bcryptjs');

// Middleware to verify admin/superadmin JWT for protected routes
function verifyAdminToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ message: 'No token provided' });
    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });
    require('jsonwebtoken').verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.userId = decoded.id;
        next();
    });
}

// Register Coordinator (by core/admin only)
router.post('/coordinators/register', verifyAdminToken, async (req, res) => {
    try {
        const { name, username, password, email, clubNumber, year } = req.body;
        if (!name || !username || !password || !clubNumber || !year) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        const clubCoordinators = await User.find({ clubNumber });
        if (clubCoordinators.length >= 4) {
            return res.status(400).json({ message: 'This club already has 4 coordinators' });
        }
        const yearCount = clubCoordinators.filter(c => c.year === Number(year)).length;
        if (yearCount >= 2) {
            return res.status(400).json({ message: `This club already has 2 coordinators from year ${year}` });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        user = new User({ name, username, password: hashedPassword, email, clubNumber, year });
        await user.save();
        res.json({ message: 'Coordinator registered successfully', user: { id: user._id, name: user.name, username: user.username, clubNumber, year } });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.post('/coordinators/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
        res.json({
            token,
            coordinator: {
                id: user._id,
                name: user.name,
                username: user.username,
                clubNumber: user.clubNumber,
                year: user.year
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
