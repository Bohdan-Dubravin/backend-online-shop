import { Router } from 'express';
import authController from '../controllers/authController.js';
import checkAuth from '../middleware/checkAuth.js';
import loginLimiter from '../middleware/loginLimit.js';

const postRouter = new Router();

postRouter.get('/posts', authController.refresh);
postRouter.post('/create', checkAuth, authController.register);
postRouter.post('/update/:id', loginLimiter, authController.login);
postRouter.delete('/delete/:id', authController.logout);
postRouter.get('/users', checkAuth, authController.getUsers);

export default postRouter;
