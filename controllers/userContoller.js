import authService from '../services/authService.js';
import jwt from 'jsonwebtoken';

class UserController {
  async register(req, res) {
    try {
      const newUser = await authService.registerUser(req.body);

      res
        .status(200)
        .json({ message: `New User: ${newUser.username} created` });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async login(req, res) {
    try {
      const foundUser = await authService.login(req.body);

      const token = jwt.sign(
        {
          userInfo: {
            id: foundUser._id,
            username: foundUser.username,
            role: foundUser.role,
          },
        },
        process.env.JWT_TOKEN,
        {
          expiresIn: '20d',
        }
      );

      const refreshToken = jwt.sign(
        {
          username: foundUser.userName,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '30d' }
      );

      res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({ token });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async logout(req, res) {
    try {
    } catch (error) {}
  }

  async refresh(req, res) {
    try {
    } catch (error) {}
  }
}

export default new UserController();
