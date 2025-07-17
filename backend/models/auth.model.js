import bcrypt from 'bcrypt';
import mongoose from "mongoose"; 

const authSchema = new mongoose.Schema({
  mobile: {
    type: String,
    required: true,
    unique: true,
    match: /^[0-9]{10}$/,
    index: true
  },
  mpin: {
    type: String,
    required: true,
    minLength: 4,
    maxLength: 6,
    select: false
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
    select: false
  },

  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  isVerified: {
    type: Boolean, 
    default: false,
    index: true
  },

  failedLoginAttempts: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  accountLockedUntil: {
    type: Date,
    index: true
  },

  twoFactorEnabled: {
    type: Boolean, 
    default: false
  },
  twoFactorSecret: {
    type: String,
    select: false
  },

  registeredDevices: [{
    deviceId: {
      type: String,
      required: true,
      unique: true
    },
    deviceName: {
      type: String,
      required: true
    },
    deviceType: {
      type: String,
      enum: ['android', 'web', 'ios'],
    },
    isActive: {
      type: Boolean,
      default: true
    },
    lastUsed: {
      type: Date,
      default: Date.now
    },
    registeredAt: {
      type: Date,
      default: Date.now
    }
  }],

  activeSessions: [{
    sessionId: {
      type: String,
      required: true,
      unique: true
    },
    deviceId: {
      type: String,
      required: true
    },
    ipAddress: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      required: true
    }
  }],

  passwordResetToken: {
    type: String,
    select: false
  },
  passwordResetExpires: {
    type: Date,
    select: false
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'auth_users'
});

authSchema.index({ mobileNumber: 1 });
authSchema.index({ isActive: 1, isVerified: 1 });
authSchema.index({ createdAt: -1 });
authSchema.index({ accountLockedUntil: 1 }, { sparse: true });

authSchema.methods.comparePassword = async function(userPassword) {
  return bcrypt.compare(userPassword, this.password);
};

authSchema.methods.compareMpin = async function(userMpin) {
  return bcrypt.compare(userMpin, this.mpin);
}

authSchema.methods.generatePasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetExpires = Date.now() + 15 * 60 * 1000;
  return resetToken; 
}

authSchema.methods.isAccountLocked = function() {
  return !!this.accountLockedUntil && this.accountLockedUntil > Date.now();
}

authSchema.methods.lockAccount = function(duration = 30) {
  this.accountLockedUntil = Date.now() + duration * 60 * 1000;
}

authSchema.methods.incrementFailedLoginAttempts = function() {
  this.failedLoginAttempts += 1;

  if(this.failedLoginAttempts >= 5) {
    this.lockAccount(30);
  }
  return this.save();
}

authSchema.methods.resetFailedLoginAttempts = function() {
  if(this.failedLoginAttempts > 0 || this.accountLockedUntil) {
    this.failedLoginAttempts = 0;
    this.accountLockedUntil = undefined;
    return this.save();
  }
}

authSchema.pre('save', async function(next) {
  if((!this.isModified('password')) && !this.isModified('mpin')) return next();

  if(this.isModified('password') && this.password) {
    this.password = await bcrypt.hash(this.password, 12);
  }

  if(this.isModified('mpin') && this.mpin) {
    this.mpin = await bcrypt.hash(this.mpin, 12);
  }

  next();
})

const Auth = mongoose.model('Auth', authSchema);
export default Auth;