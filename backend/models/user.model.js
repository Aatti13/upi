import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: {
    type:String,
    required: true,
    trim: true
  },
  lastName: {
    type:String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /^([a-z0-9_\-\.])+@([a-z0-9_\-\.])+\.([a-z]{2,4})$/
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    match: /^[0-9]{10}$/
  },
  upiId: {
    type: String,
    unique: true,
    sparse: true
  },
  bankName: {
    type: String,
    required: true,
    default: 'Paytm Payments Bank'
  },
  pin: {
    type: String,
    minLength: 4,
    maxLength: 6,
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  kycStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  deviceID: String,
  lastLogin: Date,
  isActive: {
    type: Boolean,
    default: true
  },

  userID: {
    type: String,
    unique: true,
    required: true,
    default: function() {
      return `USRP_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    }
  },
  upiRegistration: {
    registrationStatus: {
      type: String,
      enum: ['INITIATED', 'MOBILE_VERIFIED', 'MPIN_SET', 'COMPLETED', 'FAILED'],
      default: 'INITIATED'
    },
    registrationDate: {
      type: Date,
      required: false
    },
    registrationMethod: {
      type: String,
      enum: ['AADHAR', 'MOBILE', 'DEBIT_CARD', 'NET_BANKING'],
      default: 'MOBILE'
    },
    verificationCode: {
      type: String,
      required: false
    },
    verificationExpiry: {
      type: Date,
      required: false
    },
    attempts: {
      type:Number,
      default:0
    },
    lastAttempt: {
      type: Date,
      required: false
    }
  },

  personalDetails: {
    dateOfBirth: {
      type: Date,
      required: true
    },
    gender: {
      type: String,
      enum: ['MALE', 'FEMALE', 'OTHER', "DONT WANT TO SAY"],
      required: false
    },
    address: {
      line1: { type: String, required: true },
      line2: { type: String, required: false },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: {
        type: String,
        required: false,
        match: /^[0-9]{6}$/
      },
      country: { type: String, default: 'India' }
    },
    nationality: {
      type: String,
      default: 'Indian'
    }
  },

  kycDetails: {
    kycStatus: {
      type: String,
      enum: ['PENDING', 'MINIMAL', 'FULL', 'EXPIRED', 'REJECTED'],
      default: 'PENDING'
    },
    kycType: {
      type: String,
      enum: ['MINIMAL', 'FULL'],
      default: 'FULL'
    },
    documents: [{
      type: {
        type: String,
        enum: ['AADHAR', 'PAN', 'VOTER_ID', 'DRIVING_LICENSE', 'PASSPORT'],
        required: true
      },
      number: {
        type: String,
        required: true
      },
      isVerified: {
        type: Boolean,
        default: false
      },
      verifiedAt: {
        type: Date,
        required: false
      },
      expiryDate: {
        type: Date,
        required: false
      }
    }],
    submittedAt: {
      type: Date,
      required: false
    },
    verifiedAt: {
      type: Date,
      required: false
    },
    rejectedAt: {
      type: Date,
      required: false
    },
    rejectedReason: {
      type: String,
      required: false
    },
    verificationScore:{
      type: Number,
      min: 0,
      max:100,
      required: false
    }
  },

  devices: [{
    deviceId: {
      type: String,
      required: true
    },
    deviceFingerprint: {
      type: String,
      required: true
    },
    deviceName: {
      type: String,
      required: true
    },
    deviceType: {
      type: String,
      enum: ['MOBILE', 'TABLET', 'WEB'],
      required: true
    },
    osType: {
      type: String,
      required: true
    },
    osVersion: {
      type: String,
      required: true
    },
    appVersion: {
      type: String,
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    isTrusted: {
      type: Boolean,
      default: false
    },
    lastUsed: {
      type: Date,
      default: Date.now
    },
    registeredAt: {
      type: Date,
      default: Date.now
    },
    ipAddress: {
      type: String,
      required: false
    },
    location: {
      latitude: Number,
      longitude: Number,
      city: String,
      state: String,
      country: String
    }
  }],

  security: {
    mpinHash: {
      type: String,
      required: false
    },
    mpinSalt: {
      type: String,
      required: false
    },
    mpinFailedAttempts: {
      type: Number,
      default: 0
    },
    mpinLockedUntil: {
      type: Date,
      required: false
    },
    mpinLastChanged: {
      type: Date,
      required: false
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false
    },
    twoFactorSecret: {
      type: String,
      required: false
    },
    passwordLastChanged: {
      type: Date,
      required: false
    },
    securityQuestions: [{
      question: String,
      answerHash: String,
      salt: String
    }]
  },

  preferences: {
    language: {
      type: String,
      default: 'en',
      enum: ['en', 'hi', 'ta', 'te', 'bn', 'gu', 'kn', 'ml', 'mr', 'or', 'pa', 'ur']
    },
    notifications: {
      push: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: true
      },
      email: {
        type: Boolean,
        default: true
      },
      transactionAlerts: {
        type: Boolean,
        default: true
      },
      promotionalOffers: {
        type: Boolean,
        default: false
      }
    },
    privacy: {
      profileVisibility: {
        type: String,
        enum: ['PUBLIC', 'PRIVATE', 'FRIENDS'],
        default: 'PRIVATE'
      },
      shareTransactionHistory: {
        type: Boolean,
        default: false
      }
    },
    transactionLimits: {
      dailyLimit: {
        type: Number,
        default: 100000
      },
      monthlyLimit: {
        type: Number,
        default: 1000000
      },
      requireAuthForAmount: {
        type: Number,
        default: 5000
      }
    }
  },
  activity: {
    lastLogin: {
      type: Date,
      required: false
    },
    lastTransactionDate: {
      type: Date,
      required: false
    },
    totalTransactions: {
      type: Number,
      default: 0
    },
    totalTransactionAmount: {
      type: Number,
      default: 0
    },
    loginCount: {
      type: Number,
      default: 0
    },
    failedLoginAttempts: {
      type: Number,
      default: 0
    },
    lastFailedLogin: {
      type: Date,
      required: false
    },
    accountLockedUntil: {
      type: Date,
      required: false
    }
  },
  
  riskProfile: {
    riskScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    riskCategory: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH'],
      default: 'LOW'
    },
    blacklistStatus: {
      type: Boolean,
      default: false
    },
    blacklistReason: {
      type: String,
      required: false
    },
    lastRiskAssessment: {
      type: Date,
      required: false
    },
    sanctions: [{
      type: {
        type: String,
        enum: ['WARNING', 'TEMPORARY_SUSPENSION', 'PERMANENT_BAN'],
        required: true
      },
      reason: {
        type: String,
        required: true
      },
      imposedAt: {
        type: Date,
        default: Date.now
      },
      expiresAt: {
        type: Date,
        required: false
      },
      isActive: {
        type: Boolean,
        default: true
      }
    }]
  },
  
  support: {
    tickets: [{
      ticketId: String,
      subject: String,
      status: {
        type: String,
        enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'],
        default: 'OPEN'
      },
      priority: {
        type: String,
        enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
        default: 'MEDIUM'
      },
      createdAt: {
        type: Date,
        default: Date.now
      },
      resolvedAt: {
        type: Date,
        required: false
      }
    }],
    feedback: [{
      rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
      },
      comment: String,
      category: {
        type: String,
        enum: ['APP', 'TRANSACTION', 'SUPPORT', 'FEATURE'],
        required: true
      },
      submittedAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  
  referral: {
    referralCode: {
      type: String,
      unique: true,
      sparse: true
    },
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    referredUsers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    referralRewards: {
      totalEarned: {
        type: Number,
        default: 0
      },
      totalRedeemed: {
        type: Number,
        default: 0
      },
      availableBalance: {
        type: Number,
        default: 0
      }
    }
  },
  
  statusHistory: [{
    status: {
      type: String,
      required: true
    },
    reason: {
      type: String,
      required: false
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    changedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, { timestamps:true });

userSchema.index({ userId: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ email: 1 });
userSchema.index({ upiId: 1 });
userSchema.index({ 'kycDetails.kycStatus': 1 });
userSchema.index({ 'upiRegistration.registrationStatus': 1 });
userSchema.index({ 'devices.deviceId': 1 });
userSchema.index({ 'devices.deviceFingerprint': 1 });
userSchema.index({ 'riskProfile.riskCategory': 1 });
userSchema.index({ 'referral.referralCode': 1 });
userSchema.index({ isActive: 1 });

userSchema.virtual('fullname').get(function() {
  return `${this.firstName}${this.lastName}`;
});

userSchema.virtual('isKYCCompleted').get(function() {
  return this.kycDetails.kycStatus === 'FULL';
});

userSchema.virtual('isUPIActive').get(function() {
  return this.upiRegistration.registrationStatus === 'COMPLETED' && this.isActive && this.kycDetails.kycStatus !== 'REJECTED';
});

userSchema.virtual('activeDevicesCount').get(function() {
  return this.devices.filter(device => device.isActive).length;
})

userSchema.methods.canPerformUPI = ()=>{
  return this.upiRegistration.registrationStatus === 'COMPLETED' 
  && this.kycDetails.kycStatus !== 'REJECTED' 
  && this.isActive 
  && !this.riskProfile.blacklistStatus 
  && (!this.activity.accountLockedUntil || this.activity.accountLockedUntil < new Date());
};

userSchema.methods.getActiveDevice = (deviceID)=>{
  return this.devices.find((device)=>{
    device.deviceID === deviceID && device.isActive
  });
};

userSchema.methods.addDevice = (deviceInfo)=>{
  this.devices = this.devices.filter((device)=>{
    device.deviceFingerprint !== deviceInfo.deviceFingerprint
  });

  this.device.push({
    ...deviceInfo,
    deviceID: `DEV_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    registeredAt: new Date(),
    lastUsed: new Date()
  });

  return this.devices[this.devices.length-1];
}

userSchema.methods.updateMPIN = (newMPINHash, salt)=>{
  this.security.mpinHash = newMPINHash;
  this.security.mpinSalt = salt;
  this.security.mpinLastChanged = new Date();
  this.security.mpinFailedAttempts = 0;
  this.security.mpinLockedUntil = null;
};

userSchema.methods.lockMPIN = (lockedDuration = 30)=>{
  this.security.mpinLockedUntil = new Date(Date.now()+lockedDuration+60*1000);
  this.security.mpinFailedAttempts = 0;
};

userSchema.methods.updateRiskScore = (newScore)=>{
  this.riskProfile.riskScore = newScore;
  this.riskProfile.lastRiskAssessment = new Date();

  if(newScore < 30) {
    this.riskProfile.riskCategory = 'LOW';
  }else if(newScore < 70) {
    this.riskProfile.riskCategory = 'MEDIUM';
  }else{
    this.riskProfile.riskCategory = 'HIGH';
  }
};

userSchema.methods.updateStatus = (newStatus, reason, changedBy)=>{
  this.statusHistory.push({
    status: this.isActive ? 'ACTIVE' : 'INACTIVE',
    reason: reason || 'Status Change',
    changedBy: changedBy,
    changedAt: new Date()
  });
};

userSchema.methods.generateReferralCode = ()=>{
  if (!this.referral.referralCode) {
    this.referral.referralCode = `${this.firstName.toUpperCase().substr(0, 3)}${Date.now().toString().substr(-6)}`;
  }
  return this.referral.referralCode;
}

userSchema.pre('save', function(next) {
  if (!this.userId) {
    this.userId = `USR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  next();
});

userSchema.pre('save', function(next) {
  if (this.isModified('activity.lastLogin')) {
    this.activity.loginCount += 1;
  }
  next();
});

const User = mongoose.model('User', userSchema);

export default User;