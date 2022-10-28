import { Router } from 'express';
import authController from '../controllers/authController.js';
import loginLimiter from '../middleware/loginLimit.js';

const userRouter = new Router();

userRouter.post('/register', loginLimiter, authController.register);
userRouter.post('/login', loginLimiter, authController.login);
// authRouter.get('/getme', authController.getMe);
userRouter.post('/logout', authController.logout);

export default userRouter;