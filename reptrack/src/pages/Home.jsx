import React, { useState } from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import StatusBar from '../components/StatusBar';
import BottomNav from '../components/BottomNav';
import { useApp } from '../context/AppContext';
import './Home.css';

const bpmData = [
  { v: 72 }, { v: 85 }, { v: 78 }, { v: 89 }, { v: 82 }, { v: 76 }, { v: 80 },
  { v: 74 }, { v: 88 }, { v: 83 }, { v: 79 }, { v: 85 },
];

export default function Home({ onNavigate }) {
  const { user, activity } = useApp();

  return (
    <div className="home-page">
      <StatusBar />
      <div className="page">
        {/* Header */}
        <div className="home-header">
          <div className="home-user">
            <div className="avatar">
              <span>{user.name[0]}</span>
            </div>
            <div>
              <p className="welcome-text">Welcome Back!</p>
              <p className="user-name">{user.name}</p>
            </div>
          </div>
          <div className="home-actions">
            <button className="icon-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </button>
            <button className="icon-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Hero text */}
        <div className="home-hero-text">
          <h2>Always keep<br/>yourself safe and</h2>
          <h2 className="green-word">Healthy</h2>
        </div>

        {/* Stats row */}
        <div className="stats-row card">
          <div className="stat-chip">
            <svg viewBox="0 0 24 24" fill="none" stroke="#3ddc5c" strokeWidth="2" width="20" height="20">
              <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
            </svg>
            <span className="value">{user.weight} KG</span>
            <span className="label">Weight</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-chip">
            <svg viewBox="0 0 24 24" fill="none" stroke="#3ddc5c" strokeWidth="2" width="20" height="20">
              <line x1="12" y1="2" x2="12" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
            <span className="value">{user.height} Ft</span>
            <span className="label">Height</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-chip">
            <svg viewBox="0 0 24 24" fill="none" stroke="#3ddc5c" strokeWidth="2" width="20" height="20">
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
            </svg>
            <span className="value">{user.age} year</span>
            <span className="label">Age</span>
          </div>
        </div>

        {/* BPM Chart */}
        <div className="home-section">
          <div className="section-header">
            <span className="section-title">Heart AVG bpm</span>
            <span className="green-val">{activity.heartBpm}</span>
          </div>
          <div className="card bpm-card">
            <div className="bpm-card-header">
              <span className="bpm-label">Heart's bpm</span>
              <span className="bpm-val">89</span>
              <div style={{ display: 'flex', gap: 8, marginLeft: 'auto' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" width="16" height="16"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                <svg viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" width="16" height="16"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={80}>
              <LineChart data={bpmData}>
                <Line type="monotone" dataKey="v" stroke="#3ddc5c" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
            <div className="bpm-days">
              {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
                <span key={d} className={`day-label ${d === 'We' ? 'active' : ''}`}>{d}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Health Stats */}
        <div className="home-section">
          <p className="section-title" style={{ marginBottom: 12 }}>Health Stats</p>
          <div className="card health-stat-card">
            <div className="health-stat-inner">
              <div className="heart-icon">
                <svg viewBox="0 0 24 24" fill="#ff4d4d" width="20" height="20">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </div>
              <div>
                <p className="health-stat-label">Heart Health</p>
                <p className="health-stat-val">{activity.heartHealth}</p>
              </div>
            </div>
            <button className="measure-btn" onClick={() => onNavigate('pulse')}>Measure</button>
          </div>
        </div>

        {/* New Features Row */}
        <div className="home-section">
          <p className="section-title" style={{ marginBottom: 12 }}>Quick Access</p>
          <div className="quick-features-row">
            <button className="qf-card" onClick={() => onNavigate('posture')}>
              <span className="qf-icon">🤸</span>
              <span className="qf-label">Posture AI</span>
              <span className="qf-sub">Camera detect</span>
            </button>
            <button className="qf-card" onClick={() => onNavigate('media')}>
              <span className="qf-icon">🎵</span>
              <span className="qf-label">Media</span>
              <span className="qf-sub">Music & Podcast</span>
            </button>
            <button className="qf-card" onClick={() => onNavigate('band')}>
              <span className="qf-icon">⌚</span>
              <span className="qf-label">Band</span>
              <span className="qf-sub">Connect device</span>
            </button>
          </div>
        </div>

        <div style={{ height: 20 }} />
      </div>
      <BottomNav activePage="home" onNavigate={onNavigate} />
    </div>
  );
}
