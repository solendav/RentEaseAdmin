const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');



const UserSchema = new mongoose.Schema({
  user_name: String,
  email: String,
  password: String,
  role: Number,
});

UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const UserModel = mongoose.model("User", UserSchema); // The collection name in MongoDB
module.exports = UserModel;

