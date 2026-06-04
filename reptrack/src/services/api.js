// src/services/api.js
// Centralised API layer — import this instead of writing fetch() everywhere

const BASE_URL =
  process.env.REACT_APP_API_URL ||
  'https://reptrack-production-d7ae.up.railway.app/api';

// ── Token helpers ────────────────────────────────────────────────────────────
const getToken = () => localStorage.getItem('reptrack_token');
const setToken = (t) => localStorage.setItem('reptrack_token', t);
const clearToken = () => localStorage.removeItem('reptrack_token');

// ── Base fetch wrapper ───────────────────────────────────────────────────────
async function request(path, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'API request failed');
  }
  return data;
}

// ── Auth ─────────────────────────────────────────────────────────────────────

/** Register a new user */
export async function signup(name, email, password) {
  const data = await request('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
  setToken(data.token);
  return data.user;
}

/** Login and store token */
export async function login(email, password) {
  const data = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  setToken(data.token);
  return data.user;
}

/** Fetch current user (uses stored token) */
export async function getMe() {
  const data = await request('/auth/me');
  return data.user;
}

/** Update user profile */
export async function updateProfile(updates) {
  const data = await request('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
  return data.user;
}

/** Logout — just clear the local token */
export function logout() {
  clearToken();
}

// ── Activity ─────────────────────────────────────────────────────────────────

/** Get today's activity */
export async function getTodayActivity() {
  const data = await request('/activity/today');
  return data.activity;
}

/** Get last N days history (default 7) */
export async function getHistory(days = 7) {
  const data = await request(`/activity/history?days=${days}`);
  return data.history;
}

/** Sync step/heart data (from band or manual) */
export async function syncSteps({ steps, distance, calories, heartBpm, heartHealth, bandData }) {
  const data = await request('/activity/steps', {
    method: 'POST',
    body: JSON.stringify({ steps, distance, calories, heartBpm, heartHealth, bandData }),
  });
  return data.activity;
}

/** Log a completed workout session */
export async function logWorkout({ exercise, sets, reps, duration, postureScore }) {
  const data = await request('/activity/workout', {
    method: 'POST',
    body: JSON.stringify({ exercise, sets, reps, duration, postureScore }),
  });
  return data.activity;
}

/** Get weekly aggregate stats for charts */
export async function getWeeklyStats() {
  const data = await request('/activity/stats/weekly');
  return data.data;
}
