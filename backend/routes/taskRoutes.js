import express from 'express';
import { 
  createTask, 
  bookProvider, 
  acceptBooking, 
  providerUpdateStatus, 
  completeTask 
} from '../controllers/taskController.js';
import { protect } from "../middlewares/auth.js";

const router = express.Router();

// Client actions
router.post('/', protect, createTask);
router.post('/book', protect, bookProvider);

// Provider actions
router.put('/:id/accept', protect, acceptBooking);
router.put('/:id/status', protect, providerUpdateStatus);

// Common actions
router.put('/:id/complete', protect, completeTask);

export default router;
