import express from 'express';
import { protectRoute, isFreelancer } from '../middleware/auth.middleware.js';
import {
    createService,
    getServices,
    getServiceById,
    updateService,
    deleteService,
    getMyServices,
} from '../controllers/service.controller.js';

const router = express.Router();

// Public routes
router.get('/', getServices);

// Protected routes - specific paths BEFORE parameterized paths
router.get('/my/services', protectRoute, isFreelancer, getMyServices); // Must be before /:id
router.post('/', protectRoute, isFreelancer, createService);
router.put('/:id', protectRoute, isFreelancer, updateService);
router.delete('/:id', protectRoute, isFreelancer, deleteService);

// Parameterized routes should be LAST
router.get('/:id', getServiceById);

export default router;
