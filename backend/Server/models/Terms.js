// models/Terms.js
const mongoose = require("mongoose");

const termsandconditions = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    version: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("termsandconditions", termsandconditions);
