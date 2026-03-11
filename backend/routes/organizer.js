const express = require('express');
const router = express.Router();
const { Organizer } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register Organizer
router.post('/auth/register', async (req, res) => {
    try {
        const { name, username, password, accessLevel } = req.body;
        let organizer = await Organizer.findOne({ username });
        if (organizer) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        organizer = new Organizer({
            name,
            username,
            password: hashedPassword,
            accessLevel: accessLevel === 'superadmin' ? 'superadmin' : 'admin'
        });
        await organizer.save();
        const token = jwt.sign({ id: organizer._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
        res.json({
            token,
            organizer: {
                id: organizer._id,
                name: organizer.name,
                username: organizer.username,
                accessLevel: organizer.accessLevel
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Login Organizer
router.post('/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const organizer = await Organizer.findOne({ username });
        if (!organizer) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, organizer.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: organizer._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
        res.json({
            token,
            organizer: {
                id: organizer._id,
                name: organizer.name,
                username: organizer.username,
                accessLevel: organizer.accessLevel
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
