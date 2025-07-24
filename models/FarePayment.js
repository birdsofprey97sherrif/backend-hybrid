const mongoose = require('mongoose');
const farePaymentSchema = new mongoose.Schema({
  tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip' },
  passengerName: String,
  
  passengerPhone: String,
  amount: Number,
  paymentMethod: { type: String, enum: ['mpesa', 'cash'] },
  autoDeducted: Boolean
}, { timestamps: true });

module.exports = mongoose.model('FarePayment', farePaymentSchema);
