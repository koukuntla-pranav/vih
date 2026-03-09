const mongoose = require('mongoose');

// Club Schema
const clubSchema = new mongoose.Schema({
    name: { type: String, required: true },
    theme: { type: String, required: true },
    color: { type: String, required: true },
    totalPoints: { type: Number, default: 0 },
    sportsPoints: { type: Number, default: 0 },
    culturePoints: { type: Number, default: 0 },

    // Individual Sport Scores
    sportBreakdown: [{
        sport: { type: String, required: true },
        gender: { type: String, enum: ['male', 'female', 'mixed', 'neutral'], required: true },
        points: { type: Number, default: 0 }
    }],

    // Individual Culture Event Scores
    cultureBreakdown: [{
        event: { type: String, required: true },
        points: { type: Number, default: 0 }
    }],

    createdAt: { type: Date, default: Date.now }
});

// Sport Event Schema
const sportSchema = new mongoose.Schema({
    name: { type: String, required: true },
    icon: { type: String },
    standings: [{
        rank: Number,
        club: String,
        points: Number
    }],
    createdAt: { type: Date, default: Date.now }
});

// Culture Event Schema
const cultureSchema = new mongoose.Schema({
    name: { type: String, required: true },
    icon: { type: String },
    standings: [{
        rank: Number,
        club: String,
        points: Number
    }],
    createdAt: { type: Date, default: Date.now }
});

// Organizer Schema
const organizerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'organizer' },
    canUpdateScores: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

// Score Update Log Schema
const scoreLogSchema = new mongoose.Schema({
    club: { type: String, required: true },
    eventType: { type: String, enum: ['sports', 'culture'], required: true },
    eventName: { type: String, required: true },
    gender: { type: String, enum: ['male', 'female', 'mixed', 'neutral'] }, // Optional, only for sports
    pointsAdded: { type: Number, required: true },
    updatedBy: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

module.exports = {
    Club: mongoose.model('Club', clubSchema),
    Sport: mongoose.model('Sport', sportSchema),
    Culture: mongoose.model('Culture', cultureSchema),
    Organizer: mongoose.model('Organizer', organizerSchema),
    ScoreLog: mongoose.model('ScoreLog', scoreLogSchema)
};
