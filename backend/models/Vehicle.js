const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  registrationNumber: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['bus', 'van', 'car', 'luxury', 'semi-luxury'],
    required: true
  },
  manufacturer: String,
  model: String,
  year: Number,
  seatingCapacity: {
    type: Number,
    required: true,
    min: 1
  },
  currentLocation: {
    city: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amenities: [String],
  insuranceProvider: String,
  insurancePolicyNumber: String,
  insuranceExpiryDate: Date,
  registrationExpiryDate: Date,
  lastServiceDate: Date,
  serviceStatus: {
    type: String,
    enum: ['active', 'maintenance', 'retired'],
    default: 'active'
  },
  mileage: Number,
  fuelType: {
    type: String,
    enum: ['petrol', 'diesel', 'electric', 'hybrid']
  },
  documents: {
    registration: String,
    insurance: String,
    pollutionCertificate: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
