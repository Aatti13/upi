import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
  accountId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  userId: {
    type: String,
    required: true,
    ref: 'User',
    index: true
  },

  bankName: {
    type: String,
    required: true,
    trim: true
  },
  accountNumber: {
    type: String,
    required: true,
    encrypted: true,
    unique: true
  },
  ifscCode: {
    type: String,
    required: true,
    uppercase: true,
    match: /^[A-Z]{4}0[A-Z0-9]{6}$/
  },
  accountHolderName: {
    type: String,
    required: true,
    trim: true
  },
  accountType: {
    type: String,
    enum: ['savings', 'current', 'wallet', 'overdraft'],
    default: 'savings'
  },
  status: {
    type: String,
    enum: ['active', 'dormant', 'blocked', 'closed'],
    default: 'active'
  },

  upiHandle: {
    type: String,
    required:true,
    lowercase: true,
    match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/
  },
  isPrimary: {
    type: Boolean,
    default: false
  },

  isVerified: {
    type: Boolean,
    default: false
  },
  verificationDate: {
    type: Date
  },
  verificationMethod: {
    type: String,
    enum: ['penny_drop', 'netbanking', 'debit_card', 'otp']
  },
  
  limits: {
    dailyLimit: {
      type: Number,
      default: 100000,
      min: 0
    },
    monthlyLimit: {
      type: Number,
      default: 200000,
      min: 0
    },
    perTransactionLimit: {
      type: Number,
      default: 100000,
      min: 0
    },
    usedDailyLimit: {
      type: Number,
      default: 0
    },
    usedMonthlyLimit: {
      type: Number,
      default: 0
    },
    lastResetDate: {
      type: Date,
      default: Date.now
    }
  },
  balance: {
    available: {
      type: Number,
      default: 0
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },

  isBlocked: {
    type: Boolean,
    default: false
  },
  blockedReason: {
    type: String,
    enum: ['fraud', 'compliance', 'user_request', 'bank_block', 'system_block']
  },
  lastUsed: {
    type: Date,
    default: Date.now
  },
  totalTransactions: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    default: 0
  },

  addedDate: {
    type: Date,
    default: Date.now
  },
  addedBy: {
    type: String,
    enum: ['user', 'admin', 'system'],
    default: 'user'
  },
  bankDetails: {
    branchName: String,
    branchAddress: String,
    micrCode: String,
    swiftCode: String
  },
  
  bankIntegration: {
    apiProvider: {
      type: String,
      enum: ['razorpay', 'cashfree', 'payu', 'direct_bank']
    },
    externalAccountId: String,
    lastSyncDate: Date
  },
  
  statusHistory: [{
    status: String,
    changedBy: String,
    changedAt: {
      type: Date,
      default: Date.now
    },
    reason: String,
    metadata: Object
  }],
  
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date,
  deletedBy: String

}, { timestamps: true });

accountSchema.indexes = [
  { userId: 1, isPrimary: -1 }, 
  { accountNumber: 1 }, 
  { upiHandle: 1 }, 
  { status: 1, isDeleted: 1 }, 
  { addedDate: -1 }, 
  { lastUsed: -1 }, 
  { 'limits.dailyLimit': 1, 'limits.usedDailyLimit': 1 } 
];

accountSchema.virtual = {
  maskedAccountNumber: function() {
    if(!this.accountNumber) return '';
    const accNum = this.accountNumber.toString();
    return 'XXXX'+accNum.slice(-4);
  },

  availableDailyLimit: function() {
    return this.limits.dailyLimit - this.limits.usedDailyLimit;
  },

  availableMonthlyLimit: function() {
    return this.limits.monthlyLimit - this.limits.usedMonthlyLimit;
  }
};

accountSchema.methods = {
  canProcessTransaction: function(amount) {
    if(this.status !== 'active' || this.isBlocked || this.isDeleted) {
      return { canProcess: false, reason: 'Account Not Active' };
    }

    if(amount > this.availableDailyLimit) {
      return { canProcess: false, reason: 'Daily Limit Exceeded' };
    }

    if(amount > this.availableMonthlyLimit) {
      return { canProcess: false, reason: 'Monthly Limit Exceeded' };
    }

    if(amount > this.limits.perTransactionLimit) {
      return { canProcess: false, reason: 'Pre Transaction Limit Exceeded' };
    }

    return { canProcess: true };
  },

  updateLimits: function(amount) {
    this.limits.usedDailyLimit += amount;
    this.limits.usedMonthlyLimit += amount;
    this.totalTransactions += 1;
    this.totalAmount += amount;
  },

  addStatusHistory: function(status, changedBy, reason, metadata = {}) {
    this.statusHistory.push({
      status,
      changedBy,
      reason,
      metadata
    });
    this.status = status;
  }
};

const Account = mongoose.model('Account', accountSchema);

export default Account;