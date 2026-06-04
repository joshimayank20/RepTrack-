const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    default: () => new Date().setHours(0, 0, 0, 0), // midnight of today
  },
  steps:    { type: Number, default: 0 },
  distance: { type: Number, default: 0 }, // km
  calories: { type: Number, default: 0 },
  activeMinutes: { type: Number, default: 0 },
  heartBpm: { type: Number, default: 0 },
  heartHealth: { type: Number, default: 0 }, // 0-100 score

  // Band data
  bandData: {
    deviceName: { type: String },
    batteryLevel: { type: Number },
    syncedAt: { type: Date },
  },

  // Workout sessions logged that day
  workouts: [
    {
      exercise: { type: String },   // e.g. 'Push Ups'
      sets:     { type: Number },
      reps:     { type: Number },
      duration: { type: Number },   // seconds
      postureScore: { type: Number }, // % 0-100 from posture detection
      completedAt: { type: Date, default: Date.now },
    },
  ],
}, { timestamps: true });

// One activity record per user per day (unique index)
ActivitySchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Activity', ActivitySchema);
