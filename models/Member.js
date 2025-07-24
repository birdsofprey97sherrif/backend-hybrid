const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: String,
  nationalId: { type: String, unique: true },
  phone: String,
  email: String,
  password: { type: String, required: true },
  photo: String,
  address: String,
  dateOfBirth: Date,
  gender: { type: String, enum: ['male', 'female', 'other'], default: 'other' },
  occupation: String,
  maritalStatus: { type: String, enum: ['single', 'married', 'divorced', 'widowed'], default: 'single' },
  emergencyContact: String,
  nextOfKin: String,
  saccoId: { type: mongoose.Schema.Types.ObjectId, ref: 'SACCO' },
  isDriver: { type: Boolean, default: false },
  behaviorScore: { type: Number, default: 0 },
  role: { type: String, enum: ['admin', 'member', 'driver'], default: 'member' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Member', memberSchema);
