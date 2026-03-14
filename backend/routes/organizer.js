const express = require('express');
const router = express.Router();
const { Organizer, Game } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register Organizer
router.post('/auth/register', async (req, res) => {
    try {
        const { name, username, password } = req.body;
        let organizer = await Organizer.findOne({ username });
        if (organizer) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        organizer = new Organizer({
            name,
            username,
            password: hashedPassword
        });
        await organizer.save();
        const token = jwt.sign({ id: organizer._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
        res.json({
            token,
            organizer: {
                id: organizer._id,
                name: organizer.name,
                username: organizer.username,
                role: organizer.role
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
                role: organizer.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Middleware to verify organizer token
const verifyOrganizerToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.organizerId = decoded.id;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

// ===================== GAMES MANAGEMENT =====================

// Get all games (organizer view)
router.get('/games', verifyOrganizerToken, async (req, res) => {
    try {
        const games = await Game.find().populate('createdBy', 'name username').sort({ createdAt: -1 });
        res.json(games);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Create a new game
router.post('/games', verifyOrganizerToken, async (req, res) => {
    try {
        const { name, type, category, icon, genders } = req.body;
        
        if (!name || !type) {
            return res.status(400).json({ message: 'Name and type are required' });
        }
        
        if (type === 'Sport' && !category) {
            return res.status(400).json({ message: 'Category is required for sports' });
        }
        
        if (type === 'Sport' && (!genders || genders.length === 0)) {
            return res.status(400).json({ message: 'Genders are required for sports' });
        }

        const game = new Game({
            name,
            type,
            category: type === 'Sport' ? category : undefined,
            icon,
            genders: type === 'Sport' ? genders : undefined,
            createdBy: req.organizerId
        });

        await game.save();
        await game.populate('createdBy', 'name username');
        
        res.status(201).json({
            message: 'Game created successfully',
            game
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update a game
router.put('/games/:id', verifyOrganizerToken, async (req, res) => {
    try {
        const { name, type, category, icon, genders, isActive } = req.body;
        const gameId = req.params.id;

        const game = await Game.findById(gameId);
        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }

        if (name) game.name = name;
        if (type) game.type = type;
        if (category) game.category = category;
        if (icon) game.icon = icon;
        if (genders) game.genders = genders;
        if (isActive !== undefined) game.isActive = isActive;
        
        game.updatedAt = new Date();
        await game.save();
        await game.populate('createdBy', 'name username');

        res.json({
            message: 'Game updated successfully',
            game
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Delete a game
router.delete('/games/:id', verifyOrganizerToken, async (req, res) => {
    try {
        const gameId = req.params.id;
        const game = await Game.findById(gameId);
        
        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }

        await Game.findByIdAndDelete(gameId);
        
        res.json({
            message: 'Game deleted successfully'
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Add penalty points to a club
router.post('/penalty', verifyOrganizerToken, async (req, res) => {
    try {
        const { clubId, reason, points } = req.body;
        
        if (!clubId || !reason || points === undefined) {
            return res.status(400).json({ message: 'Club ID, reason, and points are required' });
        }

        const club = await Club.findById(clubId);
        if (!club) {
            return res.status(404).json({ message: 'Club not found' });
        }

        // Update penalty points
        club.penaltyPoints += points;
        
        // Add to penalty breakdown
        club.penaltyBreakdown.push({
            reason,
            points,
            date: new Date(),
            updatedBy: req.organizer.name
        });

        await club.save();

        // Log the penalty update
        const scoreLog = new ScoreLog({
            club: club.name,
            eventType: 'penalty',
            eventName: reason,
            pointsAdded: points,
            updatedBy: req.organizer.name
        });
        await scoreLog.save();

        res.json({
            message: 'Penalty points updated successfully',
            club: {
                id: club._id,
                name: club.name,
                penaltyPoints: club.penaltyPoints,
                totalPoints: club.totalPoints
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
