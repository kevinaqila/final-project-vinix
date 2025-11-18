import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    freelancerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true,
    },
    packageType: {
        type: String,
        required: true,
        enum: ['basic', 'standard', 'premium'],
    },
    packageDetails: {
        price: Number,
        description: String,
        deliveryTime: Number,
        features: [String],
        revisions: Number,
    },
    requirements: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'submitted', 'revision-requested', 'completed', 'cancelled'],
        default: 'pending',
    },
    escrowAmount: {
        type: Number,
        required: true,
    },
    escrowReleased: {
        type: Boolean,
        default: false,
    },
    // File uploads
    clientFiles: [{
        filename: String,
        url: String,
        uploadedAt: {
            type: Date,
            default: Date.now,
        },
    }],
    freelancerFiles: [{
        filename: String,
        url: String,
        uploadedAt: {
            type: Date,
            default: Date.now,
        },
    }],
    // Revision tracking
    revisionCount: {
        type: Number,
        default: 0,
    },
    revisionRequests: [{
        message: String,
        requestedAt: {
            type: Date,
            default: Date.now,
        },
    }],
    // Dates
    acceptedAt: Date,
    completedAt: Date,
    cancelledAt: Date,
    // Payment simulation
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'released', 'refunded'],
        default: 'pending',
    },
    platformFee: {
        type: Number,
        default: 0,
    },
    freelancerEarnings: {
        type: Number,
        default: 0,
    },
    reviewId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
    },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;
