# RepTrack — React App

A fitness tracking app built from the Figma UI designs. Dark theme with green accents.

## Pages Included

| Route Key | Page |
|-----------|------|
| `splash` | Splash Screen |
| `signup` | Sign Up / Login |
| `onboarding-body` | Body Stats (Weight/Height/Age) |
| `onboarding-frequency` | Workout Frequency Survey |
| `home` | Home Dashboard |
| `pulse` | Pulse Measuring |
| `activity` | Activity / Steps Tracker |
| `workout` | Workout Plan |
| `plans` | Subscription Plans |
| `progress` | Progress Tracker |

## Setup

```bash
cd reptrack
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000)

## Stack

- React 18
- Recharts (charts/graphs)
- CSS Variables (design tokens)
- Google Fonts: Bebas Neue + DM Sans

## Design Tokens (src/index.css)

```css
--green: #3ddc5c        /* Primary accent */
--bg-primary: #0d0d0d   /* App background */
--bg-card: #1e1e1e      /* Card background */
--font-display: 'Bebas Neue'
--font-body: 'DM Sans'
```

## Navigation

All navigation is handled via `onNavigate(pageName)` prop passed to each page. The `App.jsx` uses a simple string-based router with a phone shell wrapper (390×844px).
