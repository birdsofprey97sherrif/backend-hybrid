const mongoose = require('mongoose');
const walletSchema = new mongoose.Schema({
    memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
    saccoId: { type: mongoose.Schema.Types.ObjectId, ref: 'SACCO' },
    accountName: String,
    accountNumber: { type: String, unique: true },
    accountStatus: { type: String, enum: ['active', 'inactive', 'closed'], default: 'active' },
    accountType: { type: String, enum: ['savings', 'fixed'], default: 'savings' },
    balance: { type: Number, default: 0 },
    transactions: [{
        type: { type: String, enum: ['credit', 'debit'], required: true },
        amount: { type: Number, required: true },
        description: String,
        date: { type: Date, default: Date.now }
    }],
    interestRate: { type: Number, default: 0.05 }, // 5% default interest rate
    type: { type: String, enum: ['savings', 'earnings', 'deductions'], default: 'savings' },
    autoSaveEnabled: { type: Boolean, default: true },
    lastUpdated: Date
}, { timestamps: true });

module.exports = mongoose.model('Wallet', walletSchema);
