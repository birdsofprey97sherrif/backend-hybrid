const express = require('express');
const router = express.Router();
const TripController = require('../controllers/TripController');

// Create a new trip (optional, e.g. scheduled trip)
router.post('/', TripController.createTrip);

// Process fare payment + optional loan deduction
router.post('/fare-payment', TripController.processFarePayment);

// Get all trips (admin/driver)
router.get('/', TripController.getAllTrips);

// Get one trip by ID
router.get('/:id', TripController.getTripById);

module.exports = router;
