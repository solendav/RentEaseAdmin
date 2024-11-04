const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  property_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
  tenant_id: mongoose.Schema.Types.ObjectId,
  owner_id: mongoose.Schema.Types.ObjectId,
  start_date: Date,
  end_date: Date,
  approval: String,
  status: String,
  message: String,
  totalPrice: Number,
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
  returned: Boolean
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
