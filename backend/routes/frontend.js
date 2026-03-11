const express = require('express');
const path = require('path');
const router = express.Router();

// Clean frontend routes (extensionless URLs)
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../index.html'));
});

router.get('/clubs', (req, res) => {
    res.sendFile(path.join(__dirname, '../../src/clubs.html'));
});

router.get('/club-details', (req, res) => {
    res.sendFile(path.join(__dirname, '../../src/club-details.html'));
});

router.get('/leadboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../../src/leadboard.html'));
});

router.get('/team', (req, res) => {
    res.sendFile(path.join(__dirname, '../../src/team.html'));
});

router.get('/sponsors', (req, res) => {
    res.sendFile(path.join(__dirname, '../../src/sponsors.html'));
});

router.get('/organizer-dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../../src/organizer-dashboard.html'));
});

router.get('/coordinator-dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../../src/coordinator-dashboard.html'));
});

// Fallback for frontend routing (if any)
router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../index.html'));
});

module.exports = router;
