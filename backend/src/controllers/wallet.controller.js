import User from "../models/user.model.js";
import Withdrawal from "../models/withdrawal.model.js";

export const getWalletBalance = async (req, res) => {
  try {
    if (req.user.role !== "freelancer") {
      return res.status(403).json({ message: "Only freelancers have wallet access" });
    }

    const user = await User.findById(req.user._id).select("walletBalance totalEarnings");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const pendingWithdrawals = await Withdrawal.aggregate([
      {
        $match: {
          freelancerId: req.user._id,
          status: { $in: ["pending", "processing"] },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    const pendingAmount = pendingWithdrawals.length > 0 ? pendingWithdrawals[0].total : 0;
    const availableBalance = user.walletBalance - pendingAmount;

    res.status(200).json({
      walletBalance: user.walletBalance,
      totalEarnings: user.totalEarnings || 0,
      pendingWithdrawal: pendingAmount,
      availableBalance: Math.max(0, availableBalance),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const requestWithdrawal = async (req, res) => {
  try {
    const { amount, bankName, accountNumber, accountName } = req.body;
    const adminFee = 7000;

    if (req.user.role !== "freelancer") {
      return res.status(403).json({ message: "Only freelancers can request withdrawals" });
    }

    if (!amount || !bankName || !accountNumber || !accountName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (amount < 100000) {
      return res.status(400).json({ message: "Minimum withdrawal is Rp 100.000" });
    }

    const ADMIN_FEE = 7000; // Admin fee: Rp 7.000
    const totalAmount = amount + ADMIN_FEE;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const pendingWithdrawals = await Withdrawal.aggregate([
      {
        $match: {
          freelancerId: req.user._id,
          status: { $in: ["pending", "processing"] },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    const pendingAmount = pendingWithdrawals.length > 0 ? pendingWithdrawals[0].total : 0;
    const availableBalance = user.walletBalance - pendingAmount;

    if (totalAmount > availableBalance) {
      return res.status(400).json({
        message: `Insufficient balance. Required: Rp ${totalAmount.toLocaleString(
          "id-ID"
        )} (Amount: Rp ${amount.toLocaleString("id-ID")} + Admin Fee: Rp ${ADMIN_FEE.toLocaleString("id-ID")})`,
      });
    }

    // Deduct admin fee immediately
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { walletBalance: -ADMIN_FEE },
    });

    const withdrawal = new Withdrawal({
      freelancerId: req.user._id,
      amount,
      bankName,
      accountNumber,
      accountName,
      status: "pending",
      adminFee: ADMIN_FEE,
      autoCompleteAt: new Date(Date.now() + 2 * 60 * 1000), // 2 menit dari sekarang (sinkron dengan cron)
    });

    await withdrawal.save();

    res.status(201).json({
      message: "Withdrawal request submitted successfully",
      withdrawal,
      adminFeeDeducted: ADMIN_FEE,
      totalDeducted: totalAmount,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getWithdrawalHistory = async (req, res) => {
  try {
    if (req.user.role !== "freelancer") {
      return res.status(403).json({ message: "Only freelancers can view withdrawal history" });
    }

    // Auto-complete pending withdrawals yang sudah lebih dari autoCompleteAt
    const now = new Date();
    const autoCompleteResult = await Withdrawal.updateMany(
      {
        freelancerId: req.user._id,
        status: "pending",
        autoCompleteAt: { $lte: now },
        isAutoCompleted: false,
      },
      {
        $set: {
          status: "completed",
          isAutoCompleted: true,
          processedAt: now,
        },
      }
    );

    // Jika ada yang auto-completed, deduct amount dari wallet
    if (autoCompleteResult.modifiedCount > 0) {
      const autoCompletedWithdrawals = await Withdrawal.find({
        freelancerId: req.user._id,
        isAutoCompleted: true,
        status: "completed",
        processedAt: { $gte: new Date(Date.now() - 60000) }, // Last 1 minute
      });

      let totalAmountToDeduct = 0;
      for (const withdrawal of autoCompletedWithdrawals) {
        totalAmountToDeduct += withdrawal.amount;
      }

      if (totalAmountToDeduct > 0) {
        await User.findByIdAndUpdate(req.user._id, {
          $inc: { walletBalance: -totalAmountToDeduct },
        });
      }
    }

    const withdrawals = await Withdrawal.find({ freelancerId: req.user._id }).sort({ createdAt: -1 }).limit(50);

    res.status(200).json(withdrawals);
  } catch (error) {
    console.error("Error in getWithdrawalHistory:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const cancelWithdrawal = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== "freelancer") {
      return res.status(403).json({ message: "Only freelancers can cancel withdrawals" });
    }

    const withdrawal = await Withdrawal.findOne({
      _id: id,
      freelancerId: req.user._id,
    });

    if (!withdrawal) {
      return res.status(404).json({ message: "Withdrawal not found" });
    }

    if (withdrawal.status !== "pending") {
      return res.status(400).json({ message: "Can only cancel pending withdrawals" });
    }

    withdrawal.status = "rejected";
    withdrawal.notes = "Cancelled by user";
    withdrawal.processedAt = new Date();
    await withdrawal.save();

    res.status(200).json({
      message: "Withdrawal cancelled successfully",
      withdrawal,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const processWithdrawal = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const withdrawal = await Withdrawal.findById(id);

    if (!withdrawal) {
      return res.status(404).json({ message: "Withdrawal not found" });
    }

    if (withdrawal.status !== "pending" && withdrawal.status !== "processing") {
      return res.status(400).json({ message: "Withdrawal already processed" });
    }

    withdrawal.status = status;
    withdrawal.notes = notes;
    withdrawal.processedAt = new Date();
    withdrawal.processedBy = req.user._id;

    if (status === "completed") {
      // Deduct withdrawal amount when completed (admin fee already deducted at request)
      await User.findByIdAndUpdate(withdrawal.freelancerId, {
        $inc: { walletBalance: -withdrawal.amount },
      });
    } else if (status === "rejected") {
      // Refund admin fee if withdrawal is rejected
      await User.findByIdAndUpdate(withdrawal.freelancerId, {
        $inc: { walletBalance: withdrawal.adminFee || 7000 },
      });
    }
    await withdrawal.save();

    res.status(200).json({
      message: "Withdrawal processed successfully",
      withdrawal,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Auto-complete withdrawals yang sudah melewati autoCompleteAt time
export const autoCompleteWithdrawals = async (req, res) => {
  try {
    // Protect dengan secret key
    const secretKey = process.env.CRON_SECRET_KEY;
    const providedKey = req.headers["x-cron-secret"];

    if (!secretKey || providedKey !== secretKey) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const now = new Date();

    // Find semua pending withdrawals yang sudah lewat autoCompleteAt
    const withdrawalsToComplete = await Withdrawal.find({
      status: "pending",
      autoCompleteAt: { $lte: now },
      isAutoCompleted: false,
    });

    console.log(`Processing ${withdrawalsToComplete.length} auto-complete withdrawals...`);

    let completedCount = 0;
    let totalAmountDeducted = 0;

    for (const withdrawal of withdrawalsToComplete) {
      try {
        // Update withdrawal status
        await Withdrawal.findByIdAndUpdate(withdrawal._id, {
          status: "completed",
          isAutoCompleted: true,
          processedAt: now,
        });

        // Deduct amount dari wallet
        await User.findByIdAndUpdate(withdrawal.freelancerId, {
          $inc: { walletBalance: -withdrawal.amount },
        });

        completedCount++;
        totalAmountDeducted += withdrawal.amount;
      } catch (error) {
        console.error(`Error processing withdrawal ${withdrawal._id}:`, error);
      }
    }

    res.status(200).json({
      message: "Auto-complete process finished",
      processedCount: completedCount,
      totalAmountDeducted,
    });
  } catch (error) {
    console.error("Error in autoCompleteWithdrawals:", error);
    res.status(500).json({ message: "Server error" });
  }
};
