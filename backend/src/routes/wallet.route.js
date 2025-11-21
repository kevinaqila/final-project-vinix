import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getWalletBalance,
  requestWithdrawal,
  getWithdrawalHistory,
  cancelWithdrawal,
  processWithdrawal,
  autoCompleteWithdrawals,
} from "../controllers/wallet.controller.js";

const router = express.Router();

// All routes require authentication
router.use(protectRoute);

// Get wallet balance
router.get("/balance", getWalletBalance);

// Request withdrawal
router.post("/withdraw", requestWithdrawal);

// Get withdrawal history
router.get("/history", getWithdrawalHistory);

// Cancel withdrawal
router.patch("/cancel/:id", cancelWithdrawal);

// Process withdrawal (admin)
router.patch("/process/:id", processWithdrawal);

// Auto-complete withdrawals (protected dengan secret key)
// Bisa di-trigger dari external cron service seperti EasyCron
router.post("/auto-complete", autoCompleteWithdrawals);

export default router;
