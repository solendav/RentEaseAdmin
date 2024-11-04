const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['transfer', 'withdrawal', 'deposit'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  tx_ref: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
  fromAccountNo: {
    type: String,
    required: true,
  },
  toAccountNo: {
    type: String,
    required: true,
  },
  seen: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
