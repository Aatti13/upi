import mongoose from "mongoose";
import bcrypt from 'bcrypt';

import { getBankShortForm } from "../utils/bank.util.js";

const userSchema = new mongoose.Schema({
  firstName: {
    type:String,
    required:true,
    trim:true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type:String,
    required:true,
    lowercase:true,
    unique:true,
    match: /^([a-z0-9_\-\.])+@([a-z0-9_\-\.])+\.([a-z]{2,4})$/
  },
  phone: {
    type:String,
    required:true,
    unique:true,
    match:/^[0-9]{10}$/
  },
  upiId: {
    type:String,
    unique:true,
    sparse:true
  },
  bankName: {
    type:String,
    required:true,
    default:'Paytm Payments Bank'
  },
  pin: {
    type:String,
    required:true,
    minlength: 4,
    maxlength: 6
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  kycStatus: {
    type:String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  deviceID: String,
  lastLogin: Date,
  isActive: {
    type:Boolean,
    default:true
  }
}, {timestamps: true});

userSchema.pre('save', async function(next) {
  if(!this.isModified('pin')) return next();
  this.pin = await bcrypt.hash(this.pin, 10);
  next();
});

userSchema.methods.comparePin = async function(pin) {
  return await bcrypt.compare(pin, this.pin);
};

userSchema.methods.generateUPIId = async function(bankName) {
  const bankShortForm = getBankShortForm(bankName) || 'paytm';
  this.bankName = bankName || 'Paytm Payments Bank';

  this.upiId = `${this.phone}@${bankShortForm}`;
  return this.upiId;
};

userSchema.statics.getAvailableBanks = function() {
  return getSupportedBanks().map(bankName => ({
    bankName,
    shortForm: getBankShortForm(bankName)
  }));
};

const User = new mongoose.model('User', userSchema);

export default User;
