import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState({
    name: 'Mayank Joshi',
    weight: 60,
    height: 5.6,
    age: 25,
    plan: 'Basic',
    streak: 12,
    avatar: null,
  });

  const [activity, setActivity] = useState({
    steps: 7654,
    distance: 8.42,
    calories: 1540,
    time: '3:24',
    heartBpm: 76,
    heartHealth: 55,
  });

  const [currentPage, setCurrentPage] = useState('splash');

  return (
    <AppContext.Provider value={{ user, setUser, activity, setActivity, currentPage, setCurrentPage }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
