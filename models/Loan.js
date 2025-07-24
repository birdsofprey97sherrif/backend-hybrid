const mongoose = require('mongoose');
const loanSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
  amount: Number,
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'active', 'defaulted', 'paid'], default: 'pending' },
  repaymentPlan: String,
  loanScore: Number,
  startDate: Date,
  endDate: Date,
  isAutoDeductEnabled: { type: Boolean, default: true },
category: { type: String, enum: ['finance', 'transport', 'hybrid'], default: 'finance' },
     contact: String,
     address: String
}, { timestamps: true });

module.exports = mongoose.model('Loan', loanSchema);
   