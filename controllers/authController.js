import authService from '../services/authService.js'
import { validationResult } from 'express-validator'
import ApiError from '../utils/apiError.js'

class AuthController {
  async register(req, res, next) {
    try {
      const validation = validationResult(req)

      if (!validation.isEmpty()) {
        return next(ApiError.BadRequest('Validation error', validation.array()))
      }

      const userData = await authService.registerUser(req.body)

      res.cookie('refreshToken', userData.refreshToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
        sameSite: 'None',
        secure: true,
      })

      res.status(200).json(userData)
    } catch (error) {
      next(error)
    }
  }

  async login(req, res, next) {
    try {
      const foundUser = await authService.login(req.body)

      const { password, ...userData } = foundUser
      res.session.refreshToken = userData.refreshToken
      res.cookie('refreshToken', userData.refreshToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
        sameSite: 'None',
        secure: true,
      })

      res.status(200).json(userData)
    } catch (error) {
      next(error)
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies
      const token = await authService.logout(refreshToken)

      res.clearCookie('refreshToken')

      return res.json(token)
    } catch (error) {
      next(error)
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies

      const userData = await authService.refresh(refreshToken)
      res.cookie('refreshToken', userData.refreshToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
        sameSite: 'None',
        secure: true,
      })

      res.status(200).json(userData)
    } catch (error) {
      next(error)
    }
  }

  async getUsers(req, res, next) {
    try {
      const users = await authService.getAllUsers()

      return res.json(users)
    } catch (error) {
      next(error)
    }
  }

  async deleteUser(req, res, next) {
    try {
      const { id } = req.params
      const deleted = await authService.deleteUser(id)

      res.status(200).json(deleted)
    } catch (error) {
      next(error)
    }
  }
}

export default new AuthController()
