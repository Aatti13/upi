import mongoose from "mongoose"; 

const blackListedTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 }
  }
}, { timestamps: true });

const BlackListedToken = mongoose.model('BlackListedToken', blackListedTokenSchema);

export default BlackListedToken;