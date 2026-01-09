import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static('uploads')) // serve static files from uploads directory
app.use(cookieParser())

//home
app.get('/', (req,res) => {
    res.json({message: "Hello!!, Welcome to Learning Path Generator API"})
})

//import Routes
import userRoutes from './routes/user.route.js'
import communityRoutes from './routes/community.route.js'
import pathRoutes from './routes/learningPaths.route.js'
import paymentRoutes from './routes/payment.route.js'

// Routes declaration
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/paths', pathRoutes)
app.use('/api/v1/payments', paymentRoutes)
app.use('/api/v1/community', communityRoutes)

export {app}