import express from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { createLearningPath, getLearningPaths, getLearningPathById, deleteLearningPath,markORunmarkModule } from '../controllers/learningPath.controller.js';

const router = express.Router();

// Define your learning paths routes here

// to generate a learning path
router.post('/generate', verifyJWT, createLearningPath)

// to get all learning paths for logged in user
router.get('/', verifyJWT, getLearningPaths)

// to get a specific learning path by ID
router.get('/:id', verifyJWT, getLearningPathById)

// to mark a module as completed or incompleted
router.patch('/:pathId/modules/:moduleId/complete', verifyJWT, markORunmarkModule)

// to delete a learning path
router.delete('/:id', verifyJWT, deleteLearningPath)

export default router;