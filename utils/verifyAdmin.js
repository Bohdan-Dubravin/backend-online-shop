import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();

const verifyAdmin = (req) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith('Bearer ') || !authHeader) {
    throw new Error('Unauthorized');
  }

  const token = authHeader.replace(/Bearer\s?/, '');

  jwt.verify(token, process.env.JWT_TOKEN, (err, decoded) => {
    if (err) {
      throw new Error('Forbidden');
    }
    if (decoded.UserInfo.role !== 'admin') {
      throw new Error('Require admin permission');
    }
  });
};

export default verifyAdmin;
