const mongoose = require('mongoose');

const loanRulesEngineSchema = new mongoose.Schema({
  saccoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sacco' },
  ruleName: String,
  minScoreRequired: Number,
  maxLoanAmount: Number,
  allowCRBIntegration: { type: Boolean, default: false },
  useAIForScoring: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('LoanRulesEngine', loanRulesEngineSchema);
