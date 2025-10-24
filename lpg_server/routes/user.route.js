import express from 'express'

const router = express.Router();

// to signup
router.post('/signup')
// to login
router.post('login')
// to logout
router.post('/logout')
// to get user profile
router.get('/profile')

export default router;