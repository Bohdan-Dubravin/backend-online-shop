import { Router } from 'express'
import { v2 as cloudinary } from 'cloudinary'

const uploadRouter = new Router()

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
})

uploadRouter.post('/', async (req, res, next) => {
  try {
    const result = await cloudinary.uploader.upload(
      req.files.image.tempFilePath,
      {
        public_id: `${Date.now()}`,
        resource_type: 'auto',
        folder: 'images',
      }
    )
    res.status(200).json(result.url)
  } catch (error) {
    next(error)
  }
})

export default uploadRouter
