const mongoose = require('mongoose');
const loanRepaymentSchema = new mongoose.Schema({
    loanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Loan' },
    amountPaid: Number,

    paymentDate: Date,
    paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    paymentReference: String,

    method: { type: String, enum: ['mpesa', 'wallet'] },
    transactionId: String,

    autoDeduct: Boolean
}, { timestamps: true });

module.exports = mongoose.model('LoanRepayment', loanRepaymentSchema);
