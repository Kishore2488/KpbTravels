require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Vehicle = require('./models/Vehicle');
const Journey = require('./models/Journey');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kpb-travels');
    console.log('Connected to database');

    // Clear existing data
    await User.deleteMany({});
    await Vehicle.deleteMany({});
    await Journey.deleteMany({});

    // Create admin user
    const adminUser = await User.create({
      name: 'KPB Admin',
      email: 'admin@kpbtravels.com',
      password: 'admin123',
      userType: 'admin',
      verified: true,
      isActive: true
    });

    // Create driver users
    const drivers = await User.create([
      {
        name: 'Rajesh Kumar',
        email: 'rajesh@kpbtravels.com',
        password: 'driver123',
        phone: '9876543210',
        userType: 'driver',
        verified: true,
        isActive: true
      },
      {
        name: 'Priya Singh',
        email: 'priya@kpbtravels.com',
        password: 'driver123',
        phone: '9876543211',
        userType: 'driver',
        verified: true,
        isActive: true
      }
    ]);

    // Create vehicles
    const vehicles = await Vehicle.create([
      {
        registrationNumber: 'DL01AB1234',
        name: 'Express Plus',
        type: 'bus',
        manufacturer: 'Volvo',
        model: 'B7R',
        year: 2022,
        seatingCapacity: 50,
        owner: drivers[0]._id,
        amenities: ['WiFi', 'USB Charging', 'Reclining Seats', 'AC'],
        fuelType: 'diesel',
        serviceStatus: 'active'
      },
      {
        registrationNumber: 'DL02CD5678',
        name: 'Comfort Travel',
        type: 'van',
        manufacturer: 'Mahindra',
        model: 'NuvoSport',
        year: 2021,
        seatingCapacity: 17,
        owner: drivers[1]._id,
        amenities: ['AC', 'Music System'],
        fuelType: 'diesel',
        serviceStatus: 'active'
      }
    ]);

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
