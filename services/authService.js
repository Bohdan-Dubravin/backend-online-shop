import User from '../models/UserModel.js';
import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import * as dotenv from 'dotenv';
import mailService from './mailService.js';
import tokenService from './tokenService.js';
import UserDto from '../dtos/userDto.js';
import ApiError from '../utils/apiError.js';
dotenv.config();

class AuthService {
  async registerUser(user) {
    const { username, email, avatarURL, role } = user;
    if (!username || !user.password || !email) {
      throw ApiError.BadRequest('Required all fields');
    }

    const isExist = await User.findOne({ username }).lean().exec();

    if (isExist) {
      throw ApiError.BadRequest('User already exist');
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    const activationLink = uuid();
    const newUser = await User.create({
      username,
      password: hashedPassword,
      email,
      avatarURL,
      role,
      activationLink,
    });

    await mailService.sendActivationMail(email, activationLink);

    const userParam = new UserDto(newUser);

    const tokens = tokenService.generateToken({ ...userParam });

    await tokenService.saveToken(userParam.id, tokens.refreshToken);

    return { ...tokens, user: userParam };
  }

  async login(credentials) {
    const { username, password } = credentials;
    if (!username || !password) {
      throw ApiError.BadRequest('Required all fields');
    }

    const foundUser = await User.findOne({ username });

    if (!foundUser) {
      throw ApiError.BadRequest('User does not exist');
    }

    const match = await bcrypt.compare(password, foundUser.password);

    if (!match) {
      throw ApiError.BadRequest('Invalid password');
    }

    const userParam = new UserDto(foundUser);

    const tokens = tokenService.generateToken({ ...userParam });

    await tokenService.saveToken(userParam.id, tokens.refreshToken);

    return { ...tokens, user: userParam };
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);

    return token;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenDb = await tokenService.findRefreshToken(refreshToken);

    if (!userData || tokenDb) {
      throw ApiError.UnauthorizedError();
    }

    const foundUser = await User.findById(userData.id);
    const userParam = new UserDto(foundUser);

    const tokens = tokenService.generateToken({ ...userParam });

    await tokenService.saveToken(userParam.id, tokens.refreshToken);

    return { ...tokens, user: userParam };
  }
}

export default new AuthService();
