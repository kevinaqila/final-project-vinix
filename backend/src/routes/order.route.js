import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { upload, uploadOrderFiles as uploadOrderFilesMiddleware } from '../middleware/upload.middleware.js';
import {
    createOrder,
    getMyOrders,
    getOrderById,
    acceptOrder,
    submitWork,
    requestRevision,
    approveOrder,
    uploadOrderFiles,
} from '../controllers/order.controller.js';

const router = express.Router();

// All routes are protected
router.use(protectRoute);

// Specific routes MUST come before parameterized routes
router.post('/', createOrder);
router.get('/my-orders', getMyOrders); // Must be before /:id
router.post('/:id/upload', uploadOrderFilesMiddleware.array('files', 5), uploadOrderFiles);
router.put('/:id/accept', acceptOrder);
router.put('/:id/submit', submitWork);
router.put('/:id/revision', requestRevision);
router.put('/:id/approve', approveOrder);
router.get('/:id', getOrderById); // Parameterized route should be LAST

export default router;
