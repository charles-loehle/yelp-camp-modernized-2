const mongoose = require('mongoose');
const passortLocalMongoose = require('passport-local-mongoose');

const UserSchema = mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: String,
  email: { type: String, unique: true, required: true },
  emailToken: String,
  isVerified: Boolean,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

// authentication
UserSchema.plugin(passortLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
