import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import { v2 as cloudinary } from 'cloudinary'
import * as dotenv from 'dotenv'
dotenv.config()

export default cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
})

// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: 'CloudinaryDemo',
//     allowedFormats: ['jpeg', 'png', 'jpg'],
//   },
// })

// const storage = multer.diskStorage({
//   destination: (_, __, callback) => {
//     callback(null, 'uploads')
//   },
//   filename: (_, file, callback) => {
//     callback(null, file.originalname)
//   },
// })

// export default storage
