import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  transactionId: String,

  participants: {
    payer: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
      },
      upiId: {
        type: String,
        required: true,
        match: /^[6-9]\d{9}@[a-z]{2,15}$/,
        index: true
      },
      mobile: {
        type: String,
        required: true,
        match: /^[6-9]+\d{9}$/
      },
      bankAccountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true,
        index: true
      }
    },
    payee: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
      },
      upiId: {
        type: String,
        required: true,
        match: /^[6-9]\d{9}@[a-z]{2,15}$/,
        index: true
      },
      mobile: {
        type: String,
        required: true,
        match: /^[6-9]+\d{9}$/
      },
      bankAccountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true,
        index: true
      }
    }
  },

  payment: {
    amount: {
      type: Number,
      required: true,
      min: 0,
      index: true
    },
    currency: {
      type: String,
      required: true,
      default: 'INR',
      match: /^[A-Z]{3}$/
    },
    description: {
      type: String,
      trim: true,
      maxLength: 255,
      default: 'UPI Transaction'
    },
    method: {
      type: String,
      enum: ['UPI', 'BANK_TRANSFER', 'CASH'],
      required: true
    },
    transactionType: {
      type: String,
      enum: ['P2P', 'P2M', 'M2P', 'M2M', 'bill_payment', 'request'],
    },
    merchantTransactionId: {
      type: String,
      unique: true,
      sparse: true
    },
    transactionDate: {
      type: Date,
      default: Date.now
    },
    refundedAmount: {
      type: Number,
      default: 0,
      min: 0
    },
    refundReason: {
      type: String,
      trim: true,
      maxLength: 255,
      default: null
    }
  },

  lifecycle: {
    status: {
      type: String,
      enum: ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'],
      default: 'PENDING',
      index: true
    },
    initiatedAt: Date,
    completedAt: Date,
    isFailure: {
      type: Boolean,
      default: false
    },
    failureReason: {
      type: String,
      trim: true,
      maxLength: 255,
      default: null
    },
    errorCode: {
      type: String,
      enum: ['U17', 'U28', 'U69', 'U88', 'U91', 'U92', 'U93', 'U94', 'U95', 'F01', 'F02', 'F03', 'F04', 'S01', 'S02', 'S03']
    },
    settlementStatus: {
      type: String,
      enum: ['PENDING', 'SETTLED', 'FAILED'],
      default: 'PENDING'
    },
    settlementDate: Date
  },

  fraud: {
    riskScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
      index: true
    },
    fraudRules: [{
      ruleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FraudRule',
        required: true
      },
      scoreImpact: {
        type: Number,
        default: 0,
        min: -100,
        max: 100
      },
      description: {
        type: String,
        trim: true,
        maxLength: 255
      }
    }],
    isReviewed: {
      type: Boolean,
      default: false
    },
    reviewStatus: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING'
    },
    reviewedAt: Date,
    reviewedBy: {
      type: String,
      trim: true,
      maxLength: 100,
    },
    isFlagged: {
      type: Boolean,
      default: false
    },
    flagReason: {
      type: String,
      trim: true,
      maxLength: 255,
      default: null
    },
    flaggedAt: Date,
    flaggedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }
  },

  context: {
    deviceId: {
      type: String,
      trim: true,
      maxLength: 100
    },
    ipAddress: {
      type: String,
      trim: true,
      select: false,
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Location',
    } // To Add Session Id and User Agent in future
  },

  statusHistory: [{
    status: {
      type: String,
      enum: ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'],
      required: true
    },
    changedAt: {
      type: Date,
      default: Date.now
    },
    reason: {
      type: String,
      trim: true,
      maxLength: 255,
      default: null
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  }]
}, {
  timestamps: true,
  collection: 'transactions'
});

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;