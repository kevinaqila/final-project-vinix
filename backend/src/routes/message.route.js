import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
    getOrderMessages,
    sendMessage,
    getConversations,
    getUnreadCount,
} from "../controllers/message.controller.js";

const router = express.Router();

// All routes require authentication
router.use(protectRoute);

// Get all conversations
router.get("/conversations", getConversations);

// Get unread count
router.get("/unread-count", getUnreadCount);

// Get messages for an order
router.get("/:orderId", getOrderMessages);

// Send a message
router.post("/:orderId", sendMessage);

export default router;
