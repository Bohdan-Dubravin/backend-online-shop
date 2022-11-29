import mongoose from 'mongoose'

const ItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    images: [{ type: String, default: '' }],
    price: {
      type: Number,
      required: true,
    },
    CPU: {
      type: String,
      default: '',
    },
    GPU: {
      type: String,
      default: '',
    },
    RAM: {
      type: String,
      default: '',
    },
    storage: {
      type: String,
      default: '',
    },
    powerSupply: {
      type: String,
      default: '',
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    rating: [{ type: Number, min: 0, max: 5 }],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comment',
      },
    ],
  },
  { timestamps: true }
)

export default mongoose.model('Item', ItemSchema)
