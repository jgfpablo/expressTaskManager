import express from 'express';
import { createProject, getAllProjects } from '../controllers/projectsController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/projects/new', authMiddleware, createProject);
router.get('/projects', authMiddleware, getAllProjects);

export default router;