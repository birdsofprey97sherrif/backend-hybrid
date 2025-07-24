const express = require('express');
const router = express.Router();
const ParcelController = require('../controllers/ParcelController');

// Book a new parcel
router.post('/', ParcelController.createParcel);

// Update parcel status (e.g., booked → inTransit → delivered)
router.patch('/update-status/:parcelId', ParcelController.updateParcelStatus);

// Get all parcels
router.get('/', ParcelController.getAllParcels);

// Get one parcel
router.get('/:id', ParcelController.getParcelById);

// Get tracking history for a parcel
router.get('/tracking/:parcelId', ParcelController.getParcelTracking);

module.exports = router;
