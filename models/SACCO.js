const mongoose = require('mongoose');

const saccoSchema = new mongoose.Schema({
  name: String,
  registrationNumber: String,
  category: { type: String, enum: ['finance', 'transport', 'hybrid'], default: 'finance' },
 
  address: String,
  
  logoUrl: String,
  primaryColor: String,
  pricingPlan: String,
  isActive: { type: Boolean, default: true },
  contactInfo: {
    email: String,
    phone: String,
    address: String
  },
  registrationStage: String,
  setupCompleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Sacco', saccoSchema);

