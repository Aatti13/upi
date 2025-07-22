import mongoose from "mongoose";

const mobileUPISchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    index: true,
    required: true
  },

  upiIds: [{
    upiId: {
      type: String,
      required: true,
      unique: true,
      match: /^[6-9]\d{9}@[a-z]{2,15}$/,
      index: true
    },
    handle: {
      type: String,
      required: true,
      match: /^[a-zA-Z0-9._-]{2, 15}$/
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    bankAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    isPrimary: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
  }],

  bankAccounts: [{
    bankAccountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
      index: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    bankName: {
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
    isPrimary: {
      type: Boolean,
      default: false
    },
    linkedAt: {
      type: Date
    }
  }],

  stats: {
    totalUPIIds: {
      type: Number,
      default: 0
    },
    totalBankAccounts: {
      type: Number,
      default: 0
    },
    lastActivity: {
      type: Date,
      default: null
    }
  },

  updatedAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true,
  collection: 'mobileUPI'
});

const MobileUPI = mongoose.model('MobileUPI', mobileUPISchema);
export default MobileUPI;