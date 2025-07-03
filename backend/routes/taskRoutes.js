import express from 'express';
import { 
  createTask, 
  getTask,
  bookProvider, 
  acceptBooking, 
  providerUpdateStatus, 
  completeTask,
  addBid,
  assignTask,
  getTaskBids,
  getMyBids,
  getTaskStats,
  getPlatformStats,
  getAllTasks,
  getMyTasks,
  updateTask,
  deleteTask
} from '../controllers/taskController.js';
import { protect } from "../middlewares/auth.js";

const router = express.Router();

// Get all tasks with pagination and filtering
router.get('/', getAllTasks);

// Get task-related data (specific routes first)
router.get('/my-bids', protect, getMyBids);
router.get('/stats', protect, getTaskStats);
router.get('/my-tasks', protect, getMyTasks);

// Get single task by ID
router.get('/:id', getTask);

// Get task bids
router.get('/:id/bids', protect, getTaskBids);
router.post('/', protect, createTask);
router.post('/:id/assign', protect, assignTask);
router.put('/:id', protect, updateTask);
router.delete('/:id', protect, deleteTask);

// Provider actions
router.put('/:id/accept', protect, acceptBooking);
router.put('/:id/status', protect, providerUpdateStatus);
router.post('/:id/bid', protect, addBid);

// Common actions
router.put('/:id/complete', protect, completeTask);

export default router;
