import React, { useState } from 'react';
import StatusBar from '../components/StatusBar';
import { useApp } from '../context/AppContext';
import './OnboardingBody.css';

export default function OnboardingBody({ onNavigate }) {
  const { setUser } = useApp();
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');

  const handleProceed = () => {
    if (weight && height && age) {
      setUser(u => ({ ...u, weight: +weight, height: +height, age: +age }));
      onNavigate('onboarding-frequency');
    }
  };

  return (
    <div className="ob-body-page">
      <StatusBar />
      <div className="ob-body-hero">
        <div className="ob-body-overlay" />
        <div className="ob-body-headline">
          <h2>YOGA BEGINS<br/>WITH LISTENING</h2>
        </div>
      </div>
      <div className="ob-body-form">
        <input
          className="input-field"
          type="number"
          placeholder="Weight (kg)"
          value={weight}
          onChange={e => setWeight(e.target.value)}
        />
        <input
          className="input-field"
          type="number"
          placeholder="Height (ft)"
          value={height}
          onChange={e => setHeight(e.target.value)}
        />
        <input
          className="input-field"
          type="number"
          placeholder="Age"
          value={age}
          onChange={e => setAge(e.target.value)}
        />
        <button className="btn-primary" onClick={handleProceed}>PROCEED</button>
      </div>
    </div>
  );
}
