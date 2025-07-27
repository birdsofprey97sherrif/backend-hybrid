const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
  saccoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sacco' },
  action: String,
  metadata: mongoose.Schema.Types.Mixed,
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
