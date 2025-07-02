import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["client", "provider"], required: true },
    bio: { type: String, maxlength: 500 },
    skills: [{ type: String }], // for providers
    isVerified: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    reviewCount: [{ type: Object }],
    points: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

// Mongoose method to check password

const User = mongoose.model("User", userSchema);

export default User;
