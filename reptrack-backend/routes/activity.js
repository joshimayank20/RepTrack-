const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// All routes below require login
router.use(protect);

// ─────────────────────────────────────────────────────────────
// GET /api/activity/today
// Returns today's activity for logged-in user
// ─────────────────────────────────────────────────────────────
router.get('/today', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let activity = await Activity.findOne({ user: req.user._id, date: today });

    // Auto-create today's record if it doesn't exist
    if (!activity) {
      activity = await Activity.create({ user: req.user._id, date: today });
    }

    res.json({ success: true, activity });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// GET /api/activity/history?days=7
// Returns last N days of activity (default 7)
// ─────────────────────────────────────────────────────────────
router.get('/history', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const from = new Date();
    from.setDate(from.getDate() - days);
    from.setHours(0, 0, 0, 0);

    const history = await Activity.find({
      user: req.user._id,
      date: { $gte: from },
    }).sort({ date: -1 });

    res.json({ success: true, count: history.length, history });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// POST /api/activity/steps
// Body: { steps, distance, calories, heartBpm }
// Upserts today's step/heart data (called from band sync or manual)
// ─────────────────────────────────────────────────────────────
router.post('/steps', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { steps, distance, calories, heartBpm, heartHealth, bandData } = req.body;

    const update = {
      $set: {
        steps: steps ?? 0,
        distance: distance ?? 0,
        calories: calories ?? 0,
        heartBpm: heartBpm ?? 0,
        heartHealth: heartHealth ?? 0,
      },
    };

    if (bandData) update.$set.bandData = bandData;

    const activity = await Activity.findOneAndUpdate(
      { user: req.user._id, date: today },
      update,
      { new: true, upsert: true }
    );

    // Update streak on the user
    await updateStreak(req.user._id);

    res.json({ success: true, activity });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// POST /api/activity/workout
// Body: { exercise, sets, reps, duration, postureScore }
// Logs a single workout session to today's record
// ─────────────────────────────────────────────────────────────
router.post('/workout', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { exercise, sets, reps, duration, postureScore } = req.body;

    const workoutEntry = {
      exercise,
      sets: sets ?? 0,
      reps: reps ?? 0,
      duration: duration ?? 0,
      postureScore: postureScore ?? 100,
      completedAt: new Date(),
    };

    const activity = await Activity.findOneAndUpdate(
      { user: req.user._id, date: today },
      { $push: { workouts: workoutEntry } },
      { new: true, upsert: true }
    );

    res.json({ success: true, activity });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// GET /api/activity/stats/weekly
// Aggregated weekly step/calorie totals for Progress Tracker charts
// ─────────────────────────────────────────────────────────────
router.get('/stats/weekly', async (req, res) => {
  try {
    const from = new Date();
    from.setDate(from.getDate() - 6);
    from.setHours(0, 0, 0, 0);

    const data = await Activity.aggregate([
      { $match: { user: req.user._id, date: { $gte: from } } },
      {
        $group: {
          _id: { $dayOfWeek: '$date' },
          steps:    { $sum: '$steps' },
          calories: { $sum: '$calories' },
          date:     { $first: '$date' },
        },
      },
      { $sort: { '_id': 1 } },
    ]);

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// Helper: calculate and update user streak
// ─────────────────────────────────────────────────────────────
async function updateStreak(userId) {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);

  const yesterdayActivity = await Activity.findOne({
    user: userId,
    date: yesterday,
    steps: { $gt: 500 }, // at least 500 steps = active day
  });

  const user = await User.findById(userId);
  if (yesterdayActivity) {
    user.streak = (user.streak || 0) + 1;
  } else {
    user.streak = 1; // reset
  }
  await user.save();
}

module.exports = router;
