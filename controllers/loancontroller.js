
const Loan = require("../models/Loan");
const Repayment = require("../models/Repayment");
const Wallet = require("../models/Wallet");
const Transaction = require("../models/Transaction");

// CREATE loan (admin only)
exports.createLoan = async (req, res) => {
  try {
    const { borrower, amount, interestRate, termMonths } = req.body;

    const repaymentPlan = [];
    const monthlyInstallment = (amount * (1 + interestRate / 100)) / termMonths;
    const today = new Date();

    for (let i = 1; i <= termMonths; i++) {
      repaymentPlan.push({
        dueDate: new Date(
          today.getFullYear(),
          today.getMonth() + i,
          today.getDate()
        ),
        amount: Math.round(monthlyInstallment),
        paid: false,
      });
    }

    const loan = new Loan({
      borrower,
      amount,
      interestRate,
      termMonths,
      repaymentPlan,
      approvedBy: req.user._id,
      status: "approved",
      disbursedAt: new Date(),
    });

    await loan.save();
    res.status(201).json({ message: "Loan created and disbursed ✅", loan });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Loan creation failed", error: err.message });
  }
};
// DISBURSE loan (admin only)
exports.disburseLoan = async (req, res) => {
  try {
    const { id } = req.params;

    const loan = await Loan.findById(id).populate("user");
    if (!loan) return res.status(404).json({ message: "Loan not found" });
    if (loan.status !== "approved")
      return res.status(400).json({ message: "Loan not approved yet" });

    let wallet = await Wallet.findOne({ user: loan.user._id });
    if (!wallet) wallet = await Wallet.create({ user: loan.user._id });

    wallet.balance += loan.amount;
    await wallet.save();

    await Transaction.create({
      wallet: wallet._id,
      type: "loan-disbursement",
      amount: loan.amount,
      reference: `loan-${loan._id}`,
      method: "system",
    });

    loan.status = "disbursed";
    await loan.save();

    res.status(200).json({ message: "Loan disbursed & wallet credited", loan });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Disbursement failed", error: err.message });
  }
};



// GET my loans
exports.getUserLoans = async (req, res) => {
  try {
    const loans = await Loan.find({ borrower: req.user._id });
    res.status(200).json(loans);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch loans", error: err.message });
  }
};

exports.repayLoan = async (req, res) => {
  try {
    const { loanId, amount, method } = req.body;

    // Find loan using ID
    const loan = await Loan.findById(loanId);
    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    // Authorization check: user must own the loan
    if (loan.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to repay this loan" });
    }

    // Check if loan is already repaid
    if (loan.balance <= 0) {
      return res.status(400).json({ message: "Loan already fully repaid" });
    }

    // Check wallet balance
    const wallet = await Wallet.findOne({ user: req.user._id });
    if (!wallet || wallet.balance < amount) {
      return res.status(400).json({ message: "Insufficient wallet balance" });
    }

    // ✅ Deduct from wallet
    wallet.balance -= amount;
    await wallet.save();

    // ✅ Log transaction
    await Transaction.create({
      wallet: wallet._id,
      type: "withdrawal",
      amount,
      reference: `loan-repay-${loan._id}`,
      method: method || "system",
    });

    // ✅ Update loan balance
    loan.balance -= amount;
    if (loan.balance <= 0) {
      loan.isRepaid = true;
      loan.balance = 0;
      loan.status = "repaid";
    }
    await loan.save();

    // ✅ Log repayment
    const repayment = new Repayment({
      loan: loanId,
      paidBy: req.user._id,
      amount,
      method,
    });
    await repayment.save();

    // Optional: update loan repayment plan logic here

    return res.status(200).json({
      message: "Repayment successful ✅",
      loan,
      repayment,
    });
  } catch (err) {
    console.error("Loan repayment error:", err);
    return res.status(500).json({
      message: "Repayment failed ❌",
      error: err.message,
    });
  }
};

// GET loan repayments
exports.getLoanRepayments = async (req, res) => {
  try {
    const { loanId } = req.params;
    const repayments = await Repayment.find({ loan: loanId }).populate("paidBy");
    res.status(200).json(repayments);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch repayments", error: err.message });
  }
}
// GET all loans (admin only)
exports.getAllLoans = async (req, res) => {
  try {
    const loans = await Loan.find().populate("borrower", "name email");
    res.status(200).json(loans);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch loans", error: err.message });
  }
}
// GET loan details by ID
exports.getLoanDetails = async (req, res) => {
  try {
    const { loanId } = req.params;
    const loan = await Loan.findById(loanId)
      .populate("borrower", "name email")
      .populate("repayments.paidBy", "name email");
    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }
    res.status(200).json(loan);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch loan details", error: err.message });
  }
}
// UPDATE loan status (admin only)
exports.updateLoanStatus = async (req, res) => {    
  try {
    const { loanId } = req.params;
    const { status } = req.body;

    const loan = await Loan.findByIdAndUpdate(
      loanId,
      { status },
      { new: true }
    );
    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }
    res.status(200).json({ message: "Loan status updated", loan });
  } catch (err) {
    res.status(500).json({ message: "Failed to update loan status", error: err.message });
  }
};
// DELETE loan (admin only)
exports.deleteLoan = async (req, res) => {
  try {
    const { loanId } = req.params;

    const loan = await Loan.findByIdAndDelete(loanId);
    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }
    res.status(200).json({ message: "Loan deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete loan", error: err.message });
  }
};
// GET all repayments (admin only)
exports.getAllRepayments = async (req, res) => {
  try {
    const repayments = await Repayment.find()
      .populate("loan", "amount borrower")
      .populate("paidBy", "name email");
    res.status(200).json(repayments);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch repayments", error: err.message });
  }
}
