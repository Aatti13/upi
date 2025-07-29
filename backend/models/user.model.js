import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId()
  },
  userId: {
    type: String,
    trim: true,
    index: true
  },

  authentication: {
    password: {
      type: String,
      required: true
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false
    },
    lastLogin: Date,
    loginAttempts: {
      type: Number,
      min: 0,
      default: 0,
      max: 5
    },
    lockedUntil: Date
  },

  upi: {
    primaryUPIId: {
      type: String,
      match: /^[6-9]\d{9}@[a-z]{2,15}$/,
      index: true
    },
    upiIDs: [{
      type: String,
      match: /^[6-9]\d{9}@[a-z]{2,15}$/
    }]
  },

  profile: {
    firstName: {
      type: String,
      required: true,
      trim: true,
      max: 50
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      max: 50
    },
    displayName: {
      type: String,
      max: 20
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    },
    phone: {
      type: String,
      required: true,
      match: /^[6-9]\d{9}$/
    },
    dob: {
      type: Date,
      required: true
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: true
    }
  },

  address: {
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      length: 6,
      match: /^[1-9]\d{5}$/
    }, // Could try adding coordinates
    isVerified: {
      type: Boolean,
      default: true
    }
  },

  kyc: {
    status: {
      type: String,
      enum: ['PENDING', 'MINIMAL', 'FULL', 'REJECTED', 'EXPIRED'],
      default: 'PENDING'
    },
    level: {
      type: String,
      enum: ['KYC0', 'KYC1', 'KYC2'],
      default: 'KYC0'
    },
    documents: {
      aadhar: {
        number: String,
        verified: {
          type: Boolean,
          default: false
        },
        verifiedAt: {
          type: Date,
          default: null
        },
        verificationMethod: {
          type: String,
          enum: ['OTP', 'BIOMETRIC', 'MANUAL']
        },
        expiresIn: Date
      },

      pan: {
        number: String,
        verified: {
          type: Boolean,
          default: false
        },
        verifiedAt: {
          type: Date,
          default: null
        },
        nameAsPerPan: String
      },

      additionalDocs: [{
        type: String,
        number: String,
        verifiedAt: Date
      }]
    }
  },

  device: {
    registeredDevices: [{
      deviceId: String,
      deviceType: {
        type: String,
        enum: ['ANDROID', 'IOS', 'WEB']
      },
      deviceModel: String,
      osVersion: String,
      appVersion: String,
      lastUsed: Date,
      isActive: {
        type: Boolean,
        default: true
      },
      registeredAt: {
        type: Date,
        default: Date.now
      }
    }],
    ipAddresses: [{
      ip: String,
      location: String,
      lastUsed: Date
    }],
    maxDevices: {
      type: Number,
      default: 3
    },
    currentDevice: String
  },

  preferences: {
    language: {
      type: String,
      default: 'en'
    },
    currency: {
      type: String,
      default: 'INR'
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'device'],
      default: 'light'
    },
    timeZone: {
      type: String,
      default: 'Asia/Kolkata'
    },
    notifications: {
      transactionAlerts: {
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
        }
      },

      securityAlerts: {
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
        }
      }
    }
  },

  privacy: {
    visibility: {
      type: String,
      enum: ['public', 'private'],
      default: 'private'
    },
    transactionVisibility: {
      type: String,
      enum: ['show_all', 'hide_amount', 'hide_all']
    }
  },

  accessibility: {
    fontSize: {
      type: String,
      highContrast: {
        type: Boolean,
        default: false
      },
      screenReader: {
        type: Boolean,
        default: false
      },
      voiceAssistant: {
        type: Boolean,
        default: false
      }
    }
  },

  status: {
    type: String,
    enum: ['active', 'dormant', 'suspended', 'blocked', 'pending_verification']
  },

  riskProfile: {
    score: {
      type: Number,
      min:0,
      max:100,
      default: 0
    },
    level: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'low'
    },
    factors: [{
      type: String
    }],
    lastAssessed: Date,
    history: [{
      score: Number,
      level: String,
      reason: String,
      assessedAt: Date,
      _id: ObjectId()
    }]
  },

  compliance: {
    amlStatus: {
      type: String,
      enum: ['clear', 'flagged', 'blocked', 'under_review'],
      default: 'clear'
    },
    watchListChecked:{
      type: Boolean,
      default: false
    },
    lastWatchListChecked: Date,
    pep: { // Politically Exposed Person
      type: Boolean,
      default: false
    },
    sanctions: {
      type: Boolean,
      default: false
    },
    riskCategory: {
      type: String,
      enum: ['low', 'medium', 'high']
    }
  },

  createdAt: Date,
  updatedAt: Date,
  lastLogin: Date,
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date,

  metadata: {
    source: {
      type: String,
      enum: ['app', 'web', 'api']
    },
    referralCode: String,
    referredBy: String,
    termsAcceptedAt: Date,
    privacyPolicyAcceptedAt: Date,
    consentVersion: String
  }
}, {
  timestamps: true,
  collection: 'users'
});

userSchema.createIndex({"profile.phone": 1}, {unique: true, sparse: true});
userSchema.createIndex({ "profile.email": 1 }, { unique: true, sparse: true });
userSchema.createIndex({ "upi.upiId": 1 }, { unique: true, sparse: true });
userSchema.createIndex({ "upi.upiIDs": 1 }, { unique: true, sparse: true });
userSchema.createIndex({ "status": 1, "createdAt": -1 });
userSchema.createIndex({ "kyc.status": 1, "updatedAt": -1 });
userSchema.createIndex({"device.deviceId": 1, "userId": 1});


const User = mongoose.model("User", userSchema);
export default User;