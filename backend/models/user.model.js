import mongoose, { mongo } from 'mongoose';

const userSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    index: true
  },

  profile: {
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
      match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    },
    primaryMobile: {
      type: String,
      required: true,
      match: /^[6-9]+\d{9}$/
    },
    registeredMobileNumbers: [
      {
        type: String,
        match: /^[6-9]+\d{9}$/
      }
    ],
    kyc: {
      status: {
        type: String,
        enum: ['PENDING', 'APPROVED', 'REJECTED'],
        default: 'PENDING'
      },
      documents: [{
        type: String,
        required: true,
        select: false,
        url: String,
        verifiedAt: Date,
        verifiedBy: String,
        status: { 
          type: String,
          enum: ['pending', 'verified', 'rejected'],
          default: 'pending'
        },
        rejectionReason: String
      }],
      lastUpdated: Date
    }
  },

  security: {
    pin: {
      type: String,
      required: true,
      select: false, 
      minlength: 4,
      maxlength: 6,
      select: false
    },
    pinAttempts: {
      type: Number,
      default: 0,
      min: 0
    },
    isPinLocked: {
      type: Boolean,
      default: false
    },
    pinLockeqedUntil: {
      type: Date,
      default: null
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false
    },
    securityQuestions: [{
      question: {
        type: String,
        required: true
      },
      answer: {
        type: String,
        required: true,
        select: false 
      }
    }],
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
      enum: ['LOW', 'MEDIUM', 'HIGH'],
      default: 'LOW'
    },
    flags: [{
      type: String,
      enum: ['SUSPICIOUS_ACTIVITY', 'HIGH_TRANSACTION_VOLUME', 'UNUSUAL_LOGIN_LOCATION'],
      default: []
    }],
    lastUpdated: {
      type: Date,
      default: Date.now
    },
    statistics: {
      totalTransactions: {
        type: Number,
        default: 0
      },
      avgTransactionAmount: {
        type: Number,
        default: 0
      },
      failedAttempts: {
        type: Number,
        default: 0,
        max: 5
      },
      deviceChanges: {
        type: Number,
        default: 0
      },
      locationChanges: {
        type: Number,
        default: 0
      }
    },
    behaviorPattern: {
      usualTransactionHours: {
        type: [Date],
        default: []
      },
      commonLocations: [{
        type: String,
        trim: true
      }],
      frequentPayees: [{
        type: String,
        trim: true
      }],
      avgDailyTransactions: {
        type: Number,
        default: 0
      }
    },
    status: {
      isActive: {
        type: Boolean,
        default: true
      },
      isFrozen: {
        type: Boolean,
        default: false
      },
      freezeReason: {
        type: String,
        enum: ['FRAUD_SUSPECTED', 'USER_REQUEST', 'REGULATORY_COMPLIANCE'],
        default: null
      },
      lastLogin: {
        type: Date,
        default: null
      },
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date
    }
  }
}, { 
  timestamps: true,
  collection: 'users'
});


const User = mongoose.model('User', userSchema);
export default User;