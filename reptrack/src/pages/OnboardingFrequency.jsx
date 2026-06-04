import React, { useState } from 'react';
import StatusBar from '../components/StatusBar';
import './OnboardingFrequency.css';

const options = [
  'I workout almost everyday',
  'Thrice a week',
  'I am a beginner, I don\'t workout',
];

export default function OnboardingFrequency({ onNavigate }) {
  const [selected, setSelected] = useState(null);

  return (
    <div className="ob-freq-page">
      <StatusBar />
      <div className="ob-freq-bg">
        <div className="ob-freq-overlay" />
        <div className="ob-freq-content">
          <p className="ob-freq-question">How often do you work out ?</p>
          <div className="ob-freq-options">
            {options.map((opt, i) => (
              <button
                key={i}
                className={`ob-freq-option ${selected === i ? 'selected' : ''}`}
                onClick={() => setSelected(i)}
              >
                {opt}
              </button>
            ))}
          </div>
          <button
            className="btn-primary"
            style={{ marginTop: 8 }}
            onClick={() => selected !== null && onNavigate('home')}
          >
            SUBMIT
          </button>
        </div>
        <div className="ob-freq-word">FOCUS.</div>
      </div>
    </div>
  );
}
