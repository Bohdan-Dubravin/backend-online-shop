import express from 'express'
import cors from 'cors'
import logger from './utils/logger.js'
import errorHandler from './middleware/errorHandler.js'
import mongoose from 'mongoose'
import { connectDB } from './config/dbConnection.js'
import authRouter from './routes/authRoute.js'
import cookieParser from 'cookie-parser'
import postRouter from './routes/postRoute.js'
import uploadRouter from './utils/imageUpload.js'
import itemRouter from './routes/itemRoute.js'
import errorLogger from './middleware/errorLogger.js'

const port = process.env.PORT || 5000

const corsOptions = {
  origin: '*',
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
}

connectDB()
const app = express()

app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())
app.use(logger)

app.use('/uploads', express.static('uploads'), uploadRouter)
app.use('/auth', authRouter)
app.use('/upload', uploadRouter)
app.use('/posts', postRouter)
app.use('/items', itemRouter)
app.use(errorLogger)
app.use(errorHandler)
app.use('/*', (req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

mongoose.connection.once('open', () => {
  console.log('Connected to DB')
  app.listen(port, (err) => {
    if (err) {
      console.log(err)
    } else {
      console.log('Connected to 5000 port')
    }
  })
})

mongoose.connection.on('error', (err) => {
  console.log(err)
})
