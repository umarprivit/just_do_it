import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String, required: true },
    location: { type: String },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    provider: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    budget: { type: Number },
    status: {
      type: String,
      enum: [
        "open",
        "pending",
        "accepted",
        "rescheduled",
        "in-progress",
        "completed",
        "cancelled",
      ],
      default: "open",
    },
    scheduledAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;
