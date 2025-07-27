const mongoose = require('mongoose');
const routeSchema = new mongoose.Schema({
      saccoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sacco' },
    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
    name: { type: String, required: true },
    routeNumber: { type: String, unique: true },
    description: String,
    stops: [String],
    distance: Number,
    duration: Number,
    vehicleType: { type: String, enum: ['bus', 'matatu', 'truck'], default: 'bus' },
    startLocation: String,
    endLocation: String,
     waypoints: [String],

    fareAmount: Number,

    isActive: Boolean
}, { timestamps: true });

module.exports = mongoose.model('Route', routeSchema);
