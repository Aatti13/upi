import jwt from 'jsonwebtoken';
import crypto from 'crypto';

function generateSecureRandomIntString(length = 6) {
  const bytes = crypto.randomBytes(length);
  let result = '';
  for (let byte of bytes) {
    result += (byte % 10).toString();
  }
  return result;
}

export const generateAccountNumber = ()=>{
  const timestamp = Date.now().toString();
  const random = generateSecureRandomIntString(8);
  return `BCMC${timestamp.slice(-8)}${random}MCBC`;
}

export const generateJWTToken = (userId) => {
  return jwt.sign({userId}, process.env.JWT_SECRET, {
    expiresIn: process.env.EXPIRES_IN || '24h'
  });
}
