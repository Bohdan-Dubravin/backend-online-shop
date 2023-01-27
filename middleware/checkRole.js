import ApiError from '../utils/apiError.js'
import jwt from 'jsonwebtoken'

export default async function (req, res, next) {
  // const authHeader = req.headers.authorization || req.headers.Authorization

  try {
    const authorization = req.body.token
    if (!authorization) {
      return next(ApiError.UnauthorizedError())
    }
    // if (!authHeader?.startsWith('Bearer ') || !authHeader) {
    //   throw ApiError.UnauthorizedError()
    // }

    // const token = authHeader.replace(/Bearer\s?/, '')

    jwt.verify(authorization, process.env.JWT_ACCESS_SECRET, (err, decoded) => {
      if (err) {
        throw ApiError.UnauthorizedError()
      }
      if (!decoded.role === 'admin' || !decoded.role === 'manager') {
        throw ApiError.BadRequest('No permission')
      }

      req.body.userRole = decoded.role
      req.body.userId = decoded.id
    })
    next()
  } catch (error) {
    next(error)
  }
}
