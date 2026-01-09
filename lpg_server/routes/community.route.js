import express from 'express';
import { addLearningPathToCommunity } from '../controllers/community.controller';

const router = express.Router();

router.post('/add-path', addLearningPathToCommunity);

export default router;