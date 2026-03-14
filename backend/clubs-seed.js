const mongoose = require('mongoose');
const { Club } = require('./models');
require('dotenv').config();

// Clubs data from frontend
const clubsData = [
    {
        clubNumber: 1,
        name: "Ether Rox",
        theme: "Space/Ether",
        color: "#eeebff",
        totalPoints: 0,
        sportsPoints: 0,
        culturePoints: 0,
        sportBreakdown: [],
        cultureBreakdown: []
    },
    {
        clubNumber: 2,
        name: "Gravitas Elites",
        theme: "Earth",
        color: "#eadcc8",
        totalPoints: 0,
        sportsPoints: 0,
        culturePoints: 0,
        sportBreakdown: [],
        cultureBreakdown: []
    },
    {
        clubNumber: 3,
        name: "Hydro Heroes",
        theme: "Water",
        color: "#b1f8fd",
        totalPoints: 0,
        sportsPoints: 0,
        culturePoints: 0,
        sportBreakdown: [],
        cultureBreakdown: []
    },
    {
        clubNumber: 4,
        name: "Firestorm",
        theme: "Fire",
        color: "#ffcc91",
        totalPoints: 0,
        sportsPoints: 0,
        culturePoints: 0,
        sportBreakdown: [],
        cultureBreakdown: []
    },
    {
        clubNumber: 5,
        name: "Aero Knights",
        theme: "Air",
        color: "#ffffff",
        totalPoints: 0,
        sportsPoints: 0,
        culturePoints: 0,
        sportBreakdown: [],
        cultureBreakdown: []
    }
];

async function seedClubs() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing clubs
        await Club.deleteMany({});
        console.log('Cleared existing clubs');

        // Insert clubs
        const insertedClubs = await Club.insertMany(clubsData);
        console.log(`Successfully seeded ${insertedClubs.length} clubs`);

        // Display seeded clubs
        insertedClubs.forEach(club => {
            console.log(`- ${club.name} (Club #${club.clubNumber})`);
        });

        console.log('Clubs seeding completed successfully!');
        
    } catch (error) {
        console.error('Error seeding clubs:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

// Run the seed function
seedClubs();
