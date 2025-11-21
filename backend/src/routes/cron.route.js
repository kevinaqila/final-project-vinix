import express from 'express';
import { autoCompleteWithdrawals } from '../controllers/cron.controller.js';

const router = express.Router();

// POST /api/cron/auto-complete-withdrawals
router.post('/auto-complete-withdrawals', autoCompleteWithdrawals);

export default router;
