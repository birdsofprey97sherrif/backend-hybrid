const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
  name: String,
  category: String,
  location: String,
  monthlyRevenue: Number,
  verified: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Business', businessSchema);
