import mongoose from 'mongoose'
import * as dotenv from 'dotenv'
import { MongoClient } from 'mongodb'
dotenv.config()

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB)
    // mongoose.connection.collections.users.drop()
    // mongoose.connection.collections.comments.drop()
    // mongoose.connection.collections.postcomments.drop()
    // mongoose.connection.collections.tokens.drop()
    // mongoose.connection.collections.posts.drop()
  } catch (err) {
    console.log(err)
    logEvents(
      `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
      'mongoErrLog.log'
    )
  }
}
