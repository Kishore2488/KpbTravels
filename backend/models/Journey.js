const mongoose = require('mongoose');

const journeySchema = new mongoose.Schema({
  routeName: {
    type: String,
    required: true,
    trim: true
  },
  source: {
    city: { type: String, required: true },
    address: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  destination: {
    city: { type: String, required: true },
    address: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  distance: {
    type: Number,
    required: true
  },
  estimatedDuration: {
    type: Number,
    required: true
  },
  departureTime: {
    type: Date,
    required: true
  },
  arrivalTime: {
    type: Date,
    required: true
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  totalSeats: {
    type: Number,
    required: true,
    min: 1,
    max: 100
  },
  availableSeats: {
    type: Number,
    required: true
  },
  pricePerSeat: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  amenities: [String],
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Journey', journeySchema);
