const mongoose = require('mongoose');
const behaviorLogSchema = new mongoose.Schema({
    memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
    loanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Loan' },
    savingAccountId: { type: mongoose.Schema.Types.ObjectId, ref: 'SavingAccount' },
    action: { type: String, enum: ['loan', 'savings', 'general'], default: 'general' },
    actionType: { type: String, enum: ['latePayment', 'onTime', 'missedInstallment', 'guaranteeBreach'] },
    behaviorImpact: { type: String, enum: ['positive', 'negative'], default: 'positive' },
    scoreChange: Number,
    description: String,
    details: {
        loanDetails: {
            amount: Number,
            status: { type: String, enum: ['pending', 'approved', 'rejected', 'active', 'defaulted', 'paid'], default: 'pending' },
            repaymentPlan: String
        },
        savingAccountDetails: {
            balance: Number,
            accountStatus: { type: String, enum: ['active', 'inactive', 'closed'], default: 'active' }
        }
    },
    comment: String,

    date: Date
}, { timestamps: true });

module.exports = mongoose.model('BehaviorLog', behaviorLogSchema);
