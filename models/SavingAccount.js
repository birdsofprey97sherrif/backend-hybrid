const mongoose = require('mongoose');
const savingAccountSchema = new mongoose.Schema({
    memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
    saccoId: { type: mongoose.Schema.Types.ObjectId, ref: 'SACCO' },

    balance: { type: Number, default: 0 },
    accountName: String,
    accountStatus: { type: String, enum: ['active', 'inactive', 'closed'], default: 'active' },
    autoSaveEnabled: { type: Boolean, default: true },
    interestRate: { type: Number, default: 0.05 }, // 5% default interest rate
    accountNumber: { type: String, unique: true },

    accountType: { type: String, enum: ['savings', 'fixed'], default: 'savings' },

    lastUpdated: Date

}, { timestamps: true });

module.exports = mongoose.model('SavingAccount', savingAccountSchema);
