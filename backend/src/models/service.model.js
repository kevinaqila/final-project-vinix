import mongoose from "mongoose";

const packageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        enum: ['basic', 'standard', 'premium'],
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    description: {
        type: String,
        required: true,
    },
    deliveryTime: {
        type: Number, // in days
        required: true,
    },
    features: [{
        type: String,
    }],
    revisions: {
        type: Number,
        default: 0, // 0 means no revisions
    },
});

const serviceSchema = new mongoose.Schema({
    freelancerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: String,
        required: true,
        enum: [
            'Laporan Keuangan',
            'Pembukuan',
            'Pajak',
            'Konsultasi Keuangan',
            'Audit',
            'Payroll',
            'Lainnya',
        ],
    },
    description: {
        type: String,
        required: true,
    },
    clientUploads: [{
        type: String,
        trim: true,
    }],
    freelancerDelivers: [{
        type: String,
        trim: true,
    }],
    packages: {
        basic: {
            type: packageSchema,
            required: true,
        },
        standard: {
            type: packageSchema,
            required: true,
        },
        premium: {
            type: packageSchema,
            required: true,
        },
    },
    images: [{
        type: String,
    }],
    status: {
        type: String,
        enum: ['active', 'paused', 'draft'],
        default: 'active',
    },
    totalOrders: {
        type: Number,
        default: 0,
    },
    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
    totalReviews: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

// Index for search
serviceSchema.index({ title: 'text', description: 'text' });

const Service = mongoose.model('Service', serviceSchema);
export default Service;
