import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userId: ObjectId,
  bankDetails: {
    ifsCode: {
      type: String,
      required: true,
      match: /^[A-Z]{4}0[A-Z0-9]{6}$/
    },
    bankName: {
      type: String,
      default: 'Paytm Payments Bank',
      trim: true,
      maxLength: 100
    },
  },
  accountDetails: {
    accountNumber: {
      type: String,
      required: true,
      unique: true,
      match: /^[0-9]{10,12}$/
    },
    accountHolderName: {
      type: String,
      required: true,
      trim: true,
      maxLength: 100
    },
    accountType: {
      type: String,
      enum: ['savings', 'current', 'fixed', 'overdraft'],
      required: true
    },
    linkedMobileNumber: {
      type: String,
      required: true,
      match: /^[6-9]+\d{9}$/
    },
  },
  verification: {
    status: {
      type: String,
      enum: ['PENDING', 'VERIFIED', 'REJECTED'],
      default: 'PENDING'
    },
    verificationDate: {
      type: Date,
      default: null
    }
  }
}, {
  timestamps: true,
  collection: 'accounts'
});

const Account = mongoose.model('Account', accountSchema);

export default Account;