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
app.use(cookieParser())

//home
app.get('/', (req,res) => {
    res.json({message: "Hello!!, Welcome to Learning Path Generator API"})
})

//import Routes
import userRoutes from './routes/user.route.js'
import pathRoutes from './routes/learningPaths.route.js'

// Routes declaration
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/paths', pathRoutes)

export {app}