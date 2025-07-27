const mongoose = require('mongoose');
const vehicleSchema = new mongoose.Schema({
    saccoId: { type: mongoose.Schema.Types.ObjectId, ref: 'SACCO' },
    model: String,
    make: String,
    year: Number,
    color: String,
    vehicleType: { type: String, enum: ['car', 'bus', 'truck', 'motorcycle'], default: 'car' },
    insuranceNumber: { type: String, unique: true },
    insuranceExpiryDate: Date,

routeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Route' },
  seatMap: [[{ seatNumber: String, isBooked: Boolean }]],
  plateNumber: { type: String, unique: true },

    capacity: Number,
    status: { type: String, enum: ['available', 'inUse', 'maintenance', 'retired'], default: 'available' },
    lastServicedDate: Date,

    assignedDriverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },

    currentRouteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Route' }

}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);
