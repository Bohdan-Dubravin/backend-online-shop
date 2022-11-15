import mongoose from 'mongoose';

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
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Item', ItemSchema);
