import Withdrawal from "../models/withdrawal.model.js";

export const autoCompleteWithdrawals = async (req, res) => {
  try {
    // Only accept POST (Vercel Cron uses POST by default in our setup)
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed' });
    }

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const result = await Withdrawal.updateMany(
      {
        status: 'pending',
        createdAt: { $lt: twentyFourHoursAgo },
      },
      {
        status: 'completed',
        processedAt: new Date(),
        notes: 'Auto-completed after 24 hours',
      }
    );

    console.log(`Auto-completed ${result.modifiedCount} withdrawals`);
    return res.status(200).json({ message: 'Auto-complete job executed', modified: result.modifiedCount });
  } catch (error) {
    console.error('Error in auto-complete job:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
