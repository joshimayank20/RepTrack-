import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import SplashScreen from './pages/SplashScreen';
import SignUp from './pages/SignUp';
import OnboardingBody from './pages/OnboardingBody';
import OnboardingFrequency from './pages/OnboardingFrequency';
import Home from './pages/Home';
import PulseMeasuring from './pages/PulseMeasuring';
import Activity from './pages/Activity';
import WorkoutPlan from './pages/WorkoutPlan';
import Plans from './pages/Plans';
import ProgressTracker from './pages/ProgressTracker';
import PostureDetection from './pages/PostureDetection';
import Media from './pages/Media';
import FitnessBand from './pages/FitnessBand';
import './index.css';

function Router() {
  const [page, setPage] = useState('splash');

  const pages = {
    splash: <SplashScreen onNavigate={setPage} />,
    signup: <SignUp onNavigate={setPage} />,
    'onboarding-body': <OnboardingBody onNavigate={setPage} />,
    'onboarding-frequency': <OnboardingFrequency onNavigate={setPage} />,
    home: <Home onNavigate={setPage} />,
    pulse: <PulseMeasuring onNavigate={setPage} />,
    activity: <Activity onNavigate={setPage} />,
    workout: <WorkoutPlan onNavigate={setPage} />,
    plans: <Plans onNavigate={setPage} />,
    progress: <ProgressTracker onNavigate={setPage} />,
    posture: <PostureDetection onNavigate={setPage} />,
    media: <Media onNavigate={setPage} />,
    band: <FitnessBand onNavigate={setPage} />,
  };

  return (
    <div className="reptrack-app">
      <div className="phone-shell">
        {pages[page] || pages['splash']}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Router />
    </AppProvider>
  );
}
