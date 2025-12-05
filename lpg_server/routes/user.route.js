import express from 'express'
import { signupUser, loginUser, logoutUser, getUserProfile, updateAvatar } from '../controllers/user.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';
import { sendEmail } from '../config/nodemailer.js';

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
// send email route can be added here if needed
router.post('/send-email', sendEmail)

export default router;