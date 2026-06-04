import React from 'react';

export default function StatusBar() {
  return (
    <div className="status-bar">
      <span className="time">9:30</span>
      <div className="status-icons">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M1.5 8.5C5.5 4.5 18.5 4.5 22.5 8.5L20.5 10.5C17.5 7.5 6.5 7.5 3.5 10.5L1.5 8.5Z"/><path d="M5 12C8 9 16 9 19 12L17 14C15 12 9 12 7 14L5 12Z"/><path d="M8.5 15.5C10 14 14 14 15.5 15.5L12 19L8.5 15.5Z"/></svg>
        <svg viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="7" width="15" height="10" rx="2"/><path d="M22 10V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
      </div>
    </div>
  );
}
