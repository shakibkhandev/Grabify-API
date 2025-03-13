const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  id: {
    type: String,
    default: () => require('uuid').v4(), // Generates a UUID
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: false,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['USER', 'ADMIN'], // Assuming Role is an enum with values like USER, ADMIN
    default: 'USER',
  },
  loginType:{
    type: String,
    enum: ['FACEBOOK', 'GOOGLE', 'EMAIL'], // Assuming LoginType is an enum with values like FACEBOOK, GOOGLE, EMAIL
    default: 'EMAIL',
  },
  avatar: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  refreshToken: {
    type: String,
    default: null,
  },
  forgotPasswordToken: {
    type: String,
    default: null,
  },
  forgotPasswordExpiry: {
    type: Date,
    default: null,
  },
  emailVerificationToken: {
    type: String,
    default: null,
  },
  emailVerificationExpiry: {
    type: Date,
    default: null,
  },
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }, // Automatically manage createdAt and updatedAt
});

// Create the model
const User = mongoose.model('User', userSchema);

module.exports = User;