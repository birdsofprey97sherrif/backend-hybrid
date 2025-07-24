const mongoose = require('mongoose');
const transactionSchema = new mongoose.Schema({
    memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
    savingAccountId: { type: mongoose.Schema.Types.ObjectId, ref: 'SavingAccount', default: null },
    type: { type: String, enum: ['deposit', 'withdrawal', 'fare', 'repayment', 'parcel'] },
    description: String,
    referenceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', default: null }, // For fare transactions
    amount: Number,
    paymentMethod: { type: String, enum: ['mpesa', 'cash', 'bankTransfer'], default: 'mpesa' },
    autoDeducted: Boolean,
    mpesaRef: String,
    timestamp: Date,
    linkedLoanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Loan', default: null }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
