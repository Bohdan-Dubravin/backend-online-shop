import jwt from 'jsonwebtoken'
import Token from '../models/tokenModel.js'
import * as dotenv from 'dotenv'
dotenv.config()

class TokenService {
  generateToken(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: '30d',
    })

    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: '30d',
    })

    return {
      accessToken,
      refreshToken,
    }
  }

  async saveToken(userId, refreshToken) {
    const tokenData = await Token.findOne({ user: userId })

    if (tokenData) {
      tokenData.refreshToken = refreshToken
      return tokenData.save()
    }

    const token = await Token.create({ user: userId, refreshToken })

    return token
  }

  async removeToken(refreshToken) {
    const tokenData = await Token.deleteOne({ refreshToken })

    return tokenData
  }

  async validateAccessToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
      return userData
    } catch (error) {
      return null
    }
  }

  async validateRefreshToken(refreshToken) {
    try {
      const userData = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      )
      return userData
    } catch (error) {
      return null
    }
  }

  async findRefreshToken(refreshToken) {
    const tokenData = await Token.findOne({ refreshToken })

    return tokenData
  }
}

export default new TokenService()
