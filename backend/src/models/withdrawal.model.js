import mongoose from "mongoose";

const withdrawalSchema = new mongoose.Schema(
  {
    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 100000, // Minimum 100k
    },
    adminFee: {
      type: Number,
      default: 7000, // Rp 7.000 admin fee
    },
    bankName: {
      type: String,
      required: true,
    },
    accountNumber: {
      type: String,
      required: true,
    },
    accountName: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "rejected"],
      default: "pending",
    },
    notes: {
      type: String,
    },
    processedAt: {
      type: Date,
    },
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    autoCompleteAt: {
      type: Date,
      description: "Waktu saat withdrawal akan otomatis completed (5 menit dari createdAt untuk testing)",
    },
    isAutoCompleted: {
      type: Boolean,
      default: false,
      description: "Menandakan apakah withdrawal sudah auto-completed",
    },
  },
  { timestamps: true }
);

const Withdrawal = mongoose.model("Withdrawal", withdrawalSchema);
export default Withdrawal;
