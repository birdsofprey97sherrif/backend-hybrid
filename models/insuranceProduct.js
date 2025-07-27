const mongoose = require('mongoose');

const insuranceProductSchema = new mongoose.Schema({
  saccoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sacco' },
  name: String,
  description: String,
  premium: Number,
  coverage: String
}, { timestamps: true });

module.exports = mongoose.model('InsuranceProduct', insuranceProductSchema);
