import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  searchProviders,
  verifyOtpAndCreateUser,
} from "../controllers/userController.js";

import { protect } from "../middlewares/auth.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-otp", verifyOtpAndCreateUser);

// Protected routes
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

// Search providers (public or protected based on your choice)
router.get("/providers", searchProviders);

export default router;
