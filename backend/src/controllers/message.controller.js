import Message from "../models/message.model.js";
import Order from "../models/order.model.js";

export const getOrderMessages = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user._id;

    console.log('Get order messages request:', { orderId, userId });

    const order = await Order.findById(orderId);
    if (!order) {
      console.log('Order not found for messages:', orderId);
      return res.status(404).json({ message: "Order not found" });
    }

    const isClient = order.clientId.toString() === userId.toString();
    const isFreelancer = order.freelancerId.toString() === userId.toString();

    console.log('User authorization check:', { isClient, isFreelancer, clientId: order.clientId, freelancerId: order.freelancerId });

    if (!isClient && !isFreelancer) {
      console.log('Unauthorized access to messages');
      return res.status(403).json({ message: "Not authorized to view these messages" });
    }

    const messages = await Message.find({ orderId })
      .populate("senderId", "fullName email profileImage")
      .populate("receiverId", "fullName email profileImage")
      .sort({ createdAt: 1 });

    console.log('Found messages:', messages.length);

    await Message.updateMany(
      {
        orderId,
        receiverId: userId,
        isRead: false,
      },
      {
        isRead: true,
        readAt: new Date(),
      }
    );

    res.status(200).json(messages);
  } catch (error) {
    console.error('Get order messages error:', error);
    res.status(500).json({ message: "Server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { message, fileUrl } = req.body;

    if (!message && !fileUrl) {
      return res.status(400).json({ message: "Message or file is required" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const isClient = order.clientId.toString() === req.user._id.toString();
    const isFreelancer = order.freelancerId.toString() === req.user._id.toString();

    if (!isClient && !isFreelancer) {
      return res.status(403).json({ message: "Not authorized to send messages for this order" });
    }

    const receiverId = isClient ? order.freelancerId : order.clientId;

    const newMessage = new Message({
      orderId,
      senderId: req.user._id,
      receiverId,
      message: message || "",
      fileUrl: fileUrl || null,
    });

    await newMessage.save();
    await newMessage.populate("senderId", "fullName email profileImage");
    await newMessage.populate("receiverId", "fullName email profileImage");

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getConversations = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ clientId: req.user._id }, { freelancerId: req.user._id }],
    })
      .populate("clientId", "fullName email profileImage")
      .populate("freelancerId", "fullName email profileImage")
      .populate("serviceId", "title")
      .sort({ updatedAt: -1 });

    const conversations = await Promise.all(
      orders.map(async (order) => {
        const lastMessage = await Message.findOne({ orderId: order._id })
          .sort({ createdAt: -1 })
          .populate("senderId", "fullName");

        const unreadCount = await Message.countDocuments({
          orderId: order._id,
          receiverId: req.user._id,
          isRead: false,
        });

        return {
          order: {
            _id: order._id,
            status: order.status,
            clientId: order.clientId,
            freelancerId: order.freelancerId,
            serviceId: order.serviceId,
            createdAt: order.createdAt,
          },
          lastMessage: lastMessage
            ? {
                message: lastMessage.message,
                senderId: lastMessage.senderId,
                createdAt: lastMessage.createdAt,
              }
            : null,
          unreadCount,
        };
      })
    );

    const activeConversations = conversations.filter((conv) => conv.lastMessage);

    res.status(200).json(activeConversations);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getUnreadCount = async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiverId: req.user._id,
      isRead: false,
    });

    res.status(200).json({ unreadCount: count });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
