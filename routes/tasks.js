import express from 'express';
import { createTask, getAllStatus, getAllTaskPriority, getAllTasks } from '../controllers/tasksController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';


const router = express.Router();

router.post('/tasks/:id',authMiddleware, createTask);
router.get('/tasks/:id',authMiddleware,  getAllTasks);
router.get('/tasks/priorities',authMiddleware,  getAllTaskPriority);
router.get('/tasks/status',authMiddleware,  getAllStatus);

export default router;