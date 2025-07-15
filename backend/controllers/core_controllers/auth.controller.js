import bcrypt from 'bcrypt';

import { AuthUtils } from '../../utils/auth.utils.js';

import User from '../../models/user.model.js';

import { 
  success,
  badRequest,
  unauthorized,
  notFound,
  conflict,
  serverError
} from '../../errors/error.log.js';

import { validateEmail, validatePhone } from '../../utils/validation.utils.js';

class AuthController {
  authUtils = new AuthUtils();
  async signup(req, res) {
    try {
      const { 
        firstName,
        lastName,
        email,
        phone,
        dateOfBirth,
        gender,
        address,
        pin,
        deviceInfo
      } = req.body;

      if(!firstName || !lastName || !email || !phone || !pin) {
        return badRequest(res, 'All Fields are Mandatory');
      }

      if(!validateEmail(email)) {
        return badRequest(res, 'Invalid Email Format');
      }

      if(!validatePhone(phone)) {
        return badRequest(res, 'Invalid Phone Number');
      }

      const existingUser = await User.findOne({
        $or: [{ email }, { phone }]
      });

      if(existingUser) {
        return conflict(res, 'User with this email, phone or UPI ID already exists');
      }

      const salt = await bcrypt.genSalt(12);
      const hashedPin = await bcrypt.hash(pin, salt);

      const deviceFingerPrint = this.authUtils.generateDeviceFingerprint(req);

      const newUser = new User({
        firstName,
        lastName,
        email,
        phone,
        bankName,
        pin: hashedPin,
        personalDetails: {
          dateOfBirth,
          gender,
          address
        },
        devices: [{
          deviceId: deviceInfo.deviceId,
          deviceFingerPrint,
          deviceName: deviceInfo.deviceName || 'Unknown Device',
          deviceType: deviceInfo.deviceType || 'Unknown Type',
          osType: deviceInfo.deviceOS || 'Unknown OS',
          osVersion: deviceInfo.osVersion || 'Unknown Version',
          appVersion: deviceInfo.appVersion || 'Unknown Version',
          ipAddress: req.ip || req.connection?.remoteAddress || 'Unknown IP',
          location: deviceInfo.location || 'Unknown Location'
        }]
      });

      const otpResult = await this.authUtils.sendOTPEmail(email);
      if(!otpResult.success) {
        return serverError(res, 'Failed to send OTP');
      }

      newUser.upiRegistration.verificationCode = otpResult.otp;
      newUser.upiRegistration.verificationExpiry = otpResult.expiry;
      await newUser.save();

      return success(res, 'User registered successfully. Please verify your email.', {
        userId: newUser._id,
        email: newUser.email,
        phone: newUser.phone,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        registrationStatus: newUser.upiRegistration.status
      });
    }catch(error) {
      return serverError(res, error.message);
    }

  }
}