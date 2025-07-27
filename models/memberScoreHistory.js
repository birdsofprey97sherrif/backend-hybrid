const mongoose = require('mongoose');

const memberScoreHistorySchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
  score: Number,
  reason: String
}, { timestamps: true });

module.exports = mongoose.model('MemberScoreHistory', memberScoreHistorySchema);
