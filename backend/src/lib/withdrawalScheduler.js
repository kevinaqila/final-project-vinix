import cron from 'node-cron';
import Withdrawal from '../models/withdrawal.model.js';
import User from '../models/user.model.js';

/**
 * Auto-complete pending withdrawals after specified interval
 * Runs every 5 minutes to check for pending withdrawals older than 10 minutes
 */
export const startWithdrawalScheduler = () => {
  // Run every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    try {
      const now = new Date();
      const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);

      // Find pending withdrawals created more than 10 minutes ago
      const pendingWithdrawals = await Withdrawal.find({
        status: 'pending',
        createdAt: { $lte: tenMinutesAgo },
      });

      if (pendingWithdrawals.length === 0) {
        console.log(`[Withdrawal Scheduler] No pending withdrawals to process at ${now.toISOString()}`);
        return;
      }

      console.log(`[Withdrawal Scheduler] Processing ${pendingWithdrawals.length} withdrawal(s) at ${now.toISOString()}`);

      for (const withdrawal of pendingWithdrawals) {
        try {
          // Update withdrawal status to completed
          withdrawal.status = 'completed';
          withdrawal.processedAt = now;
          withdrawal.notes = withdrawal.notes ? `${withdrawal.notes} | Auto-processed by scheduler` : 'Auto-processed by scheduler';
          
          await withdrawal.save();

          // Deduct withdrawal amount from user wallet
          await User.findByIdAndUpdate(withdrawal.freelancerId, {
            $inc: { walletBalance: -withdrawal.amount },
          });

          console.log(`[Withdrawal Scheduler] ✓ Completed withdrawal ${withdrawal._id} for user ${withdrawal.freelancerId}`);
        } catch (err) {
          console.error(`[Withdrawal Scheduler] ✗ Error processing withdrawal ${withdrawal._id}:`, err.message);
        }
      }
    } catch (error) {
      console.error('[Withdrawal Scheduler] Error:', error.message);
    }
  });

  console.log('[Withdrawal Scheduler] Started - Auto-completing withdrawals every 5 minutes');
};

/**
 * Alternative: Process withdrawals on-demand (can be called from API endpoint)
 */
export const processWithdrawalsNow = async () => {
  try {
    const now = new Date();

    const pendingWithdrawals = await Withdrawal.find({
      status: 'pending',
    });

    if (pendingWithdrawals.length === 0) {
      return { message: 'No pending withdrawals to process', processed: 0 };
    }

    let processed = 0;

    for (const withdrawal of pendingWithdrawals) {
      try {
        withdrawal.status = 'completed';
        withdrawal.processedAt = now;
        withdrawal.notes = withdrawal.notes ? `${withdrawal.notes} | Manual process` : 'Manual process';
        
        await withdrawal.save();

        await User.findByIdAndUpdate(withdrawal.freelancerId, {
          $inc: { walletBalance: -withdrawal.amount },
        });

        processed++;
      } catch (err) {
        console.error(`Error processing withdrawal ${withdrawal._id}:`, err.message);
      }
    }

    return { 
      message: `Processed ${processed} withdrawal(s)`, 
      processed,
      total: pendingWithdrawals.length 
    };
  } catch (error) {
    throw new Error(`Failed to process withdrawals: ${error.message}`);
  }
};
