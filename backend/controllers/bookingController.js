const Booking = require('../models/Booking');
const Journey = require('../models/Journey');

exports.createBooking = async (req, res) => {
  try {
    const { journeyId, numberOfSeats, seatNumbers, paymentMethod, pickupPoint, dropPoint, specialRequests } = req.body;

    const journey = await Journey.findById(journeyId);
    if (!journey) {
      return res.status(404).json({ message: 'Journey not found' });
    }

    if (journey.availableSeats < numberOfSeats) {
      return res.status(400).json({ message: 'Not enough seats available' });
    }

    const totalPrice = numberOfSeats * journey.pricePerSeat;

    const booking = new Booking({
      journey: journeyId,
      passenger: req.user.userId,
      numberOfSeats,
      seatNumbers,
      totalPrice,
      paymentMethod,
      pickupPoint,
      dropPoint,
      specialRequests
    });

    await booking.save();
    
    // Update available seats
    journey.availableSeats -= numberOfSeats;
    await journey.save();

    await booking.populate('journey passenger');

    res.status(201).json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ passenger: req.user.userId })
      .populate('journey')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('journey')
      .populate('passenger');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const { reason } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.bookingStatus === 'cancelled') {
      return res.status(400).json({ message: 'Booking already cancelled' });
    }

    booking.bookingStatus = 'cancelled';
    booking.cancelledAt = new Date();
    booking.cancellationReason = reason;
    booking.paymentStatus = 'refunded';

    await booking.save();

    // Return seats to journey
    const journey = await Journey.findById(booking.journey);
    journey.availableSeats += booking.numberOfSeats;
    await journey.save();

    res.status(200).json({ success: true, message: 'Booking cancelled', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
