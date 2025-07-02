import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    location: { type: String, required: true },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    provider: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    budget: { type: Number, required: true },
    deadline: { type: Date, required: true },
    skillsRequired: [{ type: String }],
    urgency: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    bidders: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },

        bidDate: { type: Date, default: Date.now },
      },
    ],
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: [
        "open",
        "pending",
        "assigned",
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
