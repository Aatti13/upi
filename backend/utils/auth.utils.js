import jwt from 'jsonwebtoken';
import BlackListedToken from '../models/blacklisted.model';

export class AuthUtils {

  generateToken = (payload)=>{
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
      issuer: 'upi=payments',
      audience: 'user'
    });
  }

  generateToken = (payload)=>{
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
      issuer: 'upi=payments',
      audience: 'user'
    });
  }

  generateRefreshToken = (payload)=>{
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
      issuer: 'upi-payments',
      audience: 'user'
    });
  }

  verifyToken = (token)=>{
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    }catch(error) {
      throw new Error('Invalid Token');
    }
  }

  verifyRefreshToken = (refreshToken)=>{
    try{
      return jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    }catch(error) {
      throw new Error('Invalid Refresh Token');
    }
  }

  isTokenBlackListed = async (token)=>{
    const blackListenToken = await BlackListedToken.findOne({ token });
    return !!blackListenToken;
  }

  blackListToken = async (token)=>{
    try {
      const decoded = this.verifyToken(token);
      const expiresAt = new Date(decoded.exp * 1000);

      await BlackListedToken.create({
        token,
        userId,
        expiresAt
      });
    }catch(error) {
      console.error('Error Blacklisting Token', error);
      throw error;
    }
  }

  extractTokenFromHeader = (authHeader)=>{
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7);
  }

  generateDeviceID = (userAgent, ipAddress)=>{
    const timeStamp = new Date();
    const randomBytes = crypto.randomBytes(16).toString('hex');
    const fingerprint = crypto.createHash('sha256')
      .update(userAgent+timeStamp+ipAddress)
      .digest('hex')
      .substring(0, 16);
    
    return `device_${fingerprint}${randomBytes}`;
  }

  extractDeviceFingerPrint = (req)=>{
    const userAgent = req.headers['user-agent'] || 'unknown';
    const ipAddress = req.ip || req.connection.remoteAccess || 'unknown';
    const acceptLanguage = req.headers['accept-language'] || 'unknown';
    const acceptEncoding = req.headers['accept-encoding'] || 'unknown';
    
    return crypto.createHash('sha256')
      .update(userAgent + ipAddress + acceptLanguage + acceptEncoding)
      .digest('hex')
      .substring(0, 32);

  }
}