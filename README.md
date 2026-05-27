# BytePath – B.Tech CSE Curriculum Navigator & Career Launchpad

A comprehensive, production-ready single-page React application for B.Tech CSE students to track academic performance, predict CGPA, manage student workflows, and get personalized web development career guidance.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed ([nodejs.org](https://nodejs.org))
- npm 9+

### Installation & Run

**Option A — Double-click launcher:**
```
START.bat
```

**Option B — Manual:**
```bash
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## ✨ Features

| Feature | Description |
|---|---|
| **Academic Database** | Enter SGPA per semester, attendance %; persisted in `localStorage` |
| **CGPA Predictor** | Credit-proportional formula using exact 196-credit curriculum |
| **Interactive Dashboard** | Recharts SGPA/CGPA timeline with target baseline |
| **Credit Progress Tracker** | Visual progress bar across all 196 program credits |
| **Career Insight Engine** | Phase-based web dev guidance linked to actual courses |
| **Semester Manager** | Toggle complete/in-progress/upcoming, view full course listings |
| **Fully Responsive** | Works on mobile, tablet, and desktop |
| **Dark Mode** | Glassmorphism design with custom dark theme |

---

## 📐 CGPA Formula

```
Required Future SGPA = 
  (Target_CGPA × 196 − Σ(Past_SGPA × Past_Credits)) / Remaining_Credits
```

If the result exceeds 10.0 → displays **"Mathematically Unreachable"** warning.

---

## 🏗️ Tech Stack

- **React 18** + Vite
- **Tailwind CSS v3** (dark mode, custom animations)
- **Recharts** (interactive CGPA timeline chart)
- **Lucide React** (icons)
- **localStorage** (zero-backend persistence)

---

## 📁 Project Structure

```
src/
├── App.jsx                    # Root component, tab routing, particles
├── index.css                  # Global styles, Tailwind, animations
├── main.jsx                   # React DOM entry
├── data/
│   └── syllabus.js            # Full 8-sem curriculum + career insights
├── hooks/
│   └── useAcademicStore.js    # Central state, localStorage, CGPA math
└── components/
    ├── Header.jsx             # Sticky header, CGPA badge, name input
    ├── TabNav.jsx             # Dashboard/Semesters/Predictor/Career tabs
    ├── Dashboard.jsx          # Stats, Recharts chart, credit progress
    ├── SemestersPanel.jsx     # Expandable semester cards + course list
    ├── PredictorPanel.jsx     # Target CGPA predictor + breakdown table
    └── CareerPanel.jsx        # Career guidance, roadmap, resources
```

