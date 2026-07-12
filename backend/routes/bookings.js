const express = require('express');
const bookingController = require('../controllers/bookingController');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

router.post('/', authenticate, bookingController.createBooking);
router.get('/', authenticate, bookingController.getBookings);
router.get('/:id', authenticate, bookingController.getBookingById);
router.put('/:id/cancel', authenticate, bookingController.cancelBooking);

module.exports = router;
