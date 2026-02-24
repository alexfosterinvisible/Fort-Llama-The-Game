# Fort Llama — Player Experience Spec

*Last major update: February 2026*

> **What this document is:** Comprehensive reference for everything the player sees and interacts with. Covers dashboard layout, all game mechanics, modal behaviour, visual design system, and component catalogue. Each section is marked with implementation status: ✅ Built, 🔶 Partial, 🎯 Design Target.
>
> **For simulation formulas** see [Causal Chain](Fort_Llama_Causal_Chain.md). **For design philosophy** see [Sim Principles](Fort_Llama_Sim_Principles.md).

---

## 1. Dashboard Overview ✅

The game is played on a single screen — the dashboard. Three zones, arranged left to right:

**Action Panel** (left sidebar, ~38% width) — Where you *do* things. Controls, sliders, buttons.

**Main Dashboard** (centre-right, ~62% width) — Where you *see* things. Information panels in two columns plus a full-width systems strip.

**Top Bar** (full width, top) — Game name, navigation tabs, key status numbers.

The action panel and main dashboard use a golden ratio flex split (1 : 1.618), giving the information area natural visual dominance without cramping the controls.

The game follows a weekly rhythm: the simulation pauses at each week boundary. The player reviews the dashboard, adjusts rent, allocates budgets, takes actions (recruit, build, research, policies), then advances to the next week. The simulation runs through 7 days of ticks, then pauses again.

**Responsive behaviour**: Below 800px, dashboard columns stack vertically. Below 600px, the action panel moves to the top.

---

## 2. Top Bar ✅

Full-width header strip.

**Left side**: "Fort Llama" logo text (golden amber, Press Start 2P font) and two tabs — "Dashboard" (main game) and "Dev Tools" (testing panel).

**Right side**: Status strip showing four key numbers:

- **VIBE** — Current vibes tier name (e.g. "Scrappy", "Thriving")
- **REP** — Reputation tier
- **LVL** — Current level
- **SCORE** — Overall score (formatted with commas)

The status strip uses solid golden amber borders and transparent background.

---

## 3. Action Panel ✅

Left sidebar, reading top to bottom:

### Clock
Bordered box showing current game time: week number, day, time of day (e.g. "Wk 4 | Monday | 09:00").

### Action Buttons (2×2 Grid)
Four square buttons, each with a pixel-art icon and label:

- **Recruit** — Opens candidate selection modal. Available once per week.
- **Build** — Opens building construction modal. One build per week.
- **Policies** — Opens policy toggle modal. One change per week.
- **Research** — Opens tech tree modal. One research slot at a time.

**Visual states**: When available, the label has a soft golden amber glow (lit neon sign effect). When spent (used this week), the button goes dim with a green tick overlay (switched-off sign).

### Rent Slider
Sets weekly rent per resident (£50–£500). Shows current value and a descriptive tier label:

- "Bargain" (≤30% of tolerance)
- "Cheap" (≤50%)
- "Fair" (≤70%)
- "Pricey" (≤90%)
- "Extortionate" (>90%)

Tier thresholds are ratio-based, not fixed £ amounts — they're calculated against the resident's maximum tolerant rent, which is modulated by Living Standards via the `rentTierCurvature` parameter. High LS increases tolerance, making the same rent feel cheaper.

### Budgets Accordion
Collapsible section with 6 spending categories: Ingredients, Party Supplies, Internet, Cleaning, Repairs, Wellness. Each has stepper buttons (−−, −, +, ++) to adjust spending. Total weekly cost always visible even when collapsed.

Budget categories map to primitives: Ingredients → nutrition supply, Party Supplies → fun supply, Internet → drive supply, Cleaning → cleanliness outflow, Repairs → maintenance outflow, Wellness → fatigue recovery.

### Game Controls
Two buttons at bottom:

- **Start Week** (green) — Advances simulation by one week.
- **Restart Game** (dark red) — Full reset.

### Collapse Behaviour
On wider screens, the entire action panel can collapse to a thin rail (arrow button toggle).

---

## 4. Treasury & Economy ✅

### Treasury Panel (Main Dashboard, Left Column)

Four rows showing financial position:

- **Balance** — Current cash on hand
- **Income** — Total weekly income (green). Hover breakdown: "Rent: N × £X"
- **Expenses** — Total weekly costs (red). Hover breakdown: "Ground Rent: £X, Utilities: £X, Budgets: £X"
- **Net** — Income minus expenses, shown larger. Green if positive, red if negative.

Hover breakdowns appear as dark popup panels with line items and totals. Building costs always display as "Ground Rent" and "Utilities" (not abbreviated) to avoid confusion with player-set resident rent.

### Economy Model

Debt-start model: £0 treasury, £950 fixed costs, 4 residents at £150 rent = −£350/week before budgets. Game over at −£5,000. Growth is the only path to solvency. See [Causal Chain §3](Fort_Llama_Causal_Chain.md) for full analysis.

---

## 5. Health Metrics & Primitives ✅

### Culture Panel (Main Dashboard, Left Column)

Renamed from "Health Metrics" because the three pillars literally define the commune's culture. Three rows, one per pillar:

- Coloured badge with pillar name (purple for LS, blue for PR, pink for PT)
- Stepped sparkline showing last 16 weeks of history (staircase pattern, not smooth curves)
- Current score as a large number in the pillar's colour

Below the three metrics: **Culture Trophies** section — small badge chips for each completed technology. Each shows a trophy icon and badge name in the relevant pillar colour.

### Systems Strip (Main Dashboard, Full Width Bottom)

Displays all 8 primitives in a compact layout:

**Top half — Coverage Bars** (3 horizontal):
- **Nutrition** (plate icon), **Fun** (musical note), **Drive** (arrow)
- Each is a 25-segment bar using traffic-light gradient (red → amber → green)
- Filled segments light up in position colour; empty segments are faint
- Hover shows tier name and raw value (e.g. "Fed (42)")

**Bottom half — Gauges and Accumulators** (5 indicators):

*Gauges* (semi-circular arcs, 2):
- **Crowding**, **Noise**
- 10 arc segments: green (low/good) → amber → red (high/bad)
- Small square needle at current value

*Accumulators* (vertical fill bars, 3):
- **Cleanliness** (broom), **Upkeep** (wrench), **Fatigue** (moon)
- Fill from bottom up, colour changes by level: green (<40%), amber (40–70%), red (>70%)
- Pixel icon centred over fill

All indicators show tier name and value on hover.

---

## 6. Noticeboard ✅

Scrollable chronological event feed (newest first) in the Main Dashboard, Right Column.

### Event Types

| Type | Icon | Colour | Used For |
|------|------|--------|----------|
| `arrival` | ► | Green (#8cc4a0) | Residents joining |
| `departure` | ◄ | Red (#c47e7e) | Residents leaving (churn) |
| `warning` | ▲ | Amber (#e8b84a) | Threshold crossings, economic stress |
| `good` | ★ | Blue (#7eaac4) | Milestones, research, achievements |

A fifth type (`info` — neutral narration) is reserved for future use.

### Event Triggers

**Week-end events** (generated during `processWeekEnd()`):
- **Churn**: One `departure` event per churned resident. Text: "{name} has left the commune."
- **Research completion**: One `good` event. Text: "Research complete: {techName}."
- **Health metric warnings**: When a metric drops below threshold (35 = low, 20 = critical) *and* was above it last week. One warning per downward crossing.
- **Health metric recovery**: When a metric rises above a previously-crossed threshold. One `good` event per upward crossing.
- **Treasury warnings**: Low (<£200) and critical (<£50) thresholds. Same deduplication logic.
- **Population milestones**: Noticeboard events at 5, 10, 15, 20 residents (first time only). Note: scoring milestones trigger at different thresholds (5, 8, 12, 16) — see [Causal Chain §2](Fort_Llama_Causal_Chain.md).

**Player action events** (generated immediately):
- **Recruitment**: "{name} has joined the commune."
- **Building**: "Built: {buildingName}."
- **Research started**: "Began researching: {techName}."
- **Game start**: "Welcome to the commune. The llamas are restless."

### Storage & Pruning

Events stored on `state.gameState.events` as a plain array. Capped at 100 entries (configurable via `maxNoticeboardEvents`). Oldest pruned first. At typical play rates (5–15 events/week), retains ~7–20 weeks of history.

### Design Principles

The Noticeboard is **purely informational** — events never require player response. It serves three purposes: making cause-and-effect visible (legibility), giving the weekly cycle narrative rhythm (pacing), and providing a readable record for post-mortem analysis.

### Deferred Items

- `info` event type for player action narration (risk of feed flooding)
- Event filtering UI
- Personality-flavoured departure text
- Vibes tier transition events
- Weekly summary events

---

## 7. Residents Panel ✅

Header shows population as a fraction (e.g. "10/16").

**Resident chips**: Flex-wrapped row of name tags. Hovering shows popup with all 8 skill scores, colour-coded (green for positive, red for negative).

**Aggregate skills**: Commune-wide totals for each of the 8 skills as percentage values. Skills are: Sharing, Cooking, Tidiness, Handiness, Consideration, Sociability, Party, Work.

**Policies section** (below residents): Shows active policy count (e.g. "2/3"), row of policy chips. Active = green tint, inactive = red tint. Hover reveals name, status, effect description.

---

## 8. Tech Tree / Culture Panel 🔶

### Research Modal ✅

Shows available technologies grouped into three trees (Quality of Life, Productivity, Fun), each with a coloured header matching the pillar colour. Only the "frontier" is shown — techs that are unresearched but have met prerequisites. Fully researched and deeply locked techs are hidden.

Each tech card shows: type icon, name, type chip (Policy / Fixed Cost / Building / Upgrade / Culture), cost in red, description. Coloured left border indicates tree membership.

If research is active, a banner shows current research with a Cancel option.

### Culture Badges 🔶

Each completed technology earns a culture badge displayed in the Culture panel. Badge names and flavour text are currently "TBC" for all 20 techs — this is an ongoing naming task.

### Future: Level 3 Mechanics 🎯

Deep specialist tracks that unlock new possibilities and costs. Partially configured in the tech tree but not yet balanced or fully designed.

---

## 9. Buildings ✅

### Build Modal

Shows building cards with pixel-art icons, names, costs (prominent, in red), descriptions, and three stat lines: capacity increase, ground rent increase, utilities increase (latter two in red — they're permanent cost increases). Unaffordable buildings are dimmed with "Can't afford" label.

### Building List

Collapsible panel showing all buildings. Each row: name and count display (e.g. "8 (16)" = 8 built, 16 capacity). Under-construction buildings show amber "Pending" tag.

---

## 10. Scoring & Milestones ✅

### Score Display

Overall score shown in the Top Bar status strip, formatted with commas. Always visible during gameplay.

### Scoring Diagnostic (Dev Tools)

Detailed breakdown with:
- Weekly formula: current vibes, pop scale, harmony, projected points
- Score totals: weekly, milestone, overall, plus peak vibes, peak pop, churn-free streak
- Earned milestones: scrollable list with badge name, category, points, week earned
- Unearned milestones: remaining milestones with point values and hint text

### Milestone Categories

53 milestones across 8 categories (see [Causal Chain §2](Fort_Llama_Causal_Chain.md) for full list). Milestones are one-off — earn the badge once, keep the points.

---

## 11. Modal System ✅

All four action buttons (Recruit, Build, Policies, Research) open full-screen modals sharing the same interaction pattern:

### Three-Stage Commit Flow

**Stage 1 — Browse and Select**: List of cards. Click to select (golden amber highlight). One selection at a time.

**Stage 2 — Green Commit Bar**: Appears at bottom showing action + cost (e.g. "Build Bedroom · £200"). Click to proceed.

**Stage 3 — Confirmation Popup**: Red-bordered "are you sure?" panel with consequence description. Confirm (green) and Cancel (red) buttons.

After confirming: green success banner (e.g. "✓ Building under construction — ready next week"). Action locked.

### Modal-Specific Behaviour

**Recruit**: Candidate cards with name, age, bio, 8 stat bars (1–20 range, traffic-light). Header shows "NO ROOM" at capacity, "RECRUITED" if used, or free bed count.

**Build**: Building cards with pixel icons, cost, description, capacity/cost stat lines. Unaffordable = dimmed.

**Policies**: Checkbox interaction (not toggles). 18×18 checkbox (green + tick when active, empty when inactive). Shows pending changes as "→ ON" / "→ OFF". Only unlocked policies visible.

**Research**: Frontier-only display (no greyed-out locked techs). Grouped by tree with pillar-coloured headers. Type chips, cost, description. Current research banner with Cancel.

---

## 12. Tutorial / Onboarding 🎯

Spec TBC. The game should teach through consequences and legible feedback rather than explicit instructions. The noticeboard, sparklines, and tier labels are the primary teaching mechanisms.

Future: progressive introduction system that highlights key mechanics during the first few weeks of play.

---

## 13. Game Over ✅

Triggered when treasury hits −£5,000. Shows final score and restart option. No continue mechanic — game over is permanent for that run.

---

## 14. Landing Page ✅

Start screen shown before game begins. Features game branding, "golden hour at the festival field" visual style, and Start New Game button. Transitions to dashboard on game start.

---

## 15. Visual Design System ✅

### Design Aesthetic

Retro pixel art in the spirit of Stardew Valley. Hard, blocky edges. Chunky pixelated fonts. Progress bars made of individual segments. Icons built from tiny coloured squares on a grid. The mood is "golden hour at the festival field" — warm, inviting, slightly counterculture.

### Theme Tokens

Full colour palette exported from `theme.js`:

```
Page & Surfaces
  pageBg:          #87CEEB    (sky blue — page background)
  bg:              #282828    (dark neutral gray — base surface)
  panelBg:         #303030    (lifted gray — panel backgrounds)
  panelBorder:     #4a4a4a    (panel borders)
  panelBorderLight:#585858    (lighter borders for subtle dividers)
  actionBg:        #2b2b2b    (action panel background)
  buttonBg:        #3a3a3a    (button surfaces)
  buttonBorder:    #4a4a4a    (button borders)
  buttonHover:     #444444    (button hover state)

Text
  textPrimary:     #e6e2dc    (main body text — warm off-white)
  textSecondary:   #9c9894    (secondary text — muted warm gray)
  textMuted:       #6a6866    (tertiary text — very muted)

Accent (Golden Amber)
  accent:          #D4A035    (hero accent — brand, titles, selections)
  accentBright:    #E8B84A    (bright variant — highlights, glows)
  accentBg:        rgba(212,160,53,0.10)   (wash for backgrounds)
  accentBorder:    rgba(212,160,53,0.28)   (subtle accent borders)

Health Pillar Colours
  ls:              #b07cc8    (Living Standards — purple)
  pr:              #7eaac4    (Productivity — slate blue)
  pt:              #d475a8    (Partytime — warm rose)

State Colours
  positive:        #8cc4a0    (good states, income, confirmations)
  negative:        #c47e7e    (bad states, costs, warnings)
```

### Typography

Two font families:

- **Press Start 2P** — Retro pixel font. Used for headings, brand text, pixel elements, labels.
- **Share Tech Mono** — Monospace body font. Used for numbers, data, descriptions.

Size scale:
- Brand: 14px
- Display: 13px
- Heading: 11px
- Body: 10px
- Label: 9px
- Micro: 8px

### Layout

Three-zone structure with golden ratio flex (1.618). Fixed 100vh layout with scroll containment (individual panels scroll, page doesn't). Two-column dashboard interior.

### Colour Language

- **Golden amber** — Brand accent, interactive highlights, the "Fort Llama" identity
- **Purple** — Living Standards pillar and its budget/tech associations
- **Slate blue** — Productivity pillar
- **Warm rose** — Partytime pillar
- **Green** — Good states, income, active policies, confirmations
- **Red** — Bad states, costs, warnings, deactivations
- **Traffic-light gradient** (red → amber → green) — Used in all segmented bars, gauges, accumulators

### Clouds Animation

Six decorative cloud wisps as absolutely-positioned divs behind content:

- Blurred white radial gradients (blur 4–8px)
- Opacity 0.4–0.6, sizes 180×50px to 400×50px
- Three CSS keyframe animations (`fl-drift1`, `fl-drift2`, `fl-drift3`) at 60–120s speeds
- Staggered animation delays prevent synchronised movement
- Container: `pointerEvents: none`, `zIndex: 0` (purely decorative)

### Pixel Art Icons

`PixelIcon` component renders 16×16 grid icons with `imageRendering: crispEdges`. Building icons use 28×28 grid. Tech tree icons use 28×28 with pillar colours.

### Scrollbars & Inputs

Custom thin scrollbar styling. Rent slider with golden amber thumb. All following the retro pixel aesthetic.

---

## 16. Component Catalogue ✅

### Data Visualisation

- **Sparkline** — Stepped line chart (last 16 weeks of health metric history). Staircase pattern matches pixel art aesthetic.
- **SegBar** — 25-segment horizontal bar with traffic-light gradient. Used for coverage primitives.
- **MiniGauge** — Semi-circular arc with 10 segments (green → amber → red). Used for crowding and noise.
- **MiniAccum** — Vertical bar filling bottom-up with colour-changing fill. Used for accumulators.
- **StatBar** — Horizontal 1–20 range bar with traffic-light colouring. Used in candidate stat displays.

### Layout & Chrome

- **Panel** — Standard content wrapper with title, optional counter, consistent border/padding.
- **ModalShell** — Shared modal infrastructure: dark overlay, centred panel, commit bar, confirmation popup. Implements the three-stage commit flow.
- **TopBar** — Header with logo, tabs, status strip.

### Interactive Elements

- **ActionButton** — Square button with pixel icon, label, glow (available) / tick overlay (spent) states. Arranged in 2×2 grid.
- **ResidentChip** — Name tag with skill popup on hover.
- **PolicyChip** — Coloured pill (green active / red inactive) with tooltip.
- **TreasuryRow** — Financial line item with hover breakdown popup.

### Icons

- **PixelIcon** — 16×16 grid, `crispEdges` rendering. Categories: actions, primitives, decorative.
- Building icons (28×28), Tech icons (28×28 with pillar colours).

### Modals

- **RecruitModal** — Candidate cards with stats, three-stage commit.
- **BuildModal** — Building cards with costs, three-stage commit.
- **PoliciesModal** — Checkbox interaction, pending change preview.
- **ResearchModal** — Frontier-only tech display, grouped by tree.

### Screens

- **FortLlamaLanding** — Start screen with branding and new game flow.
- **GameOverScreen** — Final score display and restart.

---

## Key Design Decisions

**"Culture" not "Health Metrics"** — The panel was renamed because the three pillars define the commune's culture. "Health Metrics" was too clinical.

**Costs always in red** — Building costs (Ground Rent, Utilities) in red because they're permanent expense increases.

**Glowing action buttons** — Available actions have golden amber glow on label text (lit neon sign). Spent actions lose glow (switched-off sign). Atmospheric without being noisy.

**Checkboxes for policies, not toggles** — Binary on/off with confirm step, not continuous control.

**Frontier-only research** — Only techs you can actually pursue are shown. Prevents information overload.

**Stepped sparklines** — Staircase pattern matches pixel art aesthetic. Smooth curves would clash.

**Golden ratio layout** — 1 : 1.618 flex ratio gives information area natural weight.

---

*See [Causal Chain](Fort_Llama_Causal_Chain.md) for all formula details behind the mechanics described here.*
