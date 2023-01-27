import mongoose from 'mongoose'

const CommentItemSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      require: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
  },
  { timestamps: true }
)

export default mongoose.model('PostComment', CommentItemSchema)
