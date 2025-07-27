const mongoose = require('mongoose');

const memberInvestmentSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
  investmentPoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'InvestmentPool' },
  amount: Number,
  returned: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('MemberInvestment', memberInvestmentSchema);
