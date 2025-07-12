import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  accountNumber: {
    type:String,
    required:true,
    unique:true
  },
  accountType: {
    type: String,
    enum: ['savings', 'current', 'fixed'],
    default: 'savings',
  },
  bankName: {
    type: String,
    required: true
  },
  ifscCode: {
    type: String,
    required:true,
    match: /^[A-Z]{4}0[A-Z0-9]{6}$/
  },
  balance: {
    type:Number,
    default: 0,
    min: 0
  },
  dailyTransactionLimit: {
    type:Number,
    default: 100000
  },
  monthlyTransactionLimit: {
    type: Number,
    default: 2000000
  },
  dailySpent: {
    type: Number,
    default: 0
  },
  monthlySpent: {
    type: Number,
    default: 0
  },
  lastResetDate: {
    type:Date,
    default: Date.now
  },
  isActive: {
    type:Boolean,
    default:true
  },
  isPrimary: {
    type:Boolean,
    default:true
  }
}, {timestamps:true});

accountSchema.methods.resetLimits = function() {
  const now = new Date();
  const lastReset = new Date(this.lastResetDate);

  if(now.getDate !== lastReset.getDate()) {
    this.dailySpent = 0;
  }

  if(now.getMonth !== lastReset.getMonth()) {
    this.monthlySpent = 0;
  }

  this.lastResetDate = now;
};

accountSchema.methods.canTransact = function(amount) {
  this.resetLimits();

  const dailyRemainingLimit = this.dailyTransactionLimit - this.dailySpent;
  const monthlyRemainingLimit = this.monthlyTransactionLimit - this.monthlySpent;

  return amount <= Math.min(dailyRemainingLimit, monthlyRemainingLimit, this.balance);
};

const Account = new mongoose.model('Account', accountSchema);

export default Account;