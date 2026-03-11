require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Organizer } = require('./models');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Add a user with username 'admin' and password 'admin1234'
    const admin = {
      name: 'Admin',
      username: 'admin',
      password: bcrypt.hashSync('admin1234', 10),
      accessLevel: 'admin',
    };
    await Organizer.updateOne(
      { username: admin.username },
      { $set: admin },
      { upsert: true }
    );
    console.log('Admin user seeded successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed();
