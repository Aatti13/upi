import jwt from 'jsonwebtoken';

export const generateAccountNumber = ()=>{
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random * 1000).toString().padStart(5, '0');
  return `BCMC${timestamp.slice(-8)}${random}`;
}

export const generateJWTToken = (userId) => {
  return jwt.sign({userId}, process.env.JWT_SECRET, {
    expiresIn: process.env.EXPIRES_IN || '24h'
  });
}
