import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import StatusBar from '../components/StatusBar';
import './PulseMeasuring.css';

function generateBeat() {
  return Array.from({ length: 30 }, (_, i) => ({
    v: 50 + Math.sin(i * 0.8) * 30 + (Math.random() - 0.5) * 15,
  }));
}

export default function PulseMeasuring({ onNavigate }) {
  const [recording, setRecording] = useState(true);
  const [progress, setProgress] = useState(65);
  const [data, setData] = useState(generateBeat());
  const intervalRef = useRef(null);

  useEffect(() => {
    if (recording) {
      intervalRef.current = setInterval(() => {
        setData(generateBeat());
        setProgress(p => Math.min(p + 1, 99));
      }, 500);
    }
    return () => clearInterval(intervalRef.current);
  }, [recording]);

  const handleStop = () => {
    setRecording(false);
    clearInterval(intervalRef.current);
    setTimeout(() => onNavigate('home'), 800);
  };

  return (
    <div className="pulse-page">
      <StatusBar />
      <div className="page">
        {/* Header */}
        <div className="pulse-header">
          <button className="back-btn" onClick={() => onNavigate('home')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="22" height="22">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <h2 className="pulse-title">Pulse Measuring</h2>
          <div className="pulse-avatar">
            <svg viewBox="0 0 24 24" fill="none" stroke="#3ddc5c" strokeWidth="2" width="18" height="18">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
        </div>

        {/* Ring indicator */}
        <div className="pulse-ring-wrap">
          <div className="pulse-ring outer" />
          <div className="pulse-ring middle" />
          <div className="pulse-ring inner" />
          <div className="pulse-center">
            <span className="pulse-pct">{progress}%</span>
          </div>
        </div>

        <p className="pulse-status">Recording your beats</p>

        {/* Live waveform */}
        <div className="pulse-wave-wrap">
          <ResponsiveContainer width="100%" height={100}>
            <LineChart data={data}>
              <Line type="monotone" dataKey="v" stroke="#3ddc5c" strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="pulse-stop-wrap">
          <button className="btn-primary pulse-stop-btn" onClick={handleStop}>
            STOP
          </button>
        </div>
      </div>
    </div>
  );
}
