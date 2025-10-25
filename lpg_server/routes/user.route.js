import express from 'express'
import { signupUser } from '../controllers/user.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = express.Router();

// to signup
router.post('/signup',signupUser)
// to upload profile picture
router.post('/upload-avatar',verifyJWT,upload.single('avatar'), )
// to login
router.post('login')
// to logout
router.post('/logout')
// to get user profile
router.get('/profile')

export default router;