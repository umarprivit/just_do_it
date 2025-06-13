import express from 'express';
import { createTransaction, getTransactionByTask } from '../controllers/transactionController.js';
import { protect } from "../middlewares/auth.js";

const router = express.Router();

router.post('/', protect, createTransaction);
router.get('/task/:taskId', protect, getTransactionByTask);

export default router;
