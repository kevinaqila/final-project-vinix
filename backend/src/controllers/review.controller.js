import Review from "../models/review.model.js";
import Order from "../models/order.model.js";
import Service from "../models/service.model.js";

export const createReview = async (req, res) => {
  try {
    const clientId = req.user._id;
    const { orderId, rating, comment } = req.body;

    if (!orderId || !rating || !comment) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const order = await Order.findOne({ _id: orderId, clientId });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (!order.escrowReleased) {
      return res.status(400).json({ message: "Cannot review before payment is released" });
    }

    const existingReview = await Review.findOne({ orderId });
    if (existingReview) {
      return res.status(400).json({ message: "Order already reviewed" });
    }

    const review = await Review.create({
      orderId,
      serviceId: order.serviceId,
      clientId,
      freelancerId: order.freelancerId,
      rating,
      comment,
    });

    order.reviewId = review._id;
    await order.save();

    const service = await Service.findById(order.serviceId);
    const reviews = await Review.find({ serviceId: order.serviceId });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    service.averageRating = avgRating;
    service.totalReviews = reviews.length;
    await service.save();

    const populatedReview = await Review.findById(review._id)
      .populate('clientId', 'fullName profileImage')
      .populate('freelancerId', 'fullName');

    res.status(201).json({
      message: "Review submitted successfully",
      review: populatedReview,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getServiceReviews = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const reviews = await Review.find({ serviceId })
      .populate('clientId', 'fullName profileImage')
      .sort({ createdAt: -1 });

    res.status(200).json({ reviews });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getFreelancerReviews = async (req, res) => {
  try {
    const { freelancerId } = req.params;

    const reviews = await Review.find({ freelancerId })
      .populate('clientId', 'fullName profileImage')
      .populate('serviceId', 'title')
      .sort({ createdAt: -1 });

    res.status(200).json({ reviews });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const respondToReview = async (req, res) => {
  try {
    const { id } = req.params;
    const freelancerId = req.user._id;
    const { message } = req.body;

    const review = await Review.findOne({ _id: id, freelancerId });
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    review.response = {
      message,
      respondedAt: new Date(),
    };
    await review.save();

    res.status(200).json({
      message: "Response added successfully",
      review,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
