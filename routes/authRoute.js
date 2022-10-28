import { Router } from 'express';
import authController from '../controllers/authController.js';
import loginLimiter from '../middleware/loginLimit.js';
import { registerValidation } from '../validations/authValidation.js';

const authRouter = new Router();

authRouter.post(
  '/register',
  loginLimiter,
  registerValidation,
  authController.register
);
authRouter.post('/login', authController.login);
authRouter.post('/logout', authController.logout);
authRouter.get('/refresh', authController.refresh);
authRouter.get('/getUsers', authController.refresh);

export default authRouter;
