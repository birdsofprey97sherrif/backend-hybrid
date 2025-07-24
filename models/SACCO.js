const mongoose = require('mongoose');

const saccoSchema = new mongoose.Schema({
  name: String,
  registrationNumber: String,
  category: { type: String, enum: ['finance', 'transport', 'hybrid'], default: 'finance' },
  contact: String,
  address: String
}, { timestamps: true });

module.exports = mongoose.model('SACCO', saccoSchema);
