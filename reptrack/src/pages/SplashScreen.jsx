import React, { useEffect } from 'react';
import StatusBar from '../components/StatusBar';
import './SplashScreen.css';

export default function SplashScreen({ onNavigate }) {
  return (
    <div className="splash-page">
      <StatusBar />
      <div className="splash-bg">
        <div className="splash-overlay" />
        <div className="splash-content">
          <div className="splash-logo">
            <svg className="logo-icon" viewBox="0 0 60 60" fill="none">
              <path d="M30 5L50 20V40L30 55L10 40V20L30 5Z" stroke="#3ddc5c" strokeWidth="2" fill="rgba(61,220,92,0.08)"/>
              <path d="M20 30L26 36L40 22" stroke="#3ddc5c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="30" cy="30" r="8" stroke="#3ddc5c" strokeWidth="1.5" fill="none"/>
            </svg>
            <h1 className="logo-name">RepTrack</h1>
            <p className="logo-tagline">make your every rep count</p>
          </div>
        </div>
      </div>
      <div className="splash-footer">
        <button className="btn-primary" onClick={() => onNavigate('signup')}>
          Get Started
        </button>
        <p className="signin-text">
          Already have an account?{' '}
          <span className="signin-link" onClick={() => onNavigate('home')}>Sign In</span>
        </p>
      </div>
    </div>
  );
}
