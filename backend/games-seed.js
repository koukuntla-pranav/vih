const mongoose = require('mongoose');
const { Game, Organizer } = require('./models');
require('dotenv').config();

// Sports data from frontend
const sportsData = [
  // Outdoor
  { name: "Cricket", icon: "🏏", type: "Sport", category: "Outdoor", genders: ["male", "female"] },
  { name: "Football", icon: "⚽", type: "Sport", category: "Outdoor", genders: ["male"] },
  { name: "Kho-Kho", icon: "🏃", type: "Sport", category: "Outdoor", genders: ["male", "female"] },
  { name: "Throw Ball", icon: "🏐", type: "Sport", category: "Outdoor", genders: ["female"] },
  { name: "Basketball", icon: "🏀", type: "Sport", category: "Outdoor", genders: ["male", "female"] },
  { name: "Volleyball", icon: "🏐", type: "Sport", category: "Outdoor", genders: ["male", "female"] },
  { name: "Handball", icon: "🤾", type: "Sport", category: "Outdoor", genders: ["male"] },
  { name: "Box Cricket", icon: "🏏", type: "Sport", category: "Outdoor", genders: ["neutral"] },
  { name: "Swimming", icon: "🏊", type: "Sport", category: "Outdoor", genders: ["male", "female"] },
  { name: "Inaugural March Past", icon: "🚶", type: "Sport", category: "Outdoor", genders: ["neutral"] },

  // Indoor
  { name: "Badminton", icon: "🏸", type: "Sport", category: "Indoor", genders: ["male", "female", "mixed"] },
  { name: "Table Tennis", icon: "🏓", type: "Sport", category: "Indoor", genders: ["male", "female"] },
  { name: "Carrom", icon: "🎯", type: "Sport", category: "Indoor", genders: ["male", "female"] },
  { name: "Chess", icon: "♟️", type: "Sport", category: "Indoor", genders: ["male", "female"] },
  { name: "Powerlifting", icon: "🏋️", type: "Sport", category: "Indoor", genders: ["male"] },
  { name: "Yoga", icon: "🧘", type: "Sport", category: "Indoor", genders: ["neutral"] },

  // E-Sports
  { name: "BGMI", icon: "📱", type: "Sport", category: "E-Sports", genders: ["neutral"] },
  { name: "Valorant", icon: "💻", type: "Sport", category: "E-Sports", genders: ["neutral"] },

  // Athletics
  { name: "Discus Throw", icon: "🥏", type: "Sport", category: "Athletics", genders: ["male", "female"] },
  { name: "Javelin Throw", icon: "🏹", type: "Sport", category: "Athletics", genders: ["male", "female"] },
  { name: "Marathon", icon: "🏃", type: "Sport", category: "Athletics", genders: ["male", "female"] },
  { name: "Relay 4x100m", icon: "🏃‍♂️", type: "Sport", category: "Athletics", genders: ["male"] },
  { name: "Shot Put", icon: "⚫", type: "Sport", category: "Athletics", genders: ["male", "female"] },
  { name: "Slow Cycling", icon: "🚴", type: "Sport", category: "Athletics", genders: ["male", "female"] },
  { name: "Sprint 100m", icon: "🏃", type: "Sport", category: "Athletics", genders: ["male", "female"] },
  { name: "Sprint 200m", icon: "🏃", type: "Sport", category: "Athletics", genders: ["male", "female"] },
  { name: "Triathlon Relay", icon: "🏃", type: "Sport", category: "Athletics", genders: ["neutral"] },
  { name: "Long Jump", icon: "🦘", type: "Sport", category: "Athletics", genders: ["male"] },
  { name: "Swimming 100m", icon: "🏊", type: "Sport", category: "Athletics", genders: ["male"] }
];

// Culture events data from frontend
const cultureData = [
  { name: "Debate (English)", type: "Culture" },
  { name: "Debate (Hindi)", type: "Culture" },
  { name: "Poetry (English)", type: "Culture" },
  { name: "Poetry (Hindi)", type: "Culture" },
  { name: "Quiz", type: "Culture" },
  { name: "Pic of the Day", type: "Culture" },
  { name: "Reel of the Day", type: "Culture" },
  { name: "Meme of the Day", type: "Culture" },
  { name: "Pic of Vihang", type: "Culture" },
  { name: "Flash Mob", type: "Culture" },
  { name: "Face Painting", type: "Culture" },
  { name: "Short Film", type: "Culture" },
  { name: "Instrumental", type: "Culture" },
  { name: "Solo Dance", type: "Culture" },
  { name: "Duo Dance", type: "Culture" },
  { name: "Group Dance", type: "Culture" },
  { name: "Solo Singing", type: "Culture" },
  { name: "Duet Singing", type: "Culture" },
  { name: "Group Singing", type: "Culture" },
  { name: "Rangoli", type: "Culture" },
  { name: "Poster Making", type: "Culture" },
  { name: "Treasure Hunt", type: "Culture" },
  { name: "Vihang Letters", type: "Culture" }
];

async function seedGames() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing games
        await Game.deleteMany({});
        console.log('Cleared existing games');

        // Find or create a default organizer for seeding
        let defaultOrganizer = await Organizer.findOne({ username: 'admin' });
        if (!defaultOrganizer) {
            const bcrypt = require('bcryptjs');
            const hashedPassword = await bcrypt.hash('admin123', 10);
            defaultOrganizer = new Organizer({
                name: 'System Admin',
                username: 'admin',
                password: hashedPassword,
                role: 'organizer'
            });
            await defaultOrganizer.save();
            console.log('Created default organizer (username: admin, password: admin123)');
        }

        // Combine all games data
        const allGames = [...sportsData, ...cultureData];

        // Add createdBy to all games
        const gamesWithCreator = allGames.map(game => ({
            ...game,
            createdBy: defaultOrganizer._id
        }));

        // Insert games
        const insertedGames = await Game.insertMany(gamesWithCreator);
        console.log(`Successfully seeded ${insertedGames.length} games`);

        // Summary
        const sportsCount = insertedGames.filter(g => g.type === 'Sport').length;
        const cultureCount = insertedGames.filter(g => g.type === 'Culture').length;
        console.log(`Sports: ${sportsCount}, Culture: ${cultureCount}`);

        console.log('Games seeding completed successfully!');
        
    } catch (error) {
        console.error('Error seeding games:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

// Run the seed function
seedGames();
