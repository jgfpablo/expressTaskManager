import express from 'express';
import { addMemberToProject, createProject, getAllProjects, getProjectById, removeMemberFromProject } from '../controllers/projectsController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/projects/new', authMiddleware, createProject);
router.get('/projects', authMiddleware, getAllProjects);
router.get('/projects/:id', authMiddleware, getProjectById);
router.post('/projects/addMembers',authMiddleware, addMemberToProject);
router.delete('/projects/:projectId/members/:userId', authMiddleware, removeMemberFromProject);

export default router;