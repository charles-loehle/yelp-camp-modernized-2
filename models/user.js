const mongoose = require('mongoose');
const passortLocalMongoose = require('passport-local-mongoose');

const UserSchema = mongoose.Schema({
  username: String,
  password: String,
});

UserSchema.plugin(passortLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
