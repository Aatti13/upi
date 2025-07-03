import mongoose from 'mongoose';

const fraudSchema = new mongoose.Schema({
  transactionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction',
    required: true,
    unique: true
  },
  senderUPI: {
    type: String,
    required: true
  },
  receiverUPI: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  features: {
    hourOfDay: { type:Number },
    dayOfWeek: { type:Number },
    isWeekend: { type:Boolean },
    isNightTime: { type:Boolean },

    amountCategory: {
      type: String,
      enum: ['micro', 'small', 'medium', 'large', 'very_large']
    },
    roundAmount: { type:Boolean },

    // Sender Transaction Patterns
    senderTransactionCount24h: { type:Number, default:0 },
    senderAmountSum24h: { type:Number, default:0 },
    senderTransactionCount7d: { type:Number, default:0 },
    senderAmountSum7d: { type:Number, default:0 },
    senderUniqueReceivers24h: { type: Number, default: 0 },
    senderAvgTransactionAmount: { type: Number, default: 0 },

    // Receiver Transaction Patterns
    receiverTransactionCount24h: { type: Number, default: 0 },
    receiverAmountSum24h: { type: Number, default: 0 },
    receiverUniquesSenders24h: { type: Number, default: 0 },

    // Relationship Transaction Patterns
    senderReceiverHistory: { type:Number, default:0 },
    firstTimeTransaction: { type:Boolean, default:true },

    // Transaction Velocity Patterns
    timeSinceLastTransaction: { type:Number }, //In minutes
    rapidFireTransactions: { type:Boolean, default:false },

    // Behavioural Patterns
    unusualHour: { type:Boolean, default:false },
    unusualAmount: { type:Boolean, default:false },
    potentialStructuring: { type:Boolean, default:false }
  },

  mlResults: {
    fraudProbability: { type:Number, min:0, max:1 },
    riskScore: { type:Number, min:0, max:100 },
    modelVersion: { type:String },
    confidence: { type:Number, min:0, max:1 },

    anomalyScore: { type:Number },
    patternScore: { type:Number },
    velocityScore: { type:Number },
    behaviouralScore: { type:Number }
  },

  ruleBasedFlags: [{
    rule: { type:String },
    triggered: { type:Boolean },
    severity: { type:String, enum:['low', 'medium', 'high', 'critical'] },
    description: { type:string }
  }],

  finalDecision: {
    isFraudulent: { type:Boolean, default:false },
    riskLevel: {
      type:String,
      enum: ['very_low', 'low', 'medium', 'high', 'very_high'],
      default: 'low'
    },
    action: {
      type: String,
      enum: ['approve', 'review', 'block', 'require_additional_auth'],
      default: 'approve'
    },
    flaggedReason: [{type:String}]
  },

  processingTime: { type:Number },
  analysisCompleted: { type:Boolean, default:false },

  actualOutcome: {
    type:String,
    enum: ['legitimate', 'fraudulent', 'disputed', 'unknown'],
    default: 'unknown'
  }
})
