const mongoose = require('mongoose');
require('dotenv').config();
const { Club, ScoreLog } = require('./models');

const sportsData = [
    // Outdoors
    { sport: 'Cricket', gender: 'male', points: 0 }, { sport: 'Cricket', gender: 'female', points: 0 },
    { sport: 'Football', gender: 'neutral', points: 0 },
    { sport: 'Kho-Kho', gender: 'male', points: 0 }, { sport: 'Kho-Kho', gender: 'female', points: 0 },
    { sport: 'Throw Ball', gender: 'male', points: 0 },
    { sport: 'Basketball', gender: 'male', points: 0 }, { sport: 'Basketball', gender: 'female', points: 0 },
    { sport: 'Volleyball', gender: 'male', points: 0 }, { sport: 'Volleyball', gender: 'female', points: 0 },
    { sport: 'Handball', gender: 'male', points: 0 }, { sport: 'Handball', gender: 'female', points: 0 },
    { sport: 'Box Cricket', gender: 'neutral', points: 0 },
    { sport: 'Tug of War', gender: 'male', points: 0 }, { sport: 'Tug of War', gender: 'female', points: 0 },
    { sport: 'Swimming', gender: 'male', points: 0 }, { sport: 'Swimming', gender: 'female', points: 0 },
    { sport: 'Vihang Letters', gender: 'neutral', points: 0 },
    { sport: 'Inaugural March Past', gender: 'neutral', points: 0 },
    // Indoors
    { sport: 'Badminton', gender: 'male', points: 0 }, { sport: 'Badminton', gender: 'female', points: 0 }, { sport: 'Badminton', gender: 'mixed', points: 0 },
    { sport: 'Table Tennis', gender: 'male', points: 0 }, { sport: 'Table Tennis', gender: 'female', points: 0 },
    { sport: 'Carrom', gender: 'male', points: 0 }, { sport: 'Carrom', gender: 'female', points: 0 },
    { sport: 'Chess', gender: 'male', points: 0 }, { sport: 'Chess', gender: 'female', points: 0 },
    { sport: 'BGMI', gender: 'neutral', points: 0 },
    { sport: 'Valorant', gender: 'neutral', points: 0 },
    { sport: 'Powerlifting', gender: 'male', points: 0 },
    { sport: 'Yoga', gender: 'neutral', points: 0 },
    // Athletics
    { sport: 'Discus Throw', gender: 'male', points: 0 }, { sport: 'Discus Throw', gender: 'female', points: 0 },
    { sport: 'Javelin Throw', gender: 'male', points: 0 }, { sport: 'Javelin Throw', gender: 'female', points: 0 },
    { sport: 'Marathon', gender: 'male', points: 0 }, { sport: 'Marathon', gender: 'female', points: 0 },
    { sport: 'Relay 4x100m', gender: 'female', points: 0 },
    { sport: 'Shot-Put', gender: 'male', points: 0 }, { sport: 'Shot-Put', gender: 'female', points: 0 },
    { sport: 'Slow Cycling', gender: 'male', points: 0 }, { sport: 'Slow Cycling', gender: 'female', points: 0 },
    { sport: 'Sprint 100m', gender: 'male', points: 0 }, { sport: 'Sprint 100m', gender: 'female', points: 0 },
    { sport: 'Sprint 200m', gender: 'male', points: 0 }, { sport: 'Sprint 200m', gender: 'female', points: 0 },
    { sport: 'Sprint 400m', gender: 'male', points: 0 }, { sport: 'Sprint 400m', gender: 'female', points: 0 },
    { sport: 'Sprint Triathlon Relay', gender: 'neutral', points: 0 }
];

const cultureData = [
    { event: 'Debate (English & Hindi)', points: 0 }, { event: 'Poetry (Hindi & English)', points: 0 }, { event: 'Quiz', points: 0 },
    { event: 'Pic of the Day', points: 0 }, { event: 'Reel of the Day', points: 0 }, { event: 'Meme of the Day', points: 0 },
    { event: 'Pic of Vihang', points: 0 }, { event: 'Stand-Up Comedy', points: 0 }, { event: 'Flash Mob', points: 0 },
    { event: 'Fashion Show', points: 0 }, { event: 'Face Painting', points: 0 }, { event: 'Group Dance', points: 0 },
    { event: 'Solo Dance', points: 0 }, { event: 'Dance Duo', points: 0 }, { event: 'Poster Making', points: 0 },
    { event: 'Group Singing', points: 0 }, { event: 'Solo Singing', points: 0 }, { event: 'Duet Singing', points: 0 },
    { event: 'Instrumental', points: 0 }, { event: 'Short Film', points: 0 }, { event: 'Rangoli', points: 0 }
];

const clubsToInsert = [
    { name: 'Agni', theme: 'Fire', color: '#FF6B6B', sportBreakdown: sportsData, cultureBreakdown: cultureData },
    { name: 'Jala', theme: 'Water', color: '#4ECDC4', sportBreakdown: sportsData, cultureBreakdown: cultureData },
    { name: 'Prithvi', theme: 'Earth', color: '#8B6F47', sportBreakdown: sportsData, cultureBreakdown: cultureData },
    { name: 'Vayu', theme: 'Air', color: '#87CEEB', sportBreakdown: sportsData, cultureBreakdown: cultureData },
    { name: 'Akasha', theme: 'Space', color: '#483D8B', sportBreakdown: sportsData, cultureBreakdown: cultureData }
];

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB');
        await Club.deleteMany({});
        await ScoreLog.deleteMany({});
        console.log('Cleared existing clubs and score logs');

        await Club.insertMany(clubsToInsert);
        console.log('Successfully seeded all clubs with new Vihang 2025 events!');
        mongoose.disconnect();
    })
    .catch(err => {
        console.error('Error connecting to database:', err);
        mongoose.disconnect();
    });
