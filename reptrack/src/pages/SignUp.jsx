import React, { useState } from 'react';
import StatusBar from '../components/StatusBar';
import './SignUp.css';

export default function SignUp({ onNavigate }) {
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');

const handleSignup = async () => {
  try {
    const response = await fetch(
      'http://localhost:5001/api/auth/signup',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      alert('Signup successful!');

      localStorage.setItem('token', data.token);

      onNavigate('onboarding-body');
    } else {
      alert(data.message || 'Signup failed');
    }
  } catch (error) {
    console.error(error);
    alert('Could not connect to server');
  }
};
return (
    <div className="signup-page">
      <StatusBar />
      <div className="signup-hero">
        <div className="signup-hero-overlay" />
        <div className="signup-hero-text">
          <h1>DISCIPLINE<br/>IS THE KEY.</h1>
        </div>
      </div>
      <div className="signup-form">
      <input
  className="input-field"
  type="text"
  placeholder="Name"
  value={name}
  onChange={(e) => setName(e.target.value)}
/>
        <input
          className="input-field"
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          className="input-field"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button
  className="btn-primary"
  onClick={handleSignup}
>
  Sign up
</button>
        <p className="login-link" onClick={() => onNavigate('home')}>
          Already have an account? <span>Sign In</span>
        </p>
      </div>
    </div>
  );
}
