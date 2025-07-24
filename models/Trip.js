const mongoose = require('mongoose');
const tripSchema = new mongoose.Schema({
    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
    startLocation: String,
    endLocation: String,
    routeName: String,
    startTime: Date,
    endTime: Date,
    distance: Number,
    duration: Number,
    fareAmount: Number,
    routeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Route' },
    tripDate: Date,
    passengersCount: Number,
    fareCollected: Number,
     seatingMap: [{
    seatNumber: String,
    status: { type: String, enum: ['available', 'booked'], default: 'available' },
    bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', default: null }
  }],
    linkedLoanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Loan', default: null }
}, { timestamps: true });

module.exports = mongoose.model('Trip', tripSchema);
