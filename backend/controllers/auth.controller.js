import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { AuthUtils } from '../utils/auth.utils.js';

import User from '../models/user.model.js'; 

import { 
  success,
  badRequest,
  unauthorized,
  notFound,
  conflict,
  serverError
} from '../errors/error.log.js';

import { isValidName } from '../utils/auth.utils.js';
import { getBankShortForm } from '../utils/bank.util.js';

class AuthController {
  constructor(){
    this.authUtils = new AuthUtils();
  }

  async signup(req, res) {
    try {
      const { firstname, lastname, email, phone, bankname, pin } = req.body;

      if(!firstname || !lastname || !email || !phone || !bankname || !pin) {
        return badRequest(res, 'All Fields are Compulsary');
      }

      if(!isValidName(firstname) || !isValidName(lastname)) {
        return badRequest(res, 'The Name cannot have any numbers or spl. characters');
      }

      if(bankname && !getBankShortForm(bankname)) {
        return badRequest(res, 'Invalid Bank Name, please select from the selected banks');
      }

      const existingUser = await User.findOne({
        $or: [{ email },{ phone }]
      });

      if(existingUser) {
        return conflict(res, 'User Already Exists with this Email or Mobile No.');
      }

      const hashedPin = await bcrypt.hash(pin, 12);

      const user = new User({
        firstname,
        lastname,
        email,
        phone,
        hashedPin
      });

      user.generateUpiId(bankname || 'Paytm Payments Bank');

      await user.save();

      const tokenPayload = {
        id: user._id,
        firstName: user.firstName,
        email: user.email,
      };

      const accessToken = this.authUtils.generateToken(tokenPayload);

      const refreshToken = this.authUtils.generateRefreshToken(tokenPayload);

      return success(res, 'User Registered Successfully', {
        user: {
          id: user._id,
          firstname: user.firstName,
          lastname: user.lastName,
          email: user.email,
          phone: user.phone,
          upiId: user.upiId,
          bankName: user.bankName,
          bankShortForm: user.getBankShortForm()
        },
        accessToken,
        refreshToken
      });
    }catch (error) {
      return serverError(res, error.message, 500);
    }
  }

  async signin(req, res) {
    try{
      const { identifier, pin } = req.body;

      const user = await User.findOne({
        $or: [{ email: identifier },{ phone:identifier }, { upiId:identifier }]
      })

      if(!user) {
        return notFound(res, 'User Not Found');
      }

      const isPinValid = await user.comparePin(pin);
      if(!isPinValid){
        return unauthorized(res, 'Incorrect Pin');
      }

      user.lastLogin = new Date();
      await user.save();

      const token = jwt.sign(
        {user: user._id},
        process.env.JWT_SECRET,
        {expiresIn:'7d'}
      );

      return success(res, 'User Login Successful', 
        {
          user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            upiId: user.upiId,
            bankName: user.bankName,
            bankShortForm: user.getBankShortForm(),
            kycStatus: user.kycStatus
          },
          token
        }
      );
    }catch(error){
      return serverError(res, error.message, 500);
    }
  }

  async logout(req, res) {
    
  }
}