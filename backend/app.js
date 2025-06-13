import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import simulationRoutes from "./routes/simulationRoutes.js";
import decisionRoutes from "./routes/decisionRoutes.js";

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
dotenv.config();

// Routes
app.use("/api/users", userRoutes);
app.use("/api/simulations", simulationRoutes);
app.use("/api/nodes", decisionRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

async function main() {
  const clientOptions = {
    serverApi: { version: "1", strict: true, deprecationErrors: true },
  };
  try {
    await mongoose.connect(process.env.MONGO_URI, clientOptions);
    mongoose.connection.useDb("DOIT");

    console.log("You successfully connected to MongoDB!");

    //Server starts Listening
    app.listen(5000, () =>
      console.log("Server running on port http://localhost:5000")
    );
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

main().catch(console.dir);
