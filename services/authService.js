import UserModel from '../models/UserModel.js'
import bcrypt from 'bcryptjs'
import { v4 as uuid } from 'uuid'
import * as dotenv from 'dotenv'
import mailService from './mailService.js'
import tokenService from './tokenService.js'
import UserDto from '../dtos/userDto.js'
import ApiError from '../utils/apiError.js'
dotenv.config()

class AuthService {
  async registerUser(user) {
    const { username, email, avatarUrl, role } = user
    console.log(user)
    if (!username || !user.password || !email) {
      throw ApiError.BadRequest('Required all fields')
    }

    const isExist = await UserModel.findOne({
      $or: [{ username }, { email }],
    })
      .lean()
      .exec()

    if (isExist) {
      throw ApiError.BadRequest('User or email already exist')
    }

    const hashedPassword = await bcrypt.hash(user.password, 10)
    const activationLink = uuid()
    const newUser = await UserModel.create({
      username,
      password: hashedPassword,
      email,
      avatarUrl,
      role,
      activationLink,
    })

    // await mailService.sendActivationMail(email, activationLink)

    const userParam = new UserDto(newUser)

    const tokens = tokenService.generateToken({ ...userParam })

    await tokenService.saveToken(userParam.id, tokens.refreshToken)

    const createdUser = await UserModel.findById(
      userParam.id,
      '-password -activationLink'
    )
    return { ...tokens, user: createdUser }
  }

  async login(credentials) {
    const { username, password } = credentials
    if (!username || !password) {
      throw ApiError.BadRequest('Required all fields')
    }

    const foundUser = await UserModel.findOne({ username })

    if (!foundUser) {
      throw ApiError.BadRequest('User does not exist')
    }

    const match = await bcrypt.compare(password, foundUser.password)

    if (!match) {
      throw ApiError.BadRequest('Invalid password')
    }

    const userParam = new UserDto(foundUser)

    const tokens = tokenService.generateToken({ ...userParam })

    await tokenService.saveToken(userParam.id, tokens.refreshToken)
    const createdUser = await UserModel.findById(
      userParam.id,
      '-password -activationLink'
    )

    return { ...tokens, user: createdUser }
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken)

    return token
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError()
    }
    const userData = await tokenService.validateAccessToken(refreshToken)
    // const tokenDb = await tokenService.findRefreshToken(refreshToken);

    if (!userData) {
      throw ApiError.UnauthorizedError()
    }

    const foundUser = await UserModel.findById(
      userData.id,
      '-password -activationLink'
    )

    if (!foundUser) {
      throw ApiError.UnauthorizedError()
    }

    const userParam = new UserDto(foundUser)

    const tokens = tokenService.generateToken({ ...userParam })

    await tokenService.saveToken(userParam.id, tokens.refreshToken)

    return { ...tokens, ...foundUser._doc }
  }

  async getAllUsers() {
    const users = await UserModel.find()

    return users
  }

  async deleteUser(id) {
    const user = await UserModel.findByIdAndDelete(id)

    if (!user) {
      throw ApiError.BadRequest('User note found')
    }

    return { message: 'User Deleted' }
  }
}

export default new AuthService()
