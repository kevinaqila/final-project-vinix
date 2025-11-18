import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';
import {
    selectRole,
    updateFreelancerProfile,
    updateClientProfile,
    updateProfile,
    getProfile,
    getPublicProfile,
    uploadProfilePhoto,
} from '../controllers/user.controller.js';

const router = express.Router();

// Public route - get user public profile
router.get('/profile/:userId', getPublicProfile);

// All routes below are protected
router.use(protectRoute);

// Get user profile
router.get('/profile', getProfile);

// Select role (onboarding)
router.put('/select-role', selectRole);

// Update profiles
router.put('/freelancer-profile', updateFreelancerProfile);
router.put('/client-profile', updateClientProfile);
router.put('/profile', updateProfile);

// Upload profile photo
router.post('/upload-photo', upload.single('photo'), uploadProfilePhoto);

export default router;
