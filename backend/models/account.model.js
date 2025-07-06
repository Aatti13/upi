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
  },
  upiId: {
    type: String,
    unique: true,
    sparse: true,
    match: /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z][a-zA-Z0-9.\-_]{2,64}$/
  },
  upiPIN: {
    type: String,
    select: false,
    minLength: 4,
    maxLength: 6
  },
  upiEnabled: {
    type:Boolean,
    default: false
  },
  dailyTransactionLimit: {
    type: Number,
    default: 100000
  },
  monthlyTransactionLimit: {
    type: Number,
    default: 1000000
  },
  dailyTransactionCount: {
    type: Number,
    default: 0,
  },
  monthlyTransactionCount: {
    type: Number,
    default: 0
  },
  lastTransactionDate: {
    type: Date
  },
  lastMonthlyReset: {
    type: Date,
    default: Date.now
  }
}, {timestamps: true});

accountSchema.index({ userId: 1, accountNo: 1 });
accountSchema.index({ upiId });

const Account = mongoose.model('Account', accountSchema);

export default Account;

