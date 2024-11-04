const mongoose = require('mongoose');

const damagereports = new mongoose.Schema({
  description: { type: String, required: true },
  estimation: { type: Number, required: true },
  bookingId: { type: String, required: true },
  solved: { type: Boolean, default: false },
  agree: { type: Boolean, default: false },
  disagree: { type: Boolean, default: false },
  image: [String]
}, { timestamps: true });

module.exports = mongoose.model('DamageReport', damagereports);
