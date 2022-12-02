import { Router } from 'express'
import authController from '../controllers/authController.js'
import checkAuth from '../middleware/checkAuth.js'
import checkRole from '../middleware/checkRole.js'
import loginLimiter from '../middleware/loginLimit.js'
import { registerValidation } from '../validations/Validations.js'

const authRouter = new Router()

authRouter.post(
  '/register',
  loginLimiter,
  registerValidation,
  authController.register
)
authRouter.post('/login', loginLimiter, authController.login)
authRouter.post('/logout', authController.logout)
authRouter.get('/refresh', authController.refresh)
authRouter.get('/users', checkAuth, checkRole, authController.getUsers)

export default authRouter
