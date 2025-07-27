const mongoose = require('mongoose');
const loanSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
  saccoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sacco' },
  amountRequested: Number,
  amountApproved: Number,
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'active', 'defaulted', 'paid'], default: 'pending' },
  repaymentPlan: String,
   repayments: [{
    amount: Number,
    paidAt: Date
  }],
  loanScore: Number,
  startDate: Date,
  dueDate: Date,
  isAutoDeductEnabled: { type: Boolean, default: true },
category: { type: String, enum: ['finance', 'transport', 'hybrid'], default: 'finance' },
     contact: String,
     address: String,
       loanRuleApplied: { type: mongoose.Schema.Types.ObjectId, ref: 'LoanRulesEngine' }

}, { timestamps: true });

module.exports = mongoose.model('Loan', loanSchema);
   