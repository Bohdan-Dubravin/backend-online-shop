import tokenService from '../services/tokenService.js';
import ApiError from '../utils/apiError.js';

export default async function (req, res, next) {
  try {
    const authorization = req.body.token;

    if (!authorization) {
      return next(ApiError.UnauthorizedError());
    }

    // const authorizationHeader = req.headers.authorization;
    // if (!authorizationHeader) {
    //   return next(ApiError.UnauthorizedError());
    // }

    // const accessToken = authorizationHeader.split(' ')[1];
    // if (!accessToken) {
    //   return next(ApiError.UnauthorizedError());
    // }

    const userData = await tokenService.validateAccessToken(authorization);
    if (!userData) {
      return next(ApiError.UnauthorizedError());
    }

    req.user = userData;
    next();
  } catch (e) {
    return next(ApiError.UnauthorizedError());
  }
}
