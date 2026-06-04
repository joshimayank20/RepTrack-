import React, { useState } from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import StatusBar from '../components/StatusBar';
import BottomNav from '../components/BottomNav';
import { useApp } from '../context/AppContext';
import './Activity.css';

const weekData = [
  { v: 5000 }, { v: 7200 }, { v: 6800 }, { v: 9100 }, { v: 7654 }, { v: 8300 }, { v: 6100 },
];

const dayPlans = [
  { icon: '🏋️', label: 'Workout', detail: '2 hours' },
  { icon: '😴', label: 'Sleeping', detail: '9 hours' },
  { icon: '🏃', label: 'Running', detail: '10 km' },
  { icon: '🧘', label: 'Yoga', detail: '30 min' },
];

const tabs = ['Day', 'Week', 'Month', 'Year'];

export default function Activity({ onNavigate }) {
  const { activity } = useApp();
  const [activeTab, setActiveTab] = useState('Week');

  return (
    <div className="activity-page">
      <StatusBar />
      <div className="page">
        {/* Header */}
        <div className="activity-header">
          <button className="back-btn" onClick={() => onNavigate('home')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="22" height="22">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <h2 className="activity-title">Activity</h2>
          <div className="activity-avatar">
            <svg viewBox="0 0 24 24" fill="none" stroke="#3ddc5c" strokeWidth="2" width="18" height="18">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
        </div>

        {/* Date */}
        <div className="activity-date-section">
          <p className="today-label">Today</p>
          <p className="today-date">July 15, 2023</p>
        </div>

        {/* Tabs */}
        <div className="tab-row">
          {tabs.map(t => (
            <button
              key={t}
              className={`tab-btn ${activeTab === t ? 'active' : ''}`}
              onClick={() => setActiveTab(t)}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Steps chart */}
        <div className="steps-chart-card card">
          <div className="steps-chart">
            <ResponsiveContainer width="100%" height={120}>
              <AreaChart data={weekData}>
                <defs>
                  <linearGradient id="stepsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3ddc5c" stopOpacity={0.4}/>
                    <stop offset="100%" stopColor="#3ddc5c" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="v" stroke="#3ddc5c" strokeWidth={2.5} fill="url(#stepsGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="steps-info">
            <p className="steps-count">{activity.steps.toLocaleString()}</p>
            <p className="steps-label">Steps</p>
            <span className="green-badge">+14%</span>
          </div>
          <div className="steps-stats">
            <div className="stat-chip">
              <span className="value">{activity.distance}</span>
              <span className="label">Distance</span>
            </div>
            <div className="stat-chip">
              <span className="value">{activity.calories.toLocaleString()}</span>
              <span className="label">Calories</span>
            </div>
            <div className="stat-chip">
              <span className="value">{activity.time}</span>
              <span className="label">Time</span>
            </div>
          </div>
        </div>

        {/* Day Plan */}
        <div className="home-section">
          <p className="section-title" style={{ marginBottom: 14 }}>Day plan</p>
          <div className="day-plan-row">
            {dayPlans.map((p, i) => (
              <div key={i} className="day-plan-card card">
                <span className="day-plan-icon">{p.icon}</span>
                <span className="day-plan-label">{p.label}</span>
                <span className="day-plan-detail">{p.detail}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ height: 20 }} />
      </div>
      <BottomNav activePage="activity" onNavigate={onNavigate} />
    </div>
  );
}
