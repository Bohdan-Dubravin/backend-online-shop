import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();


export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB);
  } catch (err) {
    console.log(err);
    logEvents(
      `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
      'mongoErrLog.log'
    );
  }
};
