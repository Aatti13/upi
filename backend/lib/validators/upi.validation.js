import User from '../../models/user.model.js';
import UPI from '../../models/upi.model.js';

export const findUPIByIdentifier = async (identifier) => {
  // Try to find by UPI ID first
  let upi = await UPI.findOne({ upiId: identifier, isActive: true }).populate('user');
  
  if (!upi) {
    // If not found, try to find by phone number
    const user = await User.findOne({ phone: identifier });
    if (user) {
      upi = await UPI.findOne({ user: user._id, isActive: true }).populate('user');
    }
  }
  
  return upi;
};

export const validateUPIExists = (upi, identifier) => {
  if (!upi) {
    throw new Error(`No active UPI found for identifier: ${identifier}`);
  }
  return upi;
};

export const createQRPaymentData = (transactionId, recipientUPI, amount, description, expiresIn) => ({
  transactionId,
  recipientUPI,
  amount: parseFloat(amount),
  description,
  timestamp: Date.now(),
  expiresAt: Date.now() + (expiresIn * 1000)
});