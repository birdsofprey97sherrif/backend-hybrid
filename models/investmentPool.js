const mongoose = require('mongoose');

const investmentPoolSchema = new mongoose.Schema({
  saccoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sacco' },
  title: String,
  description: String,
  expectedReturnRate: Number,
  isOpen: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('InvestmentPool', investmentPoolSchema);
