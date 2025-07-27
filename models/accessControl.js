const mongoose = require('mongoose');

const accessControlSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  saccoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sacco' },
  role: String,
  permissions: [String]
}, { timestamps: true });

module.exports = mongoose.model('AccessControl', accessControlSchema);
