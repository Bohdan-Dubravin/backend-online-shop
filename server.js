import express from 'express';
import cors from 'cors';
import logger from './middleware/logger.js';
import errorHandler from './middleware/errorHandler.js';
import mongoose from 'mongoose';
import { connectDB } from './config/dbConnection.js';
import authRouter from './routes/authRoute.js';
import cookieParser from 'cookie-parser';
import postRouter from './routes/postRoute.js';

connectDB();
const app = express();
app.use(express.json());
app.use(logger);
app.use(cors());
app.use(cookieParser());

app.use('/auth', authRouter);
app.use('/posts', postRouter);
app.use(errorHandler);

mongoose.connection.once('open', () => {
  console.log('Connected to DB');
  app.listen(5000, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Connected to 5000 port');
    }
  });
});

mongoose.connection.on('error', (err) => {
  console.log(err);
});
