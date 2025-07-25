const express = require("express");
const router = express.Router();
const { protect, restrictTo } = require("../middlewares/auth.middleware");
const {
  createLoan,
  getUserLoans,
  repayLoan,
} = require("../controllers/loan.controller");
const { deleteLoan, getAllLoans, updateLoanStatus } = require("../controllers/loancontroller");

router.post("/create", protect, restrictTo("admin"), createLoan);
router.get("/my", protect, getUserLoans);
router.post("/repay", protect, repayLoan);
router.delete("/delete/:id", protect, restrictTo("admin"), deleteLoan);
router.get("/all",protect, restrictTo("admin"),getAllLoans);
router.put("update/:id", protect, restrictTo("admin"), updateLoanStatus);
router.get("/repayments/:loanId", protect, getLoanRepayments);
router.get("/all", protect, restrictTo("admin"), getAllLoans);

module.exports = router;
