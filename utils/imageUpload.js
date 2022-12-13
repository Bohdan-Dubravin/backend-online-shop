import multer from 'multer'
import storage from '../config/storageConfig.js'
import { Router } from 'express'
import checkAuth from '../middleware/checkAuth.js'
import cloudinary from '../config/storageConfig.js'
const upload = multer({ storage })

const uploadRouter = new Router()

uploadRouter.post('/', async (req, res, next) => {
  try {
    console.log(req.body)
    const result = await cloudinary.uploader.upload(req.body, options)
    console.log(result)
    res.status(200).json({ message: 'ok' })
  } catch (error) {
    next(error)
  }
})

export default uploadRouter
