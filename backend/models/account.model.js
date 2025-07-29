import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId()
  },
  accountId: {
    type: String,
    unique: true,
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  bankDetails: {
    bankMasterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BankMaster',
      required: true,
      index: true
    },
    bankName: {
      type: String,
      required: true
    },
    bankShortHand: {
      type: String,
      required: true,
      match: /^[a-z]{3,15}$/
    },
    branchAddress: {
      branchName: {
        type: String,
        required: true
      },
      branchAddress: {
        line1: { type: String, required: true },
        line2: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        ifscCode: {
          type: String,
          default: 'IFSC0001',
          uppercase: true,
          match: /^[A-Z]{4}0[A-Z0-9]{6}$/
        }
      } 
    }
  },

  accountDetails: {
    accountNumber: {
      type: String,
      unique: true,
      match: /^[2-9]\d{14}$/
    },
    accountHolderName: {
      type: String,
      required: true,
      trim: true
    },
    accountType: {
      type: String,
      enum: ['savings', 'current', 'fixed', 'overdraft'],
      required: true
    }
  },

  verification: {
    status: {
      type: String,
      enum: ['pending', 'verified', 'failed'],
      default: 'pending'
    },
    verificationMethod: {
      type: String,
      enum: ['PENNY_DROP', 'ACCOUNT_STATEMENT', 'MANUAL'],
      default: 'PENNY_DROP'
    },
    verifiedAt: Date,
    verificationAmount: {
      type: Number,
      min: 5000
    },
    verificationReference: String
  },

  transactionLimits: {
    daily: {
      limit: { type: Number, default: 100000 },
      spent: { type: Number, default: 0 },
      lastReset: { type: Date, default: Date.now }
    },
    monthly: {
      limit: { 
        type: Number,
        default: 1000000,
        max: 2500000 
      },
      spent: { type: Number, default: 0 },
      lastReset: { type: Date, default: Date.now }
    },
    perTransaction: {
      type: Number,
      default: 1000000,
      max: 2500000
    }
  },

  transactionCount: {
    daily: {
      type: Number,
      default: 0,
      min: 0
    },
    monthly: {
      type: Number,
      default: 0,
      ming: 0
    }
  },

  balance: {
    available: {
      type: Number,
      default: 0,
      min: 0
    },
    blocked: {
      type: Number,
      default: 0,
      min: 0
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },

  mpin: {
    hash: {
      type: String,
      min: 4,
      max: 6,
      required: true,
      match: /^[0-9]{4,6}$/
    },
    attempts: {
      type: Number,
      min: 0,
      default: 0,
      max: 3
    },
    lockedUntil: Date,
    lockedReason: String,
    lastUpdated: Date,
  },

  isPrimary: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'DORMANT', 'SUSPENDED', 'BLOCKED'],
    default: 'ACTIVE'
  },

  metadata: {
    addedVia: {
      type: String,
      enum: ['MANUAL', 'BANK_LINK', 'API', 'ADMIN'],
      default: 'MANUAL'
    },
    lastTransactionAt: Date,
    totalTransactions: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true,
  collection: 'accounts'
});

accountSchema.index({ 'accountDetails.accountNumber': 1 });
accountSchema.index({ 'bankDetails.ifscCode': 1 });
accountSchema.index({ 'bankDetails.bankMasterId': 1 });
accountSchema.index({ isPrimary: 1 });

const Account = mongoose.model("Account", accountSchema);
export default Account;