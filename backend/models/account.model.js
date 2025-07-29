import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
  accountId: mongoose.Types.ObjectId(),
  userId: String,

  bankDetails: {
    bankName: {
      type: String,
      required: true
    },
    ifscCode: {
      type: String,
      default: 'IFSC0001',
      match: /^[A-Z]{4}0$/
    }
  }
}, {
  timestamps: true,
  collection: 'account'
});

const Account = mongoose.model("Account", accountSchema);
export default Account;