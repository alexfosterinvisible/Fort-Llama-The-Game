# Fort Llama — MVP Overview

*Last major update: February 2026*

> **What this document is:** The single source of truth for what's been built, what's in progress, and what's planned. If you want to know the current state of the project or where to contribute, start here.

---

## What Fort Llama Is

Fort Llama is a single-player browser-based management simulation where you run a communal living facility for anthropomorphic llamas. Balance economics, social systems, and resident wellbeing — or watch it all spiral into acrimony, burnout, and bankruptcy.

The game draws from real-world experience running a co-living community, translating that lived experience into a four-layer simulation: player actions flow through primitives (coverage ratios and accumulators) into health metrics (Living Standards, Productivity, Partytime) that determine outcomes (vibes, churn, recruitment, economy).

**Domain**: fortllamathegame.com
**Repo**: https://github.com/tfparsons/Fort-Llama-The-Game

---

## Document Map

```
Root
├── CLAUDE.md                              ← Coding agent quick-start
└── /docs/
    ├── Fort_Llama_MVP_Overview.md         ← You are here
    ├── Fort_Llama_Sim_Principles.md       ← Game philosophy + feel by phase
    ├── Fort_Llama_Causal_Chain.md         ← Every formula + scoring + balance
    ├── Fort_Llama_Architecture.md         ← Codebase structure + dev tools
    └── Fort_Llama_Player_Experience_Spec.md ← All player mechanics + UI + visual design
```

---

## What's Been Built

### Phase 1 — Standalone Extraction ✅

Stripped all Replit-specific code (auth middleware, env vars, hosting config). Game runs standalone on localhost. No game logic changes.

### Phase 2 — Server Modularisation ✅

Split the monolithic 89K `server/index.js` into 8 focused modules: `config.js`, `primitives.js`, `healthMetrics.js`, `outcomes.js`, `gameState.js`, `residents.js`, `routes.js`, `state.js`, `utils.js`. Game runs identically.

### Phase 3 — Structural Formula Changes ✅

Implemented all structural changes from the design spec:

- Asymmetric accumulator recovery (prevention cheaper than cure)
- Budgets boost outflow rates (not subtract from stock)
- Dynamic fatigue dampening (creates PR/PT tension)
- Noise boost removed from Partytime
- Overcrowding starts below full capacity
- Living Standards wired to rent tolerance
- Policy fun penalty (>3 active policies dampen fun)
- Tidiness as secondary maintenance stat
- Consideration penalty on fun (max 12%)

### Economy Rebalance ✅

New debt-start model: 4 residents, £0 treasury, £950 fixed costs, -£5,000 game over. Growth is the only path to solvency. Replaces the old 10-resident, break-even start.

### Scoring & Milestones ✅

Arcade-style scoring system with two streams: weekly points (vibes × population × harmony) and 53 one-off milestone badges across 8 categories. Score displayed in vibes banner. Full diagnostic in dev tools.

### Sky Blue Theme ✅

Complete visual reskin: sky blue page background, golden amber hero accent, warm neutral gray panels, drifting cloud animations. "Golden hour at the festival field" aesthetic.

### Component Extraction ✅

Monolithic App.jsx split into 20+ components: ActionPanel, MainDashboard, TopBar, all four modals (Recruit, Build, Policies, Research), ModalShell, Panel, data visualisation components (Sparkline, SegBar, MiniGauge, MiniAccum, StatBar), interaction components (ResidentChip, PolicyChip, TreasuryRow, ActionButton), and icons (PixelIcon). Theme tokens extracted to `theme.js`.

### Landing Page ✅

Start screen with game branding, "Start New Game" flow. Replaces direct load into dashboard.

### Noticeboard ✅

Chronological event feed with 4 event types (arrival, departure, warning, good news). Generates events for: resident departures, research completion, health metric threshold crossings, treasury warnings, population milestones, recruitment, building construction, research start. 100-event cap with oldest-first pruning. Deduplication via previous-week snapshot comparison.

### Game Over Screen ✅

Triggered at -£5,000 treasury. Shows final score and restart option.

---

## Roadmap

### Tuning & Infrastructure — Next Priority

| Item | Detail | Status |
|------|--------|--------|
| **Balance pass** | Systematic play-testing using headless simulator. Validate starting experience against Sim Principles targets. | Not started |
| **Unit tests** | Vitest test suite for simulation modules. Priority: primitives, health metrics, scoring. | Not started |
| **Ruleset naming** | Convention for config presets: contributor initials + app version + config version. | Not started |
| **saved-defaults.json handling** | Clean up persistence mechanism that can override config.js with stale values. | Known gotcha |

### Early Game Polish

| Item | Detail | Status |
|------|--------|--------|
| **Tutorial / onboarding** | Progressive introduction to mechanics for new players. Spec TBC. | Design target |
| **Difficulty presets** | Easy / Medium / Hard starting conditions. Adjusts pressure not shape. | Design target |
| **Coverage tier labels** | Finalised per-primitive thematic labels (food-themed for nutrition, etc.). | Done in design, needs config update |

### Mid Game — Design Targets

| Item | Detail | Status |
|------|--------|--------|
| **MVP mechanic** | New strategic dimension unlocked when economy stabilises. Spec TBC. | Concept only |
| **Resident personality** | Individual traits, preferences, events, relationships. | Concept only |
| **Level 3 tech tree** | Deep specialist tracks with new costs and tensions. | Partially configured |

### Late Game — Design Targets

| Item | Detail | Status |
|------|--------|--------|
| **Disaster mechanic** | Random or triggered events that test commune resilience. Spec TBC. | Concept only |
| **Scale complexity** | Systems that create emergent challenge at high population. | Concept only |

### Culture Badges — Ongoing

All 20 tech milestones currently show "TBC" for `badgeName` and `flavour` in `server/config.js`. Each tech needs a flavourful culture badge name (e.g., Chores Rota → "Commune Logistics 101"). Badges display in the Culture panel. This can be done incrementally — the dev tools tech tree editor will get a badge name input field to support this.

### Open Source & Community

| Item | Detail | Status |
|------|--------|--------|
| **README.md** | Public-facing intro, screenshot, how-to-run, contributor guide. | When ready |
| **Contribution workflows** | Balance contributors vs feature developers. | When ready |
| **GitHub Actions** | CI for tests, linting, deployment. | When ready |
| **Cloudflare deployment** | Pages for static React, Workers for future leaderboard API, D1 for database. | Domain registered, architecture planned |

---

## Technical Stack

- **Runtime**: Node.js + Express (server), React 19 (client)
- **Build**: Vite with dual entry points (game + dev tools)
- **Dev**: Concurrently (Express on :3001 + Vite on :3000 with API proxy)
- **Testing**: Vitest (planned)
- **Deployment**: Cloudflare Pages (planned)
- **Balance testing**: Headless simulator (`tools/simulate.js`)

---

*See [Architecture](Fort_Llama_Architecture.md) for codebase details, [Sim Principles](Fort_Llama_Sim_Principles.md) for design philosophy, [Causal Chain](Fort_Llama_Causal_Chain.md) for formulas, [Player Experience Spec](Fort_Llama_Player_Experience_Spec.md) for UI and mechanics.*
