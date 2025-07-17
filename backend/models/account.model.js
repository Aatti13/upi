import mongoose from 'mongoose';
import { ref } from 'process';
import { stringify } from 'querystring';

const accountSchema = new mongoose.Schema({
  authId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auth',
    required: true,
    index: true
  },

  personalDetails: {
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxLength: 50
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      maxLength: 50
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
      sparse: true,
      index: true
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    }
  },

  upiId: {
    type: String,
    required: true,
    sparse: true,
    unique: true,
    lowercase: true,
    match: /^[6-9]\d{9}@[a-z]{3,}$/,
    index: true
  },

  kycInfo: {
    status: {
      type: String,
      enum: ['pending', 'submitted', 'verified', 'rejected'],
      default: 'pending',
      index: true
    },
    documents: [{
      type: {
        type: String,
        enum: ['aadhaar', 'pan', 'passport', 'voterId', 'drivingLicense'],
        required: true
      },
      number: String,
      verified: {
        type: Boolean,
        default: false
      },
      verifiedAt: Date,
      expiredAt: Date
    }],
    verificationLevel: {
      type: String,
      enum: ['basic', 'intermediate', 'full'],
      default: 'basic',
    },
    verifiedAt: Date,
    verifiedBy: String
  },

  linkedBankAccounts: [{
    bankName: {
      type: String,
      required: true,
    },
    accountNumber: {
      type: String,
      required: true,
      index: true
    },
    ifscCode: {
      type: String,
      required: true,
      match: /^[A-Z]{4}0[A-Z0-9]{6}$/,
      index: true
    },
    accountType: {
      type: String,
      enum: ['savings', 'current', 'fixed', 'overdraft'],
      default: 'savings'
    },
    accountHolderName: String,
    isPrimary: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    },
    addedAt: {
      type: Date,
      default: Date.now
    },
    lastUsed: Date,
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending'
    }
  }],
  wallet: {
    balance: {
      type: Number,
      default: 0,
      min: 0
    },
    currency: {
      type: String,
      default: 'INR',
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },

  transactionimits: {
    daily: {
      limit: {
        type: Number,
        default: 100000,
      },
      used: {
        type: Number,
        default: 0,
        min: 0
      },
      resetAt: {
        type: Date,
        default: ()=>{
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          tomorrow.setHours(0, 0, 0, 0);
          return tomorrow;
        }
      }
    },
    monthly: {
      limit: {
        type: Number,
        default: 1000000
      },
      used: {
        type: Number,
        default: 0,
        min: 0
      },
      resetAt: {
        type: Date,
        default: ()=>{
          const nextMonth = new Date();
          nextMonth.setMonth(nextMonth.getMonth() + 1);
          nextMonth.setDate(1);
          nextMonth.setHours(0, 0, 0, 0);
          return nextMonth;
        }
      }
    },
    perTransaction: {
      limit: {
        type: Number,
        default: 100000
      }
    }
  },

  preferences: {
    language: {
      type: String,
      default: 'en',
      enum: ['en', 'hi', 'ta', 'te', 'bn', 'mr', 'gu', 'kn', 'ml', 'or', 'pa', 'as']
    },
    notifications: {
      sms: {
        type: Boolean,
        default: true
      },
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      },
      transactionAlerts: {
        type: Boolean,
        default: true
      }
    },
    autoPayLimits: {
      enabled: {
        type: Boolean,
        default: false
      },
      maxAmount: {
        type: Number,
        default: 8000
      }
    }
  },

  status: {
    type: String,
    enum: ['active', 'dormant', 'suspended', 'closed'],
    default: 'active',
    index: true
  },

  riskProfile: {
    score: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    level: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'low'
    },
    lastAssessed: Date,
    flags: [{
      type: String,
      reason: String,
      createdAt: {
        type: Date,
        default: Date.now
      },
      resolvedAt: Date
    }]
  },

  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  lastActivity: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'accounts'
});


accountSchema.index({ authId: 1 });
accountSchema.index({ upiId: 1 }, { sparse: true });
accountSchema.index({ 'personalInfo.email': 1 }, { sparse: true });
accountSchema.index({ 'kycInfo.status': 1 });
accountSchema.index({ status: 1 });
accountSchema.index({ createdAt: -1 });
accountSchema.index({ 'linkedBankAccounts.isPrimary': 1 });

// Compound indexes for common queries
accountSchema.index({ authId: 1, status: 1 });
accountSchema.index({ 'kycInfo.status': 1, status: 1 });


accountSchema.methods.getPrimaryBankAccount = function() {
  return this.linkedBankAccounts.find((account)=>{
    return account.isPrimary && account.isActive;
  })
};

accountSchema.methods.canTransact = function(amount) {
  if(this.status !== 'active') return false;
  if(this.riskProfile.level === 'high') return false;
  if(this.kycInfo.status !== 'verified') return false;

  if(amount > this.transactionimits.perTransaction.limit || amount > this.transactionimits.daily.limit || amount > this.transactionimits.monthly.limit) return false;

  if(this.transactionimits.daily.used + amount > this.transactionimits.daily.limit) return false;
  if(this.transactionimits.monthly.used + amount > this.transactionimits.monthly.limit) return false;

  return true;
};

accountSchema.methods.updateTransactionLimits = function(amount, type) {
  this.transactionimits.daily.used += amount;
  this.transactionimits.monthly.used += amount;
  this.lastActivity = new Date();
  return this.save();
}

accountSchema.methods.resetDailyLimit = function() {
  this.transactionimits.daily.used = 0;
  this.transactionimits.daily.resetAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // Reset to next day
  return this.save();
}

accountSchema.methods.resetMonthlyLimit = function() {
  this.transactionimits.monthly.used = 0;
  this.transactionimits.monthly.resetAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Reset to next month
  return this.save();
}

accountSchema.pre('save', async function(next) {
  if(!this.isModified()) {
    this.updatedAt = Date.now();
  }
  next();
})

const Account = mongoose.model('Account', accountSchema);
export default Account;
