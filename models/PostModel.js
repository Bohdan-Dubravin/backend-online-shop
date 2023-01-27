import mongoose from 'mongoose'

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    imageUrl: {
      type: String,
    },
    text: {
      type: String,
      required: true,
    },
    tags: {
      type: Array,
      default: [],
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    dislikes: {
      type: Number,
      default: 0,
    },
    usersLiked: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    usersDisliked: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PostComment',
      },
    ],
  },

  { timestamps: true }
)

export default mongoose.model('Post', PostSchema)
