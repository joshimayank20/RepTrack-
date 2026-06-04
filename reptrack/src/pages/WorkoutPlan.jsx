import React, { useState } from 'react';
import StatusBar from '../components/StatusBar';
import BottomNav from '../components/BottomNav';
import './WorkoutPlan.css';

const exercises = [
  {
    name: 'Push Ups',
    steps: [
      'Start in a high plank position (like the start of a push-up).',
      'Keep your body straight and core tight.',
      'Lift your right hand and tap your left shoulder.',
      'Return the hand to the floor.',
      'Repeat with the left hand tapping the right shoulder.',
    ],
    reps: ['3 sets', '20 taps total (10 each side)', '30–40 seconds rest between sets'],
    emoji: '💪',
  },
  {
    name: 'Squats',
    steps: [
      'Stand with feet shoulder-width apart.',
      'Lower your body as if sitting in a chair.',
      'Keep your back straight and knees behind toes.',
      'Push through heels to return to start.',
    ],
    reps: ['3 sets', '15 reps', '45 seconds rest'],
    emoji: '🦵',
  },
  {
    name: 'Plank Hold',
    steps: [
      'Get into a forearm plank position.',
      'Keep your body in a straight line from head to heels.',
      'Engage your core and glutes.',
      'Hold for the specified duration.',
    ],
    reps: ['3 sets', '30–60 seconds hold', '30 seconds rest'],
    emoji: '🧘',
  },
];

export default function WorkoutPlan({ onNavigate }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const ex = exercises[activeIdx];

  return (
    <div className="workout-page">
      <StatusBar />
      <div className="page">
        <div className="workout-header">
          <button className="back-btn" onClick={() => onNavigate('home')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="22" height="22">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <h2 className="workout-title">Workout Plan</h2>
          <div className="workout-avatar">
            <svg viewBox="0 0 24 24" fill="none" stroke="#3ddc5c" strokeWidth="2" width="18" height="18">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
        </div>

        {/* Exercise tabs */}
        <div className="exercise-tabs">
          {exercises.map((e, i) => (
            <button
              key={i}
              className={`exercise-tab ${activeIdx === i ? 'active' : ''}`}
              onClick={() => setActiveIdx(i)}
            >
              {e.name}
            </button>
          ))}
        </div>

        {/* Exercise card */}
        <div className="exercise-card card">
          <div className="exercise-img">
            <span className="exercise-emoji">{ex.emoji}</span>
          </div>
          <div className="exercise-details">
            <p className="steps-section-label">Steps</p>
            <ol className="steps-list">
              {ex.steps.map((s, i) => <li key={i}>{s}</li>)}
            </ol>
            <p className="reps-label">Reps for Beginners</p>
            <ul className="reps-list">
              {ex.reps.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </div>
        </div>

        <div className="workout-start-wrap">
          <button className="btn-primary">START</button>
        </div>
      </div>
      <BottomNav activePage="workout" onNavigate={onNavigate} />
    </div>
  );
}
