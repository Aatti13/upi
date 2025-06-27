import mongoose from 'mongoose';

const upiSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  upiId: {
    type: String,
    required: true,
    unique: true
  },
  linkedUpi: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UPI',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

const UPI = mongoose.model('UPI', upiSchema);

export default UPI;
