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
import UserModel from './models/UserModel.js'
import tokenModel from './models/tokenModel.js'
import PostModel from './models/PostModel.js'
import ItemModel from './models/ItemModel.js'
import CommentItemModel from './models/CommentItemModel.js'
import CommentPostSchema from './models/CommentPostSchema.js'

const corsOptions = {
  origin: 'http://localhost:3000',
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

mongoose.connection.once('open', () => {
  console.log('Connected to DB')
  app.listen(5000, (err) => {
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

// PostModel.deleteMany({});
// UserModel.deleteMany({});
// tokenModel.deleteMany({});
