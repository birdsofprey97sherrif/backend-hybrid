const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth.middleware");
const { getWallet, deposit } = require("../controllers/wallet.controller");

router.get("/me", protect, getWallet);
router.post("/deposit", protect, deposit);
router.post("/withdraw", protect, withdraw);
router.post("/transfer", protect, transfer);
router.get("/transactions", protect, getTransactions);
router.get("/balance", protect, getBalance);


module.exports = router;
