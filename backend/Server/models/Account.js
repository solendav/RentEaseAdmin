// models/Account.js
const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
  account_no: { type: String, required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  balance: { type: Number, default: 0 },
  deposit: { type: Number, default: 0 },
  password: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Account", accountSchema);
