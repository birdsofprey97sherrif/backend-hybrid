const mongoose = require('mongoose');

const memberPolicySchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
  insuranceProductId: { type: mongoose.Schema.Types.ObjectId, ref: 'InsuranceProduct' },
  startDate: Date,
  endDate: Date,
  isActive: Boolean
}, { timestamps: true });

module.exports = mongoose.model('MemberPolicy', memberPolicySchema);
