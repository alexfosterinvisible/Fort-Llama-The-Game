# Fort Llama – Claude Code Context

## What This Is

Fort Llama is a single-player browser-based management simulation. Players run a communal living facility for anthropomorphic llamas, balancing economics, social systems, and resident wellbeing. The game models a four-layer pipeline:

**Player actions** (rent, budgets, buildings, policies) → **Primitives** (coverage, pressure, accumulators) → **Health metrics** (Living Standards, Productivity, Partytime) → **Outcomes** (vibes, churn, recruitment, economy)

The design philosophy is "perilous but navigable" — a mildly negative baseline drifts toward failure, requiring active player investment to push back against entropy.

## Project Structure

```
CLAUDE.md                               ← You are here
docs/
  Fort_Llama_MVP_Overview.md            ← State of project + roadmap
  Fort_Llama_Sim_Principles.md          ← Game philosophy, feel by phase, difficulty
  Fort_Llama_Causal_Chain.md            ← Complete formula reference + scoring
  Fort_Llama_Architecture.md            ← Codebase structure + dev tools
  Fort_Llama_Player_Experience_Spec.md  ← All player-facing mechanics + UI + visual design

server/
  config.js        ← All tunable parameters (primitives, health, vibes, budgets, policies, tech, scoring, milestones)
  primitives.js    ← Coverage ratios + accumulator calculations
  healthMetrics.js ← Living Standards, Productivity, Partytime from primitives
  outcomes.js      ← Vibes, churn, recruitment, economy from health metrics
  scoring.js       ← Weekly score calculation + milestone checking
  gameState.js     ← Game loop: init, tick processing, week-end processing, noticeboard events
  residents.js     ← Llama pool and resident management
  routes.js        ← Express API routes
  state.js         ← Shared mutable game state singleton
  utils.js         ← Helper functions (log2CoverageScore, dampener, baseline, statTo01)

client/
  index.html       ← Production entry point (game)
  dev.html         ← Dev tools entry point
  src/
    main.jsx       ← Production React mount
    main-dev.jsx   ← Dev tools React mount
    App.jsx        ← Root game component (state polling, layout, dev tools panel)
    index.css      ← Global styles
    components/
      theme.js          ← Design tokens (Sky Blue theme)
      dashboard.css     ← Cloud animations, scrollbar styles, responsive layout
      ActionPanel.jsx   ← Left sidebar: clock, action buttons, rent, budgets, game controls
      MainDashboard.jsx ← Centre-right: treasury, culture, buildings, residents, noticeboard, systems
      TopBar.jsx        ← Header: logo, tabs, vibes/score status strip
      ActionButton.jsx  ← 2×2 grid buttons with glow + spent overlay
      BuildModal.jsx    ← Building construction modal (three-stage commit)
      RecruitModal.jsx  ← Resident recruitment modal
      ResearchModal.jsx ← Tech tree research modal
      PoliciesModal.jsx ← Policy toggle modal
      ModalShell.jsx    ← Shared modal wrapper (overlay, header, commit bar, confirmation)
      Panel.jsx         ← Standard content panel wrapper
      MiniGauge.jsx     ← Semi-circular 10-segment arc gauge (crowding, noise)
      MiniAccum.jsx     ← Vertical bottom-up fill bar (cleanliness, upkeep, fatigue)
      Sparkline.jsx     ← Stepped line chart (health metric history)
      SegBar.jsx        ← 25-segment traffic-light coverage bar (nutrition, fun, drive)
      StatBar.jsx       ← Horizontal 1–20 stat bar (candidate skills)
      ResidentChip.jsx  ← Name tag + hover stat popup
      PolicyChip.jsx    ← Policy pill + tooltip
      TreasuryRow.jsx   ← Financial line item + hover breakdown
      PixelIcon.jsx     ← 16×16 pixel art icons
      FortLlamaLanding.jsx ← Landing/start page
      GameOverScreen.jsx   ← Game over display + restart

tools/
  simulate.js      ← Headless simulator for balance testing

vite.config.js     ← Dual entry points (main + dev), proxy to server on :3001
package.json       ← npm scripts: dev, server, client, build, start, simulate
```

## Key Documentation

Before making changes, read the relevant docs:

- **Sim Principles** (`docs/Fort_Llama_Sim_Principles.md`): Game philosophy and design intent. What each phase should feel like. Difficulty scaling. No specific numbers — this is the strategic anchor.
- **Causal Chain** (`docs/Fort_Llama_Causal_Chain.md`): Every formula in the engine with exact variable names matching `config.js`. Scoring system. Starting scenario analysis. The ground truth for how systems connect.
- **Architecture** (`docs/Fort_Llama_Architecture.md`): Codebase structure, module responsibilities, deployment architecture, dev tools reference.
- **Player Experience Spec** (`docs/Fort_Llama_Player_Experience_Spec.md`): All player-facing mechanics, UI behaviour, visual design system, component catalogue.
- **MVP Overview** (`docs/Fort_Llama_MVP_Overview.md`): What's built, what's next, full roadmap.

## Economy Model

The game uses a **debt-driven startup model**. The player starts with 4 residents, zero treasury, and immediately goes into debt. Growth is the only path to solvency.

- **Fixed costs**: Ground rent £700 + utilities £250 = £950/week
- **Starting rent**: £150/resident/week
- **Starting income**: 4 × £150 = £600/week
- **Starting net**: −£350/week (before budgets of ~£215)
- **Game over**: −£5,000 (the "overdraft limit")
- **Break-even**: ~7 residents at £150 rent (before budgets); ~11 residents with full starting budgets (~£215/week)

**The Difficulty Squeeze**: Recruiting fixes the economy but worsens accumulators. At N=4, cleanliness and maintenance stay near zero (small group, manageable mess). At N=8+, accumulators build relentlessly. Tech progression (chores_rota, cleaner, wellness) is the escape valve.

## Headless Simulator

`tools/simulate.js` runs the game engine without a browser for rapid balance testing.

### Usage

```bash
# Basic: passive play (no budget) for 8 weeks, daily snapshots
node tools/simulate.js --weeks=8 --strategy=passive --log=day

# With budget strategy and CSV output
node tools/simulate.js --weeks=12 --strategy=balanced --budget=215 --csv

# With pre-researched techs
node tools/simulate.js --weeks=12 --strategy=balanced --techs=chores_rota,wellness,cleaner --log=week

# With config overrides (test parameter changes without editing files)
node tools/simulate.js --weeks=6 --strategy=passive --overrides='{"primitives":{"fatigue":{"exertBase":0.5}}}'
```

### Options

| Flag | Values | Default | Description |
|------|--------|---------|-------------|
| `--weeks=N` | 1–50 | 8 | Weeks to simulate |
| `--strategy=X` | passive, balanced, ls-focus, pt-focus, pr-focus | passive | Budget allocation pattern |
| `--budget=N` | any | 215 | Total weekly budget (ignored for passive) |
| `--rent=N` | any | 150 | Weekly rent per resident |
| `--log=X` | tick, day, week | day | Snapshot frequency |
| `--csv` | flag | table | Output as CSV |
| `--overrides=JSON` | JSON string | none | Config overrides (same structure as config.js) |
| `--techs=X` | comma-separated | none | Pre-research techs |

### Strategies

- **passive**: Zero budgets. Tests pure baseline drift.
- **balanced**: Proportional spread across all 6 budget categories.
- **ls-focus**: Heavy Living Standards investment.
- **pt-focus**: Heavy Partytime investment.
- **pr-focus**: Heavy Productivity investment.

### Tuning Workflow

1. Run baseline simulation (`--strategy=passive`) to see unmanaged drift
2. Run with budget (`--strategy=balanced`) to see if player investment can stabilise
3. Compare against design targets in Sim Principles doc
4. Test parameter changes via `--overrides` without editing files
5. When satisfied, apply changes to `server/config.js`
6. Verify by re-running simulations with the actual config (no overrides)

### Cascade Awareness

Changes propagate through the four-layer pipeline. Tune one layer at a time:

- **Layer 1 (Primitives)**: Accumulator rates, coverage ratios → affects everything downstream
- **Layer 2 (Health Metrics)**: Scaling parameters, weights → affects outcomes only
- **Layer 3 (Outcomes)**: Churn thresholds, recruitment, vibes → final player-facing numbers

## Config Structure

All tunable values live in `server/config.js`. Key sections:

| Config object | Purpose |
|---------------|---------|
| `DEFAULT_PRIMITIVE_CONFIG` | Accumulator rates, coverage ratios, capacity, noise |
| `DEFAULT_HEALTH_CONFIG` | Health metric scaling, fatigue weights, churn/recruit params |
| `DEFAULT_VIBES_CONFIG` | Vibes thresholds, tier names, balance settings |
| `DEFAULT_BUDGET_CONFIG` | Budget curve and category labels |
| `DEFAULT_POLICY_CONFIG` | Policy definitions and effects |
| `DEFAULT_TECH_CONFIG` | Tech tree definitions |
| `DEFAULT_SCORE_CONFIG` | Weekly score formula parameters, population brackets, harmony |
| `MILESTONE_DEFINITIONS` | 53 milestone objects (badge, points, trigger condition) |
| `DEFAULT_TIER_CONFIG` | Population brackets, output/health multipliers |
| `INITIAL_DEFAULTS` | Economy starting values, action limits, starting budgets |
| `DEFAULT_BUILDINGS` | Building capacities, costs, multipliers |

## Running the Game

```bash
npm install
npm run dev          # Starts Express server on :3001 and Vite client on :3000
```

Open `http://localhost:3000` for the game. Dev tools panel is built into the client UI (toggle via top bar tab).

## Known Gotchas

- **saved-defaults.json**: Persistence mechanism that overrides config.js with stale values. Delete this file when config changes aren't reflected in-game.
- **Culture badge names**: All 20 tech milestones in `MILESTONE_DEFINITIONS` have placeholder "TBC" badge names — these need a naming pass.
