const mongoose = require('mongoose');
const parcelTrackingSchema = new mongoose.Schema({
  parcelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Parcel' },
  statusUpdate: String,
  location: String,
  time: Date
}, { timestamps: true });

module.exports = mongoose.model('ParcelTracking', parcelTrackingSchema);
