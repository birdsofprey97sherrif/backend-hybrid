
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip' },
    passengerName: String,
    passengerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' }, // or anonymous guest with phone
    seatNumber: String,
    passengerPhone: String,
    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
    routeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Route' },
    tripDate: Date,
    pickupLocation: String,
    dropOffLocation: String,
    distance: Number,
    duration: Number,
    fare: Number,
    guestInfo: {
        name: String,
        phone: String,
        nationalId: String
    },
    paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' },
    paymentReference: String,
    paymentMethod: { type: String, enum: ['mpesa', 'wallet', 'card'], default: 'mpesa' },
    bookedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
