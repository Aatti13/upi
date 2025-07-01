import jwt from 'jsonwebtoken';

import User from '../models/user.model.js';
import BlacklistedToken from '../models/blacklistedmodel.model.js';

import { sendUnauthorizedResponse, handleServerError } from '../utils/response.utils.js';

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if(!token) {
      return sendUnauthorizedResponse(res, 'Access Token Required');
    }

    const blacklistedtoken = await BlacklistedToken.findOne({token});
    if(blacklistedtoken) {
      return sendUnauthorizedResponse(res, 'Token has been invalidated');
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: "Invalid or expired token"
        });
      }
      req.user = user; // Add user info to request
      req.token = token
      next();
    });
  }catch(error) {
    if (error.name === 'JsonWebTokenError') {
      return sendUnauthorizedResponse(res, 'Invalid Token');
    }
    if (error.name === 'TokenExpiredError') {
      return sendUnauthorizedResponse(res, 'Token Expired');
    }
    return handleServerError(res, 500, 'Authentication Error', error.message);
  }
}