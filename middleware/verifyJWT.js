import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.replace(/Bearer\s?/, '');

  jwt.verify(token, process.env.JWT_TOKEN, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    req.user = decoded.UserInfo.username;
    req.roles = decoded.UserInfo.role;
    req.id = decoded.UserInfo.id;

    next();
  });
};

export default verifyJWT;
