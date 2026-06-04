import React from 'react';

const NavIcon = ({ active, children }) => (
  <div className={`nav-item ${active ? 'active' : ''}`}>
    {children}
  </div>
);

export default function BottomNav({ activePage, onNavigate }) {
  return (
    <div className="bottom-nav">
      <NavIcon active={activePage === 'home'}>
        <svg onClick={() => onNavigate('home')} viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 9.5L12 3L21 9.5V20C21 20.55 20.55 21 20 21H15V15H9V21H4C3.45 21 3 20.55 3 20V9.5Z"/>
        </svg>
      </NavIcon>
      <NavIcon active={activePage === 'workout'}>
        <svg onClick={() => onNavigate('workout')} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 4V20M18 4V20M3 8H6M18 8H21M3 16H6M18 16H21M6 12H18"/>
        </svg>
      </NavIcon>
      <NavIcon active={activePage === 'media'}>
        <svg onClick={() => onNavigate('media')} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 3v3M12 18v3M3 12h3M18 12h3"/>
        </svg>
      </NavIcon>
      <NavIcon active={activePage === 'band'}>
        <svg onClick={() => onNavigate('band')} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="7" y="2" width="10" height="20" rx="4"/>
          <rect x="9" y="7" width="6" height="5" rx="1"/>
          <line x1="9" y1="16" x2="15" y2="16"/>
        </svg>
      </NavIcon>
      <NavIcon active={activePage === 'plans'}>
        <svg onClick={() => onNavigate('plans')} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
          <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
        </svg>
      </NavIcon>
    </div>
  );
}
