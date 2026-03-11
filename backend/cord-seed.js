const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const { User } = require('./models');

async function seedCoordinator() {
    await mongoose.connect(process.env.MONGODB_URI);
    try {
        const username = 'user1';
        const password = 'user1';
        const name = 'User One';
        const clubNumber = 1; // Change as needed
        const year = 1; // Change as needed

        // Check if user already exists
        let user = await User.findOne({ username });
        if (user) {
            console.log('Coordinator user1 already exists.');
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({
            name,
            username,
            password: hashedPassword,
            clubNumber,
            year
        });
        await user.save();
        console.log('Coordinator user1 created successfully.');
    } catch (err) {
        console.error('Error creating coordinator:', err.message);
    } finally {
        await mongoose.disconnect();
    }
}

seedCoordinator();
