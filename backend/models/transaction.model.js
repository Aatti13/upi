import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  senderUPI: {
    type: String,
    required: true,
  },
  receiverUPI: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['initiated', 'pending', 'debited', 'failed', 'credited', 'completed', 'failed', 'flagges'],
    default: 'initiated',
  },
  flaggedBecause: {
    type: String,
    default: '',
  },
  fraudScore: {
    type: Number,
    default: 0,
  },
  initiatedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date,
    default: null
  },
}, {timestamps: true});

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;