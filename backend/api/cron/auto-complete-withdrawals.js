import Withdrawal from "../../models/withdrawal.model.js";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
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
    res.status(200).json({ message: 'Auto-complete job executed', modified: result.modifiedCount });
  } catch (error) {
    console.error('Error in auto-complete job:', error);
    res.status(500).json({ message: 'Server error' });
  }
}