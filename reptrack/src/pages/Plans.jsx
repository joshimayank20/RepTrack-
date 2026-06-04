import React from 'react';
import StatusBar from '../components/StatusBar';
import BottomNav from '../components/BottomNav';
import './Plans.css';

const plans = [
  {
    name: 'Pro Plan',
    color: '#3ddc5c',
    features: ['Personalized workout plans', 'AI posture correction', 'Diet recommendations', 'Progress analytics'],
    price: '₹5900',
    trial: 'one month free trial',
    priceLabel: 'Get 6 months for',
  },
  {
    name: 'Elite',
    color: '#f5c518',
    features: ['Live trainer sessions', 'Community challenges', 'Advanced analytics'],
    price: '₹14500',
    trial: 'one month free trial',
    priceLabel: 'Get 6 months for',
  },
  {
    name: 'Basic Plan',
    color: '#aaaaaa',
    features: ['Basic workouts', 'Limited progress tracking'],
    price: null,
    trial: null,
    priceLabel: 'Free plan',
  },
];

export default function Plans({ onNavigate }) {
  return (
    <div className="plans-page">
      <StatusBar />
      <div className="page">
        <div className="plans-header">
          <button className="back-btn" onClick={() => onNavigate('home')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="22" height="22">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <h2 className="plans-title">Manage your plan</h2>
          <div style={{ width: 30 }} />
        </div>

        <div className="plans-list">
          {plans.map((plan, i) => (
            <div key={i} className="plan-card card" style={{ '--plan-color': plan.color }}>
              <p className="plan-name" style={{ color: plan.color }}>{plan.name}</p>
              <ul className="plan-features">
                {plan.features.map((f, j) => (
                  <li key={j}>{f}</li>
                ))}
              </ul>
              {plan.price ? (
                <div className="plan-price-row">
                  <span className="plan-price-label">{plan.priceLabel} </span>
                  <span className="plan-price" style={{ color: plan.color }}>{plan.price}</span>
                </div>
              ) : (
                <p className="plan-free" style={{ color: plan.color }}>{plan.priceLabel}</p>
              )}
              {plan.trial && <p className="plan-trial">{plan.trial}</p>}
            </div>
          ))}
        </div>

        <div style={{ padding: '16px 20px 40px' }}>
          <button className="btn-primary" onClick={() => onNavigate('home')}>Back</button>
        </div>
      </div>
      <BottomNav activePage="plans" onNavigate={onNavigate} />
    </div>
  );
}
