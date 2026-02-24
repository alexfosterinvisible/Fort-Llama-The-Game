# Fort Llama — Architecture

*Last major update: February 2026*

> **What this document is:** Technical reference for the codebase structure, module responsibilities, build setup, deployment architecture, and dev tools. For game design philosophy see [Sim Principles](Fort_Llama_Sim_Principles.md); for formulas see [Causal Chain](Fort_Llama_Causal_Chain.md).

---

## High-Level Architecture

Fort Llama runs as two processes during development:

**Express server** (port 3001) — All game logic. Runs the simulation tick loop, processes week-end events, handles player actions via REST API. State is held in memory (single-player, no database).

**Vite dev server** (port 3000) — Serves the React client with hot module replacement. Proxies `/api/*` requests to the Express server.

In production, Vite builds static assets and the Express server serves them directly.

```
Browser ──→ Vite (dev) ──proxy──→ Express server
              │                       │
         React client            Game engine
         (presentation)        (simulation + API)
```

The client polls the server for game state (currently ~500ms interval) and sends actions via POST requests. This is a known architectural simplification from the Replit prototype era — a future refactor may move game logic client-side for better responsiveness.

---

## Server Modules

All server code lives in `server/`. The modules form a pipeline that mirrors the game's four-layer causal chain:

### config.js — All Tunable Parameters

Single file containing every balance parameter in the game. Exports named config objects:

| Export | Purpose |
|--------|---------|
| `DEFAULT_PRIMITIVE_CONFIG` | Accumulator rates, coverage ratios, capacity, noise, overcrowding |
| `DEFAULT_HEALTH_CONFIG` | Health metric weights, sigmoid params, churn/recruit thresholds, fatigue dampening |
| `DEFAULT_VIBES_CONFIG` | Vibes tier names and thresholds, branch labels, balance settings |
| `DEFAULT_BUDGET_CONFIG` | Budget curve (floor, ceiling, basePerCapita), category labels, supply/outflow coefficients |
| `DEFAULT_POLICY_CONFIG` | Policy definitions, effect scaling, fun penalty params |
| `DEFAULT_TECH_CONFIG` | Full tech tree: costs, unlock conditions, effects, types |
| `DEFAULT_TIER_CONFIG` | Population brackets, output/health multipliers, quality caps |
| `DEFAULT_SCORE_CONFIG` | Weekly score formula params, population brackets, harmony |
| `MILESTONE_DEFINITIONS` | Array of 53 milestone objects with conditions |
| `INITIAL_DEFAULTS` | Starting economy, action limits, default rent, starting budgets |
| `DEFAULT_BUILDINGS` | Building definitions: capacity, cost, ground rent/utility impact |
| `DEFAULT_NOTICEBOARD_CONFIG` | Max events, health/treasury warning thresholds, population milestone triggers |
| `DEFAULT_PRIMITIVE_LABELS` | Per-primitive tier label names and thresholds |
| `DAY_NAMES` | Day-of-week labels |
| `STARTING_LLAMAS` | Initial resident pool definitions |
| `POLICY_DEFINITIONS` | Policy metadata (names, descriptions, unlock conditions) |
| `TECH_TREE` | Full tech tree structure and definitions |

Design decision: everything in one file rather than split across JSON files. Makes it easy for the dev tools config editor to load and modify at runtime, and keeps `config.js` as the single source of truth.

### primitives.js — Layer 2 Calculations

Computes all 8 primitive values each tick:

- **Coverage primitives** (nutrition, fun, drive): Supply/demand ratio → `log2CoverageScore` → 0–100
- **Accumulators** (cleanliness, maintenance, fatigue): Inflow vs outflow with asymmetric recovery
- **Instantaneous** (crowding, noise): Direct reads from current state

Key functions: coverage supply calculations, accumulator tick processing, overcrowding penalty, budget boost application.

### healthMetrics.js — Layer 3 Calculations

Converts primitive scores into the three health pillars:

- Weighted combination of relevant primitives per pillar
- Dynamic fatigue weight shifting between Productivity and Partytime
- Sigmoid normalisation to 0–100

### outcomes.js — Layer 4 Calculations

Computes player-facing outcomes from health metrics:

- **Vibes**: Geometric mean of three pillars
- **Churn**: Based on rent, rent tolerance (LS-modulated), and low productivity
- **Recruitment**: Extra invite slots from high Partytime
- **Rent tiers**: Display labels based on LS-adjusted perception
- **Vibes tiers**: Named brackets and branch labels

### scoring.js — Score Engine

Weekly score calculation and milestone checking. Fires during week-end processing after all simulation is complete.

- `calculateWeeklyScore()` — Vibes × population scale × harmony × 10
- `checkMilestones()` — Tests 53 conditions against current state
- `updateScoringTrackers()` — Maintains peak values and streak counters

### gameState.js — Game Loop Orchestration

The central coordinator:

- **Initialisation**: Creates starting state (4 residents, zero treasury, default budgets)
- **Tick processing**: Advances game clock, calls primitive calculations each tick
- **Week-end processing**: Resolves churn, completes research, fires scoring, generates noticeboard events
- **Noticeboard event generation**: Creates events for departures, research, health warnings, treasury alerts, population milestones

### residents.js — Llama Management

Generates random llama residents with 8 skill attributes (Sharing, Cooking, Tidiness, Handiness, Consideration, Sociability, Party, Work). Provides stat-averaging utilities used by primitive calculations.

### routes.js — Express API

REST endpoints for all player actions:

| Endpoint | Action |
|----------|--------|
| `GET /api/state` | Full game state (client polls this) |
| `POST /api/start` | Start simulation running |
| `POST /api/pause` | Pause simulation |
| `POST /api/dismiss-weekly` | Dismiss week-end pause, advance to next week |
| `POST /api/action/invite` | Invite a resident |
| `POST /api/action/build` | Construct a building |
| `POST /api/action/research` | Start researching a tech |
| `POST /api/action/cancel-research` | Cancel current research |
| `POST /api/action/toggle-policy` | Activate/deactivate a policy |
| `POST /api/action/toggle-fixed-cost` | Toggle a fixed cost (Cleaner, Starlink, etc.) |
| `POST /api/action/set-rent` | Update weekly rent |
| `POST /api/action/set-budget` | Update a budget category |
| `POST /api/reset` | Reset all state |

Dev tools config endpoints (GET + POST for each): `/api/config`, `/api/primitive-config`, `/api/health-config`, `/api/vibes-config`, `/api/tier-config`, `/api/budget-config`, `/api/policy-config`, `/api/tech-config`, `/api/score-config`, `/api/buildings-config`. Also: `/api/recruitment-candidates`, `/api/llama-pool`, `/api/llamas`, `/api/save-defaults`, `/api/save-balance-config`.

### state.js — Shared State Singleton

Single mutable object holding all game state. Imported by every server module. Includes game config (deep-copied from defaults at init), game state (residents, treasury, buildings, events, scores), and runtime flags.

### utils.js — Helper Functions

Pure mathematical utilities: `log2CoverageScore`, `dampener`, `baseline`, `statTo01`. No game state dependencies.

---

## Client Architecture

### Entry Points

Vite is configured with dual entry points via `vite.config.js`:

- `client/index.html` → `main.jsx` → Production game (landing page → dashboard)
- `client/dev.html` → `main-dev.jsx` → Dev tools interface

Both mount React apps. The dev entry point includes the full game plus additional dev tools panels.

### Component Tree

```
App.jsx (root — state polling, layout switching, dev tools panel)
├── FortLlamaLanding.jsx (start screen — shown before game starts)
├── GameOverScreen.jsx (shown at −£5,000 treasury)
├── TopBar.jsx (logo, tabs, vibes/score status strip)
├── ActionPanel.jsx (left sidebar)
│   ├── ActionButton.jsx ×4 (recruit, build, policies, research)
│   └── (rent slider, budget steppers, game controls — inline)
├── MainDashboard.jsx (centre-right content area)
│   ├── TreasuryRow.jsx (financial line items with hover breakdowns)
│   ├── Sparkline.jsx (stepped health metric history charts)
│   ├── Panel.jsx (standard content wrapper, used throughout)
│   ├── ResidentChip.jsx (name tags with skill hover popups)
│   ├── PolicyChip.jsx (policy pills with tooltips)
│   ├── SegBar.jsx (25-segment coverage bars)
│   ├── MiniGauge.jsx (semi-circular arc gauges)
│   └── MiniAccum.jsx (vertical fill bars)
├── RecruitModal.jsx ─┐
├── BuildModal.jsx    │ All share ModalShell.jsx
├── PoliciesModal.jsx │ (three-stage commit flow)
└── ResearchModal.jsx ┘
```

### Design Tokens

`theme.js` exports the `T` object containing all colour values, used throughout components via inline styles. See [Player Experience Spec](Fort_Llama_Player_Experience_Spec.md) for the full design system.

### Styling

Mix of inline styles (using theme tokens) and `dashboard.css` (cloud animations, scrollbar styles, responsive breakpoints). No CSS framework — all custom.

---

## Build & Development

### npm Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `npm run dev` | `concurrently "npm run server" "npm run client"` | Full dev environment |
| `npm run server` | `nodemon server/index.js` | Express with auto-restart |
| `npm run client` | `vite` | Vite dev server with HMR |
| `npm run build` | `vite build` | Production static build |
| `npm run start` | `NODE_ENV=production node server/index.js` | Production server |
| `npm run simulate` | `node tools/simulate.js` | Headless balance testing |

### Dependencies

- **Runtime**: express, cors, react, react-dom
- **Build**: vite, @vitejs/plugin-react
- **Dev**: concurrently, nodemon (via npx)

No database, no ORM, no CSS framework, no state management library. Intentionally minimal.

---

## Deployment Architecture (Planned)

**Cloudflare Pages** — Static React app deployed from GitHub. Automatic build on push to main.

**Cloudflare Workers** — Future leaderboard API. Serverless functions for score submission and retrieval.

**Cloudflare D1** — Future database for leaderboard persistence.

The domain `fortllamathegame.com` is registered on Cloudflare. The current game logic runs server-side, but the long-term plan is to move the simulation engine client-side (making it a pure static site) with only the leaderboard requiring server infrastructure.

---

## Dev Tools

### Config Editor

Built into the client UI (accessible via "Dev Tools" tab in the top bar). Allows live editing of game parameters during play:

- All config sections are editable: primitives, health, vibes, budgets, policies, tech
- Changes apply immediately to the running simulation
- No server restart required
- **Gotcha**: Changes are saved to `saved-defaults.json`, which overrides `config.js` on next load. Delete this file when your config changes aren't being reflected.

### Headless Simulator

`tools/simulate.js` — Runs the game engine without a browser for rapid balance testing. Supports multiple strategies, config overrides, pre-researched techs, and CSV output. See `CLAUDE.md` for full usage reference.

### Scoring Diagnostic

The dev tools panel includes a detailed scoring section:

- **Weekly formula**: Live vibes, pop scale, harmony, projected points
- **Score totals**: Weekly total, milestone total, overall score, peak values
- **Earned milestones**: Badge name, category, points, week earned
- **Unearned milestones**: Remaining milestones with hint text

### Tech Tree Editor

Visual tech tree editor in dev tools. Allows editing tech definitions, costs, and effects. Future: culture badge name input field for the naming pass.

### Balance Tuning Workflow

1. Run baseline simulation (`--strategy=passive`) — observe unmanaged drift
2. Run with budget (`--strategy=balanced`) — test whether investment stabilises
3. Compare against design targets in Sim Principles
4. Test parameter changes via `--overrides` without editing files
5. Apply changes to `server/config.js`
6. Verify by re-running simulations with actual config
7. Play-test in browser with dev tools open for live diagnostics

### Ruleset Naming Convention

For config presets: `[contributor initials]-[app version]-[config version]`

Example: `TP-v1.0-c3` = Tim Parsons, app version 1.0, third config revision. Allows multiple contributors to share and compare balance configurations.

---

## Build Status Log

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Strip Replit-specific code, standalone localhost | ✅ Complete |
| 2 | Modularise server into 8 modules | ✅ Complete |
| 3 | Implement structural formula changes | ✅ Complete |
| 4 | Economy rebalance (debt-start model) | ✅ Complete |
| 5 | Scoring & milestone system | ✅ Complete |
| 6 | Sky Blue theme reskin | ✅ Complete |
| 7 | Component extraction (App.jsx → 20+ components) | ✅ Complete |
| 8 | Landing page | ✅ Complete |
| 9 | Noticeboard (event generation + UI) | ✅ Complete |
| 10 | Game over screen | ✅ Complete |
| — | Unit test suite | Planned |
| — | Client-side engine migration | Future |
| — | Cloudflare deployment | Planned |
