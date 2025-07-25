const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema(
  {
    name: String,
    nationalId: { type: String, unique: true },
    phone: String,
    email: String,
    password: { type: String, required: true },
    photo: String,
    address: String,
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "other",
    },
    occupation: String,
    maritalStatus: {
      type: String,
      enum: ["single", "married", "divorced", "widowed"],
      default: "single",
    },
    emergencyContact: String,
    nextOfKin: {
      name: String,
      relationship: String,
      phone: String,
    },
    saccoId: { type: mongoose.Schema.Types.ObjectId, ref: "SACCO" },
    isDriver: { type: Boolean, default: false },
    assignedVehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" },
    membershipDate: { type: Date, default: Date.now },
    membershipStatus: {
      type: String,
      enum: ["active", "inactive", "pending", "suspended"],
      default: "active",
    },
    points: { type: Number, default: 0 },
    behaviorScore: { type: Number, default: 0 },
    role: {
      type: String,
      enum: ["admin", "member", "driver"],
      default: "member",
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Member', memberSchema);
