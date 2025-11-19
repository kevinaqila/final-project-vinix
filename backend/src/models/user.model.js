import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ["client", "freelancer", "both"],
      default: null,
    },
    isProfileComplete: {
      type: Boolean,
      default: false,
    },
    clientType: {
      type: String,
      enum: ["business", "personal"],
      default: null,
    },
    // Client-specific fields
    businessName: {
      type: String,
      trim: true,
    },
    businessType: {
      type: String,
      trim: true,
    },
    riskTolerance: {
      type: String,
      enum: ["low", "medium", "high"],
    },
    investmentExperience: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
    },
    timeHorizon: {
      type: String,
      enum: ["short", "medium", "long"],
    },
    primaryGoal: {
      type: String,
      enum: ["retirement", "wealth", "education", "emergency", "debt"],
    },
    // Freelancer-specific fields
    education: [
      {
        type: String,
        trim: true,
      },
    ],
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    bio: {
      type: String,
      trim: true,
    },
    certifications: [
      {
        name: String,
        issuer: String,
        year: Number,
      },
    ],
    experience: [
      {
        title: String,
        company: String,
        duration: String,
        description: String,
      },
    ],
    // Wallet & earnings (for freelancers)
    walletBalance: {
      type: Number,
      default: 0,
    },
    totalEarnings: {
      type: Number,
      default: 0,
    },
    // Profile image
    profileImage: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
