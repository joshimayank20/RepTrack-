const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false, // never returned in queries by default
  },
  // Onboarding profile
  profile: {
    weight: { type: Number, default: 70 },   // kg
    height: { type: Number, default: 5.8 },  // ft
    age:    { type: Number, default: 25 },
    gender: { type: String, enum: ['male', 'female', 'other'], default: 'male' },
    fitnessGoal: {
      type: String,
      enum: ['weight_loss', 'muscle_gain', 'endurance', 'flexibility'],
      default: 'weight_loss',
    },
    workoutFrequency: { type: Number, default: 3 }, // days per week
  },
  plan: {
    type: String,
    enum: ['basic', 'pro', 'elite'],
    default: 'basic',
  },
  streak: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with stored hash
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT token
UserSchema.methods.getSignedToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

module.exports = mongoose.model('User', UserSchema);
