import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  accountNo: {
    type: String,
    unique: true,
  },
  balance: {
    type: Number,
    required: true,
    default: 0
  },
  bankName: {
    type: String,
    default: 'Default Bank',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  accountType: {
    type: String,
    enum: ['savings', 'current', 'fixed'],
    required: true
  },
  ifsCode: {
    type: String,
    default: 'IFSC0001',
  }
}, {timestamps: true});


const Account = mongoose.model('Account', accountSchema);

export default Account;

