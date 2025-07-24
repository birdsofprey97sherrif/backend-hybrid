const mongoose = require('mongoose');
const parcelSchema = new mongoose.Schema({
    senderName: String,
    senderPhone: String,
    receiverName: String,
    receiverPhone: String,
    weight: Number,
    origin: String,
    destination: String,
    description: String,
    cost: Number,
    paymentMethod: { type: String, enum: ['mpesa', 'cash'] },
    autoDeducted: Boolean,
    trackingCode: { type: String, unique: true },
    deliveryDate: Date,
    bookedDate: { type: Date, default: Date.now },
    pickupLocation: String,
    status: { type: String, enum: ['booked', 'inTransit', 'delivered'], default: 'booked' },
    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
    tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip' },
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
    deliveryCode: String,
    bookedByMemberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
    paymentRef: String
}, { timestamps: true });

module.exports = mongoose.model('Parcel', parcelSchema);
