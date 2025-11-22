import Order from "../models/order.model.js";
import Service from "../models/service.model.js";
import User from "../models/user.model.js";

export const createOrder = async (req, res) => {
  try {
    const clientId = req.user._id;
    const { serviceId, packageType, requirements } = req.body;

    if (req.user.role !== "client") {
      return res.status(403).json({ message: "Only clients can create orders" });
    }

    if (!serviceId || !packageType) {
      return res.status(400).json({ message: "Service and package type are required" });
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const packageDetails = service.packages[packageType];
    if (!packageDetails) {
      return res.status(400).json({ message: "Invalid package type" });
    }

    const escrowAmount = packageDetails.price;
    const platformFee = escrowAmount * 0.1;
    const freelancerEarnings = escrowAmount - platformFee;

    const order = await Order.create({
      clientId,
      freelancerId: service.freelancerId,
      serviceId,
      packageType,
      packageDetails,
      requirements,
      escrowAmount,
      platformFee,
      freelancerEarnings,
      paymentStatus: "paid",
      status: "pending",
    });

    service.totalOrders += 1;
    await service.save();

    const populatedOrder = await Order.findById(order._id)
      .populate("clientId", "fullName email")
      .populate("freelancerId", "fullName email")
      .populate("serviceId", "title");

    res.status(201).json({
      message: "Order created successfully. Payment held in escrow.",
      order: populatedOrder,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const { role } = req.query;

    let query = {};
    if (role === "client") {
      query.clientId = userId;
    } else if (role === "freelancer") {
      query.freelancerId = userId;
    } else {
      query.$or = [{ clientId: userId }, { freelancerId: userId }];
    }

    const orders = await Order.find(query)
      .populate("clientId", "fullName email profileImage")
      .populate("freelancerId", "fullName email profileImage")
      .populate("serviceId", "title category")
      .populate("reviewId")
      .sort({ createdAt: -1 });

    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const order = await Order.findById(id)
      .populate("clientId", "fullName email profileImage")
      .populate("freelancerId", "fullName email profileImage")
      .populate("serviceId", "title category packages")
      .populate("reviewId");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (
      order.clientId._id.toString() !== userId.toString() &&
      order.freelancerId._id.toString() !== userId.toString()
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.status(200).json({ order });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const acceptOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const freelancerId = req.user._id;

    if (req.user.role !== "freelancer") {
      return res.status(403).json({ message: "Only freelancers can accept orders" });
    }

    const order = await Order.findOne({ _id: id, freelancerId });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== "pending") {
      return res.status(400).json({ message: "Order cannot be accepted" });
    }

    order.status = "in-progress";
    order.acceptedAt = new Date();
    await order.save();

    res.status(200).json({
      message: "Order accepted successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const submitWork = async (req, res) => {
  try {
    const { id } = req.params;
    const freelancerId = req.user._id;

    if (req.user.role !== "freelancer") {
      return res.status(403).json({ message: "Only freelancers can submit work" });
    }

    const order = await Order.findOne({ _id: id, freelancerId });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (!["in-progress", "revision-requested"].includes(order.status)) {
      return res.status(400).json({ message: "Order must be in progress or revision requested to submit" });
    }

    order.status = "submitted";
    order.submittedAt = new Date();
    await order.save();

    const populatedOrder = await Order.findById(id)
      .populate("clientId", "fullName email profileImage")
      .populate("freelancerId", "fullName email profileImage")
      .populate("serviceId", "title category packages");

    res.status(200).json({
      message: "Work submitted successfully",
      order: populatedOrder,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const requestRevision = async (req, res) => {
  try {
    const { id } = req.params;
    const clientId = req.user._id;
    const { message } = req.body;

    if (req.user.role !== "client") {
      return res.status(403).json({ message: "Only clients can request revisions" });
    }

    const order = await Order.findOne({ _id: id, clientId });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== "submitted") {
      return res.status(400).json({ message: "Order must be submitted to request revision" });
    }

    if (order.revisionCount >= order.packageDetails.revisions) {
      return res.status(400).json({ message: "Revision limit reached" });
    }

    order.status = "revision-requested";
    order.revisionCount += 1;
    order.revisionRequests.push({
      message,
      requestedAt: new Date(),
    });
    await order.save();

    const populatedOrder = await Order.findById(id)
      .populate("clientId", "fullName email profileImage")
      .populate("freelancerId", "fullName email profileImage")
      .populate("serviceId", "title category packages");

    res.status(200).json({
      message: "Revision requested",
      order: populatedOrder,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const approveOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const clientId = req.user._id;

    if (req.user.role !== "client") {
      return res.status(403).json({ message: "Only clients can approve orders" });
    }

    const order = await Order.findOne({ _id: id, clientId });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== "submitted") {
      return res.status(400).json({ message: "Order must be submitted to approve" });
    }

    if (order.escrowReleased) {
      return res.status(400).json({ message: "Payment already released" });
    }

    order.status = "completed";
    order.completedAt = new Date();
    order.escrowReleased = true;
    order.paymentStatus = "released";
    await order.save();

    await User.findByIdAndUpdate(order.freelancerId, {
      $inc: {
        walletBalance: order.freelancerEarnings,
        totalEarnings: order.freelancerEarnings,
      },
    });

    const populatedOrder = await Order.findById(id)
      .populate("clientId", "fullName email profileImage")
      .populate("freelancerId", "fullName email profileImage")
      .populate("serviceId", "title category packages");

    res.status(200).json({
      message: "Payment released to freelancer",
      order: populatedOrder,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const uploadOrderFiles = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    console.log("Order found:", {
      orderId: order._id,
      clientId: order.clientId,
      freelancerId: order.freelancerId,
      userId,
    });

    if (order.clientId.toString() !== userId.toString() && order.freelancerId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const uploadedFiles = files.map((file) => ({
      filename: file.originalname,
      url: file.path || `/uploads/${file.filename}`, // Use Cloudinary URL in production, local path in development
      uploadedAt: new Date(),
    }));

    if (order.clientId.toString() === userId.toString()) {
      order.clientFiles.push(...uploadedFiles);
    } else {
      order.freelancerFiles.push(...uploadedFiles);
    }

    await order.save();

    const populatedOrder = await Order.findById(id)
      .populate("clientId", "fullName email profileImage")
      .populate("freelancerId", "fullName email profileImage")
      .populate("serviceId", "title category packages");

    res.status(200).json({
      message: "Files uploaded successfully",
      files: uploadedFiles,
      order: populatedOrder,
    });
  } catch (error) {
    console.error("Upload order files error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
