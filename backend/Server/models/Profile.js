const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    first_name: String,
    middle_name: String,
    last_name: String,
    phoneNumber: String,
    address: String,
    profile_picture: String,
    id_image: String,
    birth_date: Date,
    verification: {
      type: String,
      enum: ["pepnding", "verified", "rejected"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", ProfileSchema);
