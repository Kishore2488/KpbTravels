const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingNumber: {
    type: String,
    unique: true,
    required: true
  },
  journey: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Journey',
    required: true
  },
  passenger: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  numberOfSeats: {
    type: Number,
    required: true,
    min: 1
  },
  seatNumbers: [String],
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'upi', 'wallet', 'bank_transfer'],
    required: true
  },
  transactionId: String,
  bookingStatus: {
    type: String,
    enum: ['confirmed', 'cancelled', 'completed'],
    default: 'confirmed'
  },
  specialRequests: String,
  pickupPoint: String,
  dropPoint: String,
  confirmationEmail: String,
  cancelledAt: Date,
  cancellationReason: String,
  cancellationCharge: {
    type: Number,
    default: 0
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

// Generate booking number
bookingSchema.pre('save', async function(next) {
  if (!this.bookingNumber) {
    const count = await mongoose.model('Booking').countDocuments();
    this.bookingNumber = `KPB${Date.now()}${count + 1}`;
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
