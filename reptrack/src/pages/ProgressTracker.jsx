import React from 'react';
import { BarChart, Bar, XAxis, ResponsiveContainer, LineChart, Line } from 'recharts';
import StatusBar from '../components/StatusBar';
import BottomNav from '../components/BottomNav';
import { useApp } from '../context/AppContext';
import './ProgressTracker.css';

const weekSteps = [
  { day: 'M', v: 8200 }, { day: 'T', v: 9800 }, { day: 'W', v: 7400 },
  { day: 'T', v: 10200 }, { day: 'F', v: 9100 }, { day: 'S', v: 8800 }, { day: 'S', v: 9800 },
];

const calorieData = [
  { v: 90 }, { v: 110 }, { v: 95 }, { v: 120 }, { v: 109 }, { v: 105 }, { v: 115 },
];

export default function ProgressTracker({ onNavigate }) {
  const { user } = useApp();

  return (
    <div className="progress-page">
      <StatusBar />
      <div className="page">
        <div className="progress-header">
          <button className="back-btn" onClick={() => onNavigate('home')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="22" height="22">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <h2 className="progress-title">Progress Tracker</h2>
          <div className="progress-avatar">
            <svg viewBox="0 0 24 24" fill="none" stroke="#3ddc5c" strokeWidth="2" width="18" height="18">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
        </div>

        <p className="streak-line">{user.streak} days streak 🔥</p>

        {/* This Week */}
        <div className="progress-section">
          <div className="card">
            <p className="this-week-label">This week</p>
            <div className="progress-circles">
              <div className="progress-circle-item">
                <p className="circle-sublabel">Step Count</p>
                <div className="green-circle">
                  <span>9800/day</span>
                </div>
              </div>
              <div className="progress-circle-item">
                <p className="circle-sublabel">Workout Time</p>
                <div className="green-circle">
                  <span>45 min</span>
                </div>
              </div>
              <div className="progress-circle-item">
                <p className="circle-sublabel">Calories Burnt</p>
                <div className="green-circle">
                  <span>109.8 cal</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Steps chart */}
        <div className="progress-section">
          <div className="card">
            <p className="chart-card-title">Weekly Steps</p>
            <ResponsiveContainer width="100%" height={90}>
              <BarChart data={weekSteps}>
                <Bar dataKey="v" fill="#3ddc5c" radius={[4,4,0,0]} />
                <XAxis dataKey="day" tick={{ fill: '#555', fontSize: 11 }} axisLine={false} tickLine={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Calorie chart */}
        <div className="progress-section">
          <div className="card">
            <p className="chart-card-title">Calories Burnt</p>
            <ResponsiveContainer width="100%" height={90}>
              <LineChart data={calorieData}>
                <Line type="monotone" dataKey="v" stroke="#3ddc5c" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ padding: '16px 20px 40px' }}>
          <button className="btn-primary">View Full Report</button>
        </div>
      </div>
      <BottomNav activePage="progress" onNavigate={onNavigate} />
    </div>
  );
}
