# Vers Toi — Romantic Countdown to Tahiti

A 10-day interactive digital love experience built for a long-distance couple (Paris → Tahiti), counting down from August 2 (birthday) to August 12, 2026 (flight day).

## What It Is

A multi-page web app that unlocks one new page per day between August 2 and August 12. Each day reveals a different emotional, interactive experience — from birthday messages to a love letter, emoji memories, open-when cards, a places map, and a mission-control flight tracker.

## Tech Stack

- **Framework**: TanStack Start (React + Vite)
- **Routing**: TanStack Router (file-based)
- **Styling**: Tailwind CSS v4 + custom CSS animations
- **Server functions**: `@tanstack/react-start` server functions for timezone-aware date checking
- **Fonts**: Google Fonts (Cormorant Garamond, Lato, Dancing Script)
- **Deployment**: Netlify

## Pages

| URL | Description |
|-----|-------------|
| `/` | Homepage with live countdown to August 12 |
| `/journey` | Gallery of all 11 days, showing locked/unlocked status |
| `/day/1` | August 2 — Birthday messages from friends & family |
| `/day/2` | August 3 — Long romantic love letter |
| `/day/3` | August 4 — Emoji memory card game |
| `/day/4` | August 5 — "Open When…" letter cards |
| `/day/5` | August 6 — Birthday Surprise #1: "Why I Love You" |
| `/day/6` | August 7 — Interactive "Places That Made Us" map |
| `/day/7` | August 8 — "Our Future Together" dream list |
| `/day/8` | August 9 — "Because of You" reflections |
| `/day/9` | August 10 — Birthday Surprise #2: Tahiti Bucket List |
| `/day/10` | August 11 — T-Minus One (countdown to departure) |
| `/day/11` | August 12 — Mission Control flight tracker |

## Running Locally

```bash
npm install
npm run dev
```

The app runs at `http://localhost:3000`.

> **Note**: The daily unlock system uses server-side date checking (Paris timezone). In development, days will appear locked/unlocked based on the actual current date.

## Customisation

- **Flight number**: Edit `/day/11` in `src/routes/day.$dayNum.tsx` — search for `EDIT ME`
- **Personal messages**: All day content is in `src/routes/day.$dayNum.tsx`
- **Target dates**: If the year changes, update `getUnlockDate()` and `FLIGHT_DATE` constants
