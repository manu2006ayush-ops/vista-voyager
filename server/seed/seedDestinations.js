require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Destination = require('../models/Destination');
const User = require('../models/User');
const destinations = require('./destinationsData');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    await Destination.deleteMany({});
    await Destination.insertMany(destinations);
    console.log(`Seeded ${destinations.length} destinations.`);

    const adminExists = await User.findOne({ email: 'admin@vistavoyager.com' });
    if (!adminExists) {
      await User.create({
        name: 'Vista Admin',
        email: 'admin@vistavoyager.com',
        password: 'Admin@123',
        role: 'admin',
      });
      console.log('Created default admin user: admin@vistavoyager.com / Admin@123');
    } else {
      console.log('Admin user already exists, skipping.');
    }

    console.log('Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seed();
