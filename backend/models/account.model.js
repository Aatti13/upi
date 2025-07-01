import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  accountNo: {
    type: String,
    unique: true,
  },
  balance: {
    type: Number,
    required: true,
    default: 0
  },
  bankName: {
    type: String,
    default: 'Default Bank',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  accountType: {
    type: String,
    enum: ['savings', 'current', 'fixed'],
    required: true
  },
  ifsCode: {
    type: String,
    default: 'IFSC0001',
  }
}, {timestamps: true});

accountSchema.pre('save', async function(next){
  if(!this.accountNo) {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random * 1000).toString().padStart(5, '0');
    this.accountNumber = `BCMC${timestamp.slice(-8)}${random}`;
  }
  next();
});

const Account = mongoose.model('Account', accountSchema);

export default Account;

