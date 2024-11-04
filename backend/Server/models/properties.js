const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PropertySchema = new Schema({
  property_name: {
    type: String,
    required: true
  },
  image: {
    type: [String],  // Array of image file names
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  location: {
   
    latitude: {
      type: Number,
      required: false  // Optional in case not always available
    },
    longitude: {
      type: Number,
      required: false  // Optional in case not always available
    }
  },
  address: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  status: {
    type: Boolean,
    default: true  // Assuming 'true' means active
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Reference to the User model
    required: true
  },
  verification: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update 'updatedAt' before saving
PropertySchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Property', PropertySchema);
