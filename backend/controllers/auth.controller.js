import jwt from 'jsonwebtoken';

import User from '../models/user.model.js';
import BlacklistedToken from '../models/blacklistedmodel.model.js';

import { 
  successResponse,
  handleServerError,
  sendValidationError,
  sendUnauthorizedResponse,
  sendForbiddenResponse,
  sendNotFoundResponse,
  sendConflictingResponse
 } from '../utils/response.utils.js';

import { generateJWTToken } from '../lib/generators/accountnumber.generator.js';
import { phoneNoValidation } from '../lib/validators/auth.validation.js';

export const signup = async (req, res)=>{
  try {
    const { name, email, password, phoneNo } = req.body;

    if(!name || !email || !password || !phoneNo) {
      return sendValidationError(res, 'All fields are required');
    }

    const existingUser = await User.findOne({ email });
    if(existingUser) {
      return sendConflictingResponse(res, 'Email aready in use');
    }

    const user = new User({
      name,
      email,
      password,
      phoneNo
    });

    await user.save();

    const token = generateJWTToken(user._id);

    const userData = {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneNo: user.phoneNo
      },
      token
    };

    return successResponse(res, 201, 'User Created Successfully', userData);
  }catch(error) {
    return handleServerError(res, error, 500, 'Invalid');
  }
}

export const login = async (req, res) => {
  try {
    const { phoneNo, password } = req.body;

    if(!phoneNo || !password) {
      return sendValidationError(res, 'All Fields are mandatory');
    }

    const isPhoneNoValid = phoneNoValidation(phoneNo);
    if(!isPhoneNoValid) {
      return sendValidationError(res, 'Phone Number is invalid');
    }

    const user = await User.findOne({phoneNo});
    if(!user||!user.isActive) {
      return sendUnauthorizedResponse(res, 'Invalid Credentials');
    }

    const isPasswordValid = await user.comparePassword(password);
    if(!isPasswordValid) {
      return sendUnauthorizedResponse(res, 'Invalid Credentials');
    }

    const token = generateJWTToken(user._id);

    const userData = {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token
    };

    return successResponse(res, 200, 'Login Successful', userData);
  }catch (error) {
    return handleServerError(res, 500, 'Error Logging in', error.message);
  }
}

export const logout = async (req, res)=>{
  try {
    const token = req.token;

    if(!token) {
      return sendNotFoundResponse(res, 'Token not Found');
    }
    
    const decoded = jwt.decode(token);
    const expiresAt = new Date(decoded.exp * 1000);

    await BlacklistedToken.create({
      token,
      expiresAt
    });

    return successResponse(res, 200, 'Logged out Successfully');
  }catch(error) {
    return handleServerError(res, 500, 'Error Logging out', error.message);
  }
}