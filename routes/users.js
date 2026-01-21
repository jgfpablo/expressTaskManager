import express from 'express';
import { getAllUsers, getUserById } from '../controllers/usersController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();
router.get('/users',authMiddleware, getAllUsers);
router.get('/users/:id',authMiddleware, getUserById);

export default router;