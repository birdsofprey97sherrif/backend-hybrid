const mongoose = require('mongoose');
const routeSchema = new mongoose.Schema({
    name: String,
    routeNumber: { type: String, unique: true },
    description: String,
    stops: [String],
    distance: Number,
    duration: Number,
    vehicleType: { type: String, enum: ['bus', 'matatu', 'truck'], default: 'bus' },
    startLocation: String,
    endLocation: String,

    fareAmount: Number,

    isActive: Boolean
}, { timestamps: true });

module.exports = mongoose.model('Route', routeSchema);
