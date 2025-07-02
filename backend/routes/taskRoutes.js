import express from 'express';
import { 
  createTask, 
  bookProvider, 
  acceptBooking, 
  providerUpdateStatus, 
  completeTask,
  addBid,
  assignTask,
  getTaskBids,
  getMyBids,
  getTaskStats,
  getAllTasks
} from '../controllers/taskController.js';
import { protect } from "../middlewares/auth.js";

const router = express.Router();

// Get all tasks with pagination and filtering
router.get('/', getAllTasks);

// Client actions
router.post('/', protect, createTask);
router.post('/book', protect, bookProvider);
router.post('/:id/assign', protect, assignTask);

// Provider actions
router.put('/:id/accept', protect, acceptBooking);
router.put('/:id/status', protect, providerUpdateStatus);
router.post('/:id/bid', protect, addBid);

// Common actions
router.put('/:id/complete', protect, completeTask);

// Get task-related data
router.get('/:id/bids', protect, getTaskBids);
router.get('/my-bids', protect, getMyBids);
router.get('/stats', protect, getTaskStats);
router.get('/my-tasks', protect, getAllTasks);

export default router;
