import express from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { createLearningPath } from '../controllers/learningPath.controller.js';

const router = express.Router();

// Define your learning paths routes here

// to generate a learning path
router.post('/generate', verifyJWT, createLearningPath)

// to get all learning paths for logged in user
router.get('/', )

// to get a specific learning path by ID
router.get('/:id', )

// to mark a module as completed
router.patch('/:pathId/modules/:moduleId/complete', )

// to delete a learning path
router.delete('/:id', )

export default router;