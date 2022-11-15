import multer from 'multer';
import storage from '../config/imgConfig.js';
import { Router } from 'express';
import checkAuth from '../middleware/checkAuth.js';

const upload = multer({ storage });

const uploadRouter = new Router();

uploadRouter.post('/', checkAuth, upload.single('image'), (req, res, next) => {
  try {
    res.status(200).json({ url: `/uploads/${req.file.originalname}` });
  } catch (error) {
    next(error);
  }
});

export default uploadRouter;
