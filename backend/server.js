import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";

import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev")); // Logging middleware for development

// Routes
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/transactions", transactionRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("API is running...");
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: "Not Found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("error:", err.stack);
  res.status(500).json({ error: "Server Error" });
});

// Connect DB + start server
const startServer = async () => {
  const clientOptions = {
    serverApi: { version: "1", strict: true, deprecationErrors: true },
  };
  try {
    await mongoose.connect(process.env.MONGO_URI, clientOptions);
    console.log("MongoDB connected Succesfully");

    const PORT = 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("DB connection failed:", err.message);
    process.exit(1);
  }
};

startServer();
