const mongoose = require('mongoose');
const { Schema } = mongoose;
const gravatar = require('gravatar');
const { v4: uuidv4 } = require('uuid');

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Set password for user'],
  },
  password: {
    type: String,
    required: [true, 'Set password for user'],
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter"
  },
  token: String
});

const User = mongoose.model('User', userSchema);

module.exports = User;

