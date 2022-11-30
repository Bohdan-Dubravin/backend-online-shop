import { Router } from 'express'
import multer from 'multer'
import storage from '../config/imgConfig'
import checkAuth from '../middleware/checkAuth'
import checkRole from '../middleware/checkRole'

const uploadRouter = new Router()

const upload = multer({ storage })

uploadRouter.post(
  '/',
  upload.single('image', (req, res) => {
    res.json({ url: `/uploads/${req.file.originalname}` })
  })
)

export default uploadRouter
