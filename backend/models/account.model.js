import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  accNo: {
    type: String,
    required: true,
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
  }
}, {timestamps: true});

const Account = mongoose.model('Account', accountSchema);

export default Account;

