import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import {
    createReview,
    getServiceReviews,
    getFreelancerReviews,
    respondToReview,
} from '../controllers/review.controller.js';

const router = express.Router();

// Public routes
router.get('/service/:serviceId', getServiceReviews);
router.get('/freelancer/:freelancerId', getFreelancerReviews);

// Protected routes
router.post('/', protectRoute, createReview);
router.put('/:id/respond', protectRoute, respondToReview);

export default router;
