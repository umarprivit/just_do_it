import express from 'express';
import { createReview, getReviewsForUser } from '../controllers/reviewController.js';
import { protect } from "../middlewares/auth.js";

const router = express.Router();

// Create review after task complete
router.post('/', protect, createReview);

// Get reviews for a specific user
router.get('/:userId', getReviewsForUser);

export default router;
