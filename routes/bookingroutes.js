const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');

// Booking routes
router.get('/trips/available', bookingController.getAvailableTrips);
router.get('/trip/:id/seats', bookingController.getSeatingMap);
router.post('/booking', bookingController.createBooking); // Member or guest
router.post('/payment/confirm', bookingController.confirmPayment);
router.get('/member/bookings/:memberId', bookingController.getMemberBookings);

module.exports = router;
