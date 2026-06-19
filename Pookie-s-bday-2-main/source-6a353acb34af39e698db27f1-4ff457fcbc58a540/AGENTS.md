# AGENTS.md — Vers Toi Project Architecture

## Overview

This is a TanStack Start (React + Vite) application deployed on Netlify. It's a personal romantic countdown website with a daily unlock system secured by server-side date checking.

## Key Directories

```
src/
├── routes/
│   ├── __root.tsx          # Root shell (HTML, head, body)
│   ├── index.tsx           # Homepage with countdown timer
│   ├── journey.tsx         # Day gallery (shows all 11 days, locked/unlocked)
│   └── day.$dayNum.tsx     # All 11 day content pages (one large file)
├── server/
│   └── date.functions.ts   # Server function: returns current date in Paris TZ
├── components/
│   └── Countdown.tsx       # Reusable live countdown timer component
└── styles.css              # Global CSS: variables, animations, utilities
```

## Routing Pattern

File-based routing via TanStack Router. Routes auto-generate `routeTree.gen.ts` at build time. Do not manually edit that file.

- `/` → `src/routes/index.tsx`
- `/journey` → `src/routes/journey.tsx`
- `/day/:dayNum` → `src/routes/day.$dayNum.tsx`

## Daily Unlock System (Critical)

**How it works:**
1. The route loader in `day.$dayNum.tsx` calls `getServerDate()` (a server function)
2. Server returns the current date in `Europe/Paris` timezone (ISO date string `YYYY-MM-DD`)
3. Day N unlocks when `parisDate >= unlockDate`, where `unlockDate = 2026-08-{N+1}`
4. If locked, the component renders a locked message — NOT a redirect (to prevent circumvention via URL manipulation)

**Why server-side**: Client-side date checks can be bypassed by changing the system clock. The server function runs on Netlify's servers, which cannot be tampered with by the user.

**Day mapping:**
- Day 1 → August 2, 2026
- Day N → August (N+1), 2026
- Day 11 → August 12, 2026

## Design System

All design tokens are CSS custom properties in `src/styles.css`:

```css
--ocean-deep: #071828   /* Background */
--ocean-mid:  #0f3050   /* Secondary bg */
--coral:      #d96e55   /* Accent */
--gold:       #c8a050   /* Primary accent */
--gold-light: #e4c880   /* Gold highlights */
--sand:       #f2e2c0   /* Body text on dark */
--text-light: #f0e5d0   /* Headings on dark */
--text-muted: #b8c8d8   /* Subdued text */
```

Custom font classes: `.font-romantic` (Cormorant Garamond), `.font-script` (Dancing Script)

Animation classes: `.animate-fade-up`, `.animate-fade-in`, `.animate-float`, `.animate-heartbeat`, `.delay-{100-1000}`

## Day Content Architecture

All 11 day pages live in a single file `src/routes/day.$dayNum.tsx`. Each day is a React function component (Day1 through Day11). The `DayPage` component routes to the right one via a `Record<number, ComponentType>` lookup.

This was a deliberate choice to keep all content in one place for easy personalisation, rather than 11 separate files.

## Key Conventions

- **TypeScript strict mode**: `noUnusedLocals`, `noUnusedParameters` are enabled. Always import exactly what you use.
- **Type imports**: Use `import type { ... } from 'react'` for type-only imports (React types like `ReactNode`, `ComponentType`) to satisfy `noUnusedLocals`.
- **Deterministic rendering**: Avoid `Math.random()` in JSX that renders on both server and client (causes hydration mismatch). See `STAR_DATA` constant in Day6 for the pattern.
- **SVG coordinates**: SVG `path d` attributes do not accept `%` values — use a `viewBox` for proportional layouts.
- **Path alias**: `@/` maps to `src/` (configured in `tsconfig.json`).

## What NOT to Change

- `routeTree.gen.ts` — auto-generated, never edit manually
- `vite.config.ts` — Netlify plugin config is required for deployment
- `netlify.toml` — build settings for Netlify

## Personalisation Checklist

When extending this project:
1. **Flight number**: Find `EDIT ME` in Day11 component
2. **Love letter**: Edit the `para` strings array in `Day2`
3. **Friend messages**: Edit `birthdayMessages` array in Day1
4. **Emoji memories**: Edit `memories` array in Day3
5. **Places**: Edit `places` array in Day6 (adjust `left`/`top` % for pin positions)
6. **Bucket list**: Edit `bucketList` array in Day9
