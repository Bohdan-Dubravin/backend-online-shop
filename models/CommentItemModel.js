import mongoose from 'mongoose';

const CommentItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('CommentItem', CommentItemSchema);
