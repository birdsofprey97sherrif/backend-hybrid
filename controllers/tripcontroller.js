const FarePayment = require('../models/FarePayment');
const Loan = require('../models/Loan');
const LoanRepayment = require('../models/LoanRepayment');
const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const Member = require('../models/Member');

const AUTO_DEDUCT_PERCENTAGE = 0.3;

exports.processFarePayment = async (req, res) => {
  try {
    const { tripId, passengerPhone, amount, paymentMethod, autoDeducted } = req.body;

    // 1. Record the fare
    const fare = await FarePayment.create({
      tripId,
      passengerPhone,
      amount,
      paymentMethod,
      autoDeducted
    });

    // 2. Find member (if passengerPhone is linked to a member)
    const member = await Member.findOne({ phone: passengerPhone });
    if (!member) return res.status(201).json({ message: 'Guest fare payment recorded', fare });

    if (!autoDeducted) {
      return res.status(201).json({ message: 'Fare recorded without deduction', fare });
    }

    // 3. Check for active loan
    const loan = await Loan.findOne({ memberId: member._id, status: 'active' });
    if (!loan) return res.status(200).json({ message: 'No active loan for member. Fare recorded.', fare });

    // 4. Deduct % of fare and record repayment
    const deductionAmount = amount * AUTO_DEDUCT_PERCENTAGE;

    const repayment = await LoanRepayment.create({
      loanId: loan._id,
      amountPaid: deductionAmount,
      paymentDate: new Date(),
      method: 'wallet',
      autoDeduct: true
    });

    // 5. Update member's wallet (deduction)
    let wallet = await Wallet.findOne({ memberId: member._id, type: 'deductions' });
    if (!wallet) {
      wallet = await Wallet.create({ memberId: member._id, type: 'deductions', balance: 0 });
    }
    wallet.balance -= deductionAmount;
    await wallet.save();

    // 6. Log transaction
    await Transaction.create({
      memberId: member._id,
      type: 'repayment',
      amount: deductionAmount,
      mpesaRef: null,
      timestamp: new Date(),
      linkedLoanId: loan._id
    });

    res.status(200).json({
      message: 'Fare recorded and deduction applied to loan',
      fare,
      repayment
    });

  } catch (err) {
    console.error('TripController > processFarePayment error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
exports.getFarePayments = async (req, res) => {
  try {
    const farePayments = await FarePayment.find().populate('tripId');
    res.status(200).json(farePayments);
  } catch (err) {
    console.error('TripController > getFarePayments error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
exports.getFarePaymentById = async (req, res) => {  
  try {
    const { id } = req.params;
    const farePayment = await FarePayment.findById(id).populate('tripId');
    if (!farePayment) return res.status(404).json({ message: 'Fare payment not found' });
    res.status(200).json(farePayment);
  } catch (err) {
    console.error('TripController > getFarePaymentById error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}
exports.updateFarePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { tripId, passengerPhone, amount, paymentMethod, autoDeducted } = req.body;

    const farePayment = await FarePayment.findByIdAndUpdate(id, {
      tripId,
      passengerPhone,
      amount,
      paymentMethod,
      autoDeducted
    }, { new: true });

    if (!farePayment) return res.status(404).json({ message: 'Fare payment not found' });

    res.status(200).json(farePayment);
  } catch (err) {
    console.error('TripController > updateFarePayment error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}
exports.deleteFarePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const farePayment = await FarePayment.findByIdAndDelete(id);
    if (!farePayment) return res.status(404).json({ message: 'Fare payment not found' });
    res.status(200).json({ message: 'Fare payment deleted successfully' });
  } catch (err) {
    console.error('TripController > deleteFarePayment error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
exports.getFarePaymentsByTrip = async (req, res) => {
  try {
    const { tripId } = req.params;
    const farePayments = await FarePayment.find({ tripId }).populate('tripId');
    res.status(200).json(farePayments);
  } catch (err) {
    console.error('TripController > getFarePaymentsByTrip error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
exports.getFarePaymentsByPassenger = async (req, res) => {
  try {
    const { passengerPhone } = req.params;
    const farePayments = await FarePayment.find({ passengerPhone }).populate('tripId');
    res.status(200).json(farePayments);
  } catch (err) {
    console.error('TripController > getFarePaymentsByPassenger error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
