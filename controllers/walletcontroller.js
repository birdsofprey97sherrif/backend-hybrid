const Wallet = require("../models/Wallet");
const Transaction = require("../models/Transaction");

// Get My Wallet
exports.getWallet = async (req, res) => {
  try {
    let wallet = await Wallet.findOne({ user: req.user._id });
    if (!wallet) {
      wallet = await Wallet.create({ user: req.user._id });
    }
    const transactions = await Transaction.find({ wallet: wallet._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({ wallet, transactions });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Could not retrieve wallet", error: err.message });
  }
};

// Deposit (simulate)
exports.deposit = async (req, res) => {
  try {
    const { amount, method = "mpesa", reference } = req.body;
    let wallet = await Wallet.findOne({ user: req.user._id });
    if (!wallet) wallet = await Wallet.create({ user: req.user._id });

    wallet.balance += amount;
    wallet.updatedAt = new Date();
    await wallet.save();

    await Transaction.create({
      wallet: wallet._id,
      amount,
      method,
      reference,
      type: "deposit",
    });

    res
      .status(200)
      .json({ message: "Deposit successful", balance: wallet.balance });
  } catch (err) {
    res.status(500).json({ message: "Deposit failed", error: err.message });
  }
};
// Withdraw (simulate)
exports.withdraw = async (req, res) => {
  try {
    const { amount, method = "mpesa", reference } = req.body;
    let wallet = await Wallet.findOne({ user: req.user._id });
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    if (wallet.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    wallet.balance -= amount;
    wallet.updatedAt = new Date();
    await wallet.save();

    await Transaction.create({
      wallet: wallet._id,
      amount,
      method,
      reference,
      type: "withdrawal",
    });

    res
      .status(200)
      .json({ message: "Withdrawal successful", balance: wallet.balance });
  } catch (err) {
    res.status(500).json({ message: "Withdrawal failed", error: err.message });
  }
}
// Transfer funds to another user
exports.transfer = async (req, res) => {
  try {
    const { recipientId, amount, method = "mpesa", reference } = req.body;
    let senderWallet = await Wallet.findOne({ user: req.user._id });
    if (!senderWallet) {
      return res.status(404).json({ message: "Your wallet not found" });
    }

    if (senderWallet.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    let recipientWallet = await Wallet.findOne({ user: recipientId });
    if (!recipientWallet) {
      recipientWallet = await Wallet.create({ user: recipientId });
    }

    // Deduct from sender's wallet
    senderWallet.balance -= amount;
    await senderWallet.save();

    // Add to recipient's wallet
    recipientWallet.balance += amount;
    await recipientWallet.save();

    // Log the transaction
    await Transaction.create({
      wallet: senderWallet._id,
      amount,
      method,
      reference,
      type: "transfer",
      recipient: recipientId,
    });

    res.status(200).json({
      message: "Transfer successful",
      senderBalance: senderWallet.balance,
      recipientBalance: recipientWallet.balance,
    });
  } catch (err) {
    res.status(500).json({ message: "Transfer failed", error: err.message });
  }
}
// Get transaction history
exports.getTransactionHistory = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ user: req.user._id });
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    const transactions = await Transaction.find({ wallet: wallet._id }).sort({
      createdAt: -1,
    });

    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch transactions", error: err.message });
  }
}
// Get wallet balance
exports.getWalletBalance = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ user: req.user._id });
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }
    res.status(200).json({ balance: wallet.balance });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch wallet balance", error: err.message });
  }
}
// Update wallet details (e.g., for admin use)
exports.updateWallet = async (req, res) => {
  try {
    const { userId, balance } = req.body;
    const wallet = await Wallet.findOneAndUpdate(
      { user: userId },
      { balance, updatedAt: new Date() },
      { new: true }
    );

    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    res.status(200).json({ message: "Wallet updated successfully", wallet });
  } catch (err) {
    res.status(500).json({ message: "Failed to update wallet", error: err.message });
  }
}
// Delete wallet (admin only)
exports.deleteWallet = async (req, res) => {
  try {
    const { userId } = req.params;
    const wallet = await Wallet.findOneAndDelete({ user: userId });

    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    res.status(200).json({ message: "Wallet deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete wallet", error: err.message });
  }
}
// Get wallet by user ID (admin only)
exports.getWalletByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }
    res.status(200).json(wallet);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch wallet", error: err.message });
  }
}
// Get all wallets (admin only)
exports.getAllWallets = async (req, res) => {
  try {
    const wallets = await Wallet.find().populate("user", "name email");
    res.status(200).json(wallets);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch wallets", error: err.message });
  }
}
exports.repayLoan = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;

    const loan = await Loan.findById(id);
    if (!loan) return res.status(404).json({ message: 'Loan not found' });
    if (loan.user.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized' });
    if (loan.balance <= 0) return res.status(400).json({ message: 'Loan already repaid' });

    const wallet = await Wallet.findOne({ user: req.user._id });
    if (!wallet || wallet.balance < amount) {
      return res.status(400).json({ message: 'Insufficient wallet balance' });
    }

    // Deduct
    wallet.balance -= amount;
    await wallet.save();

    // Transaction
    await Transaction.create({
      wallet: wallet._id,
      type: 'withdrawal',
      amount,
      reference: `loan-repay-${loan._id}`,
      method: 'system'
    });

    // Update Loan
    loan.balance -= amount;
    if (loan.balance <= 0) {
      loan.isRepaid = true;
      loan.balance = 0;
      loan.status = 'repaid';
    }
    await loan.save();

    res.status(200).json({ message: 'Repayment successful', loan });
  } catch (err) {
    res.status(500).json({ message: 'Repayment failed', error: err.message });
  }
};
