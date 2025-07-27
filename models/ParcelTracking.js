const mongoose = require('mongoose');
const parcelTrackingSchema = new mongoose.Schema({
  parcelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Parcel' },
 senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
  receiverPhone: String,
  description: String,
  status: { type: String, default: 'pending' },
  currentLocation: String,
  parcelTrackingEvents: [{
    status: String,
    timestamp: Date,
    location: String
  }],
  saccoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sacco' }
}, { timestamps: true });

module.exports = mongoose.model('ParcelTracking', parcelTrackingSchema);
