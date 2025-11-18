import User from "../models/user.model.js";
import Withdrawal from "../models/withdrawal.model.js";

export const getWalletBalance = async (req, res) => {
  try {
    if (req.user.role !== 'freelancer') {
      return res.status(403).json({ message: "Only freelancers have wallet access" });
    }

    const user = await User.findById(req.user._id).select('walletBalance totalEarnings');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const pendingWithdrawals = await Withdrawal.aggregate([
      {
        $match: {
          freelancerId: req.user._id,
          status: { $in: ['pending', 'processing'] },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
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

    if (req.user.role !== 'freelancer') {
      return res.status(403).json({ message: "Only freelancers can request withdrawals" });
    }

    if (!amount || !bankName || !accountNumber || !accountName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (amount < 100000) {
      return res.status(400).json({ message: "Minimum withdrawal is Rp 100.000" });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const pendingWithdrawals = await Withdrawal.aggregate([
      {
        $match: {
          freelancerId: req.user._id,
          status: { $in: ['pending', 'processing'] },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
        },
      },
    ]);

    const pendingAmount = pendingWithdrawals.length > 0 ? pendingWithdrawals[0].total : 0;
    const availableBalance = user.walletBalance - pendingAmount;

    if (amount > availableBalance) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    const withdrawal = new Withdrawal({
      freelancerId: req.user._id,
      amount,
      bankName,
      accountNumber,
      accountName,
      status: 'pending',
    });

    await withdrawal.save();

    res.status(201).json({
      message: "Withdrawal request submitted successfully",
      withdrawal,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getWithdrawalHistory = async (req, res) => {
  try {
    if (req.user.role !== 'freelancer') {
      return res.status(403).json({ message: "Only freelancers can view withdrawal history" });
    }

    const withdrawals = await Withdrawal.find({ freelancerId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json(withdrawals);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const cancelWithdrawal = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== 'freelancer') {
      return res.status(403).json({ message: "Only freelancers can cancel withdrawals" });
    }

    const withdrawal = await Withdrawal.findOne({
      _id: id,
      freelancerId: req.user._id,
    });

    if (!withdrawal) {
      return res.status(404).json({ message: "Withdrawal not found" });
    }

    if (withdrawal.status !== 'pending') {
      return res.status(400).json({ message: "Can only cancel pending withdrawals" });
    }

    withdrawal.status = 'rejected';
    withdrawal.notes = 'Cancelled by user';
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

    if (withdrawal.status !== 'pending' && withdrawal.status !== 'processing') {
      return res.status(400).json({ message: "Withdrawal already processed" });
    }

    withdrawal.status = status;
    withdrawal.notes = notes;
    withdrawal.processedAt = new Date();
    withdrawal.processedBy = req.user._id;

    if (status === 'completed') {
      await User.findByIdAndUpdate(withdrawal.freelancerId, {
        $inc: { walletBalance: -withdrawal.amount },
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
