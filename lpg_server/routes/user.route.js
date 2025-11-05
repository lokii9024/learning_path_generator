import express from 'express'
import { signupUser, loginUser, logoutUser, getUserProfile, updateAvatar } from '../controllers/user.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = express.Router();

// to signup
router.post('/signup',signupUser)
// to upload profile picture
router.patch('/upload-avatar',verifyJWT,upload.single('avatar'), updateAvatar)
// to login
router.post('/login',loginUser)
// to logout
router.post('/logout',verifyJWT,logoutUser)
// to get user profile
router.get('/profile',verifyJWT,getUserProfile)

export default router;