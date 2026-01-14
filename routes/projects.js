import express from 'express';
import { createProject, getAllProjects, getProjectById } from '../controllers/projectsController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/projects/new', authMiddleware, createProject);
router.get('/projects', authMiddleware, getAllProjects);
router.get('/projects/:id', authMiddleware, getProjectById);

export default router;