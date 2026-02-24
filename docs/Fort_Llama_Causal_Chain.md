# Fort Llama — Causal Chain & Balance Reference

*Last major update: February 2026*

> **Purpose**: Single reference for how every player action flows through the simulation to produce outcomes. Covers the four-layer pipeline, the scoring system, the starting scenario analysis, and all tuning parameters.
>
> **Companion document**: [Sim Principles](Fort_Llama_Sim_Principles.md) (strategic anchor — design intent without numbers)

---

## 1. The Causal Chain

The game has four layers. Every player action flows through all four before it affects outcomes.

```
PLAYER LEVERS → PRIMITIVES → HEALTH METRICS → OUTCOMES
(what you do)   (what changes)  (how it reads)   (what happens)
```

### Layer 1 — Player Levers

These are the only things the player can directly control:

| Lever | Constraints | Primary Effect |
|-------|------------|----------------|
| **Rent** (£50–£500) | Set once per week | Income = N × rent; higher rent → higher churn (modulated by Living Standards) |
| **Budgets** (6 sliders) | Cost deducted weekly | Boost coverage supply or amplify accumulator outflow |
| **Build** (1/week) | Costs £200–£800; raises ground rent + utilities | Adds capacity (bedrooms, bathrooms, heaven, hot tub) |
| **Research** (1/week) | Costs £500–£2000; takes 1 week | Unlocks policies, buildings, fixed costs, upgrades |
| **Policies** (toggle, 1/week) | Locked until tech researched | Exclude worst 25% from stat averaging; >3 active = fun penalty |
| **Fixed Costs** (toggle) | Weekly cost when active | Multiplier boosts (Starlink → drive, Cleaner → cleaning) |
| **Invite** (1+ per week) | Requires bedroom capacity | Add 1 resident; extra slots from high Partytime |

### Layer 2 — Primitives (8 metrics, 0–100)

Three distinct types, each with a different mechanical shape:

#### Coverage Primitives — supply vs demand, scored via `log2CoverageScore`

| Primitive | Supply formula | Demand | Key levers |
|-----------|---------------|--------|------------|
| **Nutrition** | min(N, kitchenCap) × outputRate × tierMult × kitchenQ × foodMult × (1 + skillMult × cookSkill) + budget × supplyPerPound | N × consumptionRate | Kitchen capacity, cooking skill, ingredients budget |
| **Fun** | min(N, livCap) × outputRate × tierMult × livQ × funMult × (1 + skillMult × avg(socio, stamina)) × policyMult × considerationDamp + budget + heavenOutput + hotTubOutput | N × consumptionRate | Living room cap/quality, sociability, party supplies budget, heaven/hot tub buildings |
| **Drive** | min(N, livCap) × outputRate × tierMult × livQ × (1 + skillMult × workEthic) × starlinkMult + budget | N × slackRate | Living room cap/quality, work ethic, internet budget, Starlink |

**Great Hall upgrade**: Replaces the living room. Capacity 30 (up from 20), quality 2.0 (up from 1.0). Quality flows through `livQ` in fun, drive, and noise formulas — doubling output and halving noise. Complete building replacement, not a multiplier on top.

**Policy fun penalty** (`policyMult`): When more than 3 policies are active, fun supply is reduced. Creates a cost to bureaucratic overreach — each policy individually helps, but stacking too many dampens the commune's spontaneity.

**Consideration dampener** (`considerationDamp`): Considerate residents slightly reduce fun output (max 12%). Creates a trade-off: consideration reduces noise (helping Productivity) but dampens fun (hurting Partytime).

The `log2CoverageScore` converts supply/demand ratio to 0–100:

| Ratio | Score | Label |
|-------|-------|-------|
| 0.25 | 0 | Shortfall |
| 0.50 | 25 | Sparse |
| 0.75 | 43 | Tight |
| 1.00 | 50 | Adequate |
| 1.50 | 65 | Comfortable |
| 2.00 | 75 | Plentiful |
| 3.00 | 87 | Abundant |
| 4.00 | 100 | Great |

Formula: `25 × (log₂(supply/demand) + 2)`, clamped 0–100.

#### Instantaneous Primitives — direct reads, no accumulation

| Primitive | Formula | Key levers |
|-----------|---------|------------|
| **Crowding** | `min(100, max(crowdingFloor, maxRatio × crowdBaseMult × overcrowdingPenalty(maxRatio)))` where maxRatio = highest of bed/bath/kitchen/living ratios. `crowdingFloor` = 25. | All room capacities, population |
| **Noise** | `(socialNoise + ambientNoise) / effectiveLivQuality` — Social: `N × baseSocial × socioMult × considMult`. Ambient: `baseAmbient × overcrowdingPenalty(N/livCap)`. | Living room capacity/quality, consideration skill, sociability, Great Hall |

#### Accumulators — debt builds over time, requires sustained investment to reverse

| Accumulator | Inflow | Outflow | Key levers |
|-------------|--------|---------|------------|
| **Cleanliness** | messPerRes × N × overcrowding(bathroom) | cleanBase × bathQ × statMult(tidiness) × techMult × fixedCostMult × budgetMult | Tidiness, bathroom quality, cleaning budget, Cleaner, Chores Rota |
| **Maintenance** | wearPerRes × N × overcrowding(bedroom, K=4 P=3) | repairBase × uQ × statMult(handiness, tidiness) × techMult × budgetMult | Handiness, tidiness (secondary), utility quality, repair budget |
| **Fatigue** | exertBase × (1 + workMult × workEthic + socioMult × sociability) + activityFatigue | recoverBase × (1 + partyCoeff × partyStamina) × recoveryMult × bQ × budgetMult × (1/overcrowding) | Wellness budget, activity level, party stamina, overcrowding |

**Activity fatigue**: Fun and drive supply also generate fatigue via `funFatigueCoeff` (0.005) and `driveFatigueCoeff` (0.005). Higher output means more activity, which means more tiredness.

**Timestep**: All accumulator net flows are multiplied by a `× 0.5` timestep factor before application.

**Asymmetric recovery**: When net flow is negative (debt reducing), it's multiplied by `recoveryDamping` (0.65). Debt always recovers slower than it accumulates.

**Budget boost (accumulators)**: `outflowMultiplier = 1 + budget × outflowBoostPerPound`. Amplifies natural outflow rate rather than subtracting from stock directly.

**Budget boost (coverage)**: `supplyBoost = budget × supplyPerPound`. Added directly to supply.

### Layer 3 — Health Metrics (0–100)

Three pillars computed from primitives, processed through a sigmoid normalisation:

**Living Standards** = sigmoid(weighted combination of nutrition, cleanliness, maintenance, crowding)

**Productivity** = sigmoid(weighted combination of drive, noise, fatigue × dynamicWeight)

**Partytime** = sigmoid(weighted combination of fun, fatigue × (1 − dynamicWeight))

**Dynamic fatigue weight**: Shifts between Productivity and Partytime based on their relative pre-fatigue strengths. The share of each pillar determines how much fatigue weighs against it — if PR is stronger than PT, fatigue penalises PR more. This creates the intended PR/PT tension: boosting one pillar makes it more vulnerable to fatigue.

**Sigmoid**: `100 × x^p / (1 + x^p)` where `x = raw / mRef`. Compresses scores into a readable 0–100 range with diminishing returns at extremes.

### Layer 4 — Outcomes

**Vibes** = `(LS × PR × PT)^(1/3)` — geometric mean enforces balance.

**Churn** = `baseChurn + (rent × rentMult × rentToleranceMult) + (baseline − PR) × churnScale` — applied unconditionally. When PR is above the baseline (24), the PR modifier is negative, *reducing* churn. When below, it increases churn.

**Rent tolerance** = `1 + rentCurve × (50 − LS) / 50` — high LS lets the player charge more rent without spiking churn.

**Recruitment** = `1 + floor((PT − 35) / 15)` — high Partytime earns extra invite slots.

**Vibes tiers**: Named brackets: Shambles, Rough, Scrappy, Fine, Good, Lovely, Thriving, Wonderful, Glorious, Utopia. Branch labels (Party Mansion, Sweat Shop, Shanty Town, etc.) activate when one pillar dominates by a configurable threshold.

---

## 2. Scoring System

The Overall Score is Fort Llama's headline number, designed as the basis for leaderboards and arcade-style competition. Built from two streams:

**Overall Score = Weekly Points (cumulative) + Milestone Points**

### Weekly Points

Calculated at each week-end and added to a running total (never decreases):

> **Weekly Points = Vibes × Population Scale × Harmony × 10** *(rounded down)*

**Vibes** — Current vibes percentage. The biggest driver.

**Population Scale** — Multiplier rewarding larger communes:

| Residents | Multiplier |
|-----------|-----------|
| 1–4       | ×1.0      |
| 5–8       | ×1.5      |
| 9–12      | ×2.0      |
| 13+       | ×3.0      |

**Harmony** — Bonus for keeping the three pillars in balance:

> Harmony = 0.7 + 0.3 × (lowest pillar ÷ highest pillar)

Perfectly balanced pillars → 1.0 (full bonus). One pillar at zero → 0.7 (30% penalty). The floor means imbalance is a nudge, not a cliff.

**Worked example**: Week 20, vibes at 52, population 10, harmony 0.92: `52 × 2.0 × 0.92 × 10 = 956 points` that week.

### Milestone Points

One-off achievement bonuses. 53 milestones across 8 categories, with a theoretical maximum of 21,900 points:

| Category | Count | Max Points | Examples |
|----------|-------|------------|---------|
| Population | 5 | 1,750 | Open Doors (5 residents, +100), Full House (16 residents, +750), Stable Community (4 weeks zero churn, +300) |
| Vibes | 8 | 5,150 | Scrappy (vibes ≥25, +50) through Utopia (vibes ≥95, +2,000) |
| Reputation | 4 | 3,350 | Reputable (+150) through Mythical (+2,000) |
| Economic | 4 | 1,700 | Breaking Even (+150), Out of the Red (treasury ≥0, +300), Rainy Day Fund (≥£2k, +500), Flush (≥£5k, +750) |
| Building | 3 | 600 | Expanding (+100), plus specific building badges |
| Branch | 6 | 900 | Showhome/Party House/Grind House (+100), their extreme variants (+200) |
| Survival | 3 | 1,150 | Still Standing (week 10, +100), Veteran (week 25, +300), One Year (week 52, +750) |
| Culture/Tech | 20 | 7,300 | One per tech: early +100, mid +250, advanced +500. **All badge names TBC.** |

Culture/tech milestones are the biggest category (~34% of all milestone points), heavily rewarding tech tree investment.

### Scoring Implementation

Scoring logic lives in `server/scoring.js`, exporting five functions:

- `getPopScale(n)` — Population bracket lookup
- `calculateHarmony()` — Reads three health metrics, computes harmony bonus
- `calculateWeeklyScore()` — Full weekly formula, appends to history, updates running total
- `checkMilestones()` — Tests all 53 conditions, awards newly earned milestones
- `updateScoringTrackers(churnCount)` — Updates zero-churn streak, peak population, peak vibes

Milestone definitions live in `MILESTONE_DEFINITIONS` in `server/config.js`. Scoring config lives in `DEFAULT_SCORE_CONFIG`. Week-end processing fires in order: `updateScoringTrackers → calculateWeeklyScore → checkMilestones`.

---

## 3. Starting Scenario Analysis

### Current Economy (Debt-Start Model)

The player starts with 4 residents, zero treasury, and immediately goes into debt.

| Item | Amount |
|------|--------|
| Residents | 4 |
| Rent | £150/resident/week |
| Income | £600/week |
| Ground rent | £700/week |
| Utilities | £250/week |
| Starting budgets | ~£215/week |
| **Net (after budgets)** | **~−£565/week** |
| Game over threshold | −£5,000 |
| Weeks until game over (no growth) | ~9 |

The economy creates immediate pressure to recruit. Each new resident adds £150 income but worsens accumulator pressure. Break-even (before budgets) requires ~7 residents. Comfortable surplus requires 10+.

### Starting Primitive State

At N=4 with starting budgets:

- **Coverage ratios**: ~0.55–0.60 before skill/building modifiers. With starting budgets adding supply, scores land in the 35–45 range ("Tight").
- **Cleanliness**: Slow build. At 4 residents, inflow is low (messPerResident × 4 = 0.4/tick). Starting budget of £20 provides meaningful outflow boost. Accumulates slowly but noticeably over 3-4 weeks.
- **Maintenance**: Similar to cleanliness. Starting budget of £30 keeps it manageable at low population.
- **Fatigue**: Builds most noticeably at N=4. Starting wellness budget of £20 slows but doesn't prevent accumulation.
- **Crowding/Noise**: Low at N=4 (well below bedroom and living room capacity).

### Starting Health Metrics & Vibes

Starting vibes: ~25–30 ("Scrappy"). All three pillars in the 30–45 range. Low but not alarming — the player can see room for improvement without feeling the situation is hopeless.

### The Difficulty Squeeze

As the player recruits to fix the economy:

- **N=4–6**: Economy is the crisis. Accumulators are manageable. Tech investment is the priority.
- **N=7–9**: Economy stabilises. Cleanliness and maintenance start building noticeably. The player needs to increase budgets.
- **N=10+**: Economy generates surplus. All three accumulators demand attention. Tech unlocks (Chores Rota, Cleaner, Wellness) become essential. The three-pillar balance becomes the strategic puzzle.

---

## 4. Tuning Parameters

All values live in `server/config.js`. These are the current codebase values.

### Accumulator Base Rates

| Accumulator | Inflow param | Value | Outflow param | Value | Design intent |
|-------------|-------------|-------|---------------|-------|---------------|
| Cleanliness | messPerResident | 0.1 | cleanBase | 0.52 | Slow build at low pop, meaningful by N=8+ |
| Maintenance | wearPerResident | 0.08 | repairBase | 0.54 | Similar to cleanliness, slightly faster |
| Fatigue | exertBase | 0.59 | recoverBase | 0.51 | Slow background pressure, creates PR/PT tension |

**Recovery damping**: 0.65 — debt recovers at 65% of accumulation speed.

**Timestep**: All net flows are multiplied by `× 0.5` before application, so effective per-tick change is half the raw net flow.

### Coverage Base Ratios

| Primitive | outputRate | consumptionRate/slackRate | Approx ratio at N=4 |
|-----------|-----------|--------------------------|---------------------|
| Nutrition | 7.3 | 13 | ~0.56 |
| Fun | 9.2 | 16 | ~0.58 |
| Drive | 6.3 | 11 | ~0.57 |

All three start below 1.0, producing coverage scores in the 35–45 range. Fun and Drive score slightly lower than Nutrition by design — Nutrition feeds the foundation pillar (LS), while Fun and Drive feed the competing pillars.

### Other Key Parameters

| Parameter | Value | Purpose |
|-----------|-------|---------|
| penaltyOnset | 0.75 | Overcrowding penalty starts at 75% capacity |
| recoveryDamping | 0.65 | Debt recovers at 65% of accumulation speed |
| outflowBoostPerPound | 0.005 | £1 budget → 0.005 added to outflow multiplier |
| supplyPerPound | 0.5 | £1 budget → 0.5 added to coverage supply |
| baseFatigueWeight | 0.5 | Centre point for dynamic fatigue dampening |
| fatigueWeightSwing | 0.5 | Range of fatigue weight shift (0.3–0.7) |
| rentCurve | 0.7 | LS influence on rent tolerance |
| rentTierCurvature | 2 | Curved LS scaling for rent tier labels |
| handinessCoeff | 0.25 | Handiness contribution to maintenance outflow |
| tidinessCoeff | 0.12 | Tidiness contribution to maintenance outflow (secondary) |
| considerationPenalty | 0.12 | Max 12% fun reduction from consideration |
| funPenalty.threshold | 3 | Policies above this count reduce fun |
| funPenalty.K | 0.15 | Policy fun penalty severity |
| funPenalty.P | 1.5 | Policy fun penalty curvature |

### Scoring Parameters

| Parameter | Value | Purpose |
|-----------|-------|---------|
| scaleFactor | 10 | Makes weekly point numbers feel meaningful |
| harmonyFloor | 0.7 | Minimum harmony multiplier (30% max penalty) |
| harmonyWeight | 0.3 | How much balance matters (1 − floor) |
| popBrackets | [4, 8, 12] | Population breakpoints for scale multiplier |
| popMultipliers | [1.0, 1.5, 2.0, 3.0] | Points multiplier per bracket |

---

## 5. Key Formula Reference

| Formula | Expression |
|---------|-----------|
| Stat → 0-1 | `(stat − 1) / 19` |
| Overcrowding penalty | `1 + K × max(0, ratio − penaltyOnset)^P` (default K=2, P=2) |
| Coverage score | `25 × (log₂(supply/demand) + 2)`, clamped 0–100 |
| Dampener | `(1 − value/100)^weight` |
| Baseline | `(value/100)^weight` |
| Sigmoid | `100 × x^p / (1 + x^p)` where `x = raw / mRef` |
| Budget boost (coverage) | `budget × supplyPerPound` (added to supply) |
| Budget boost (accum.) | `1 + budget × outflowBoostPerPound` (multiplied into outflow) |
| Recovery damping | `netFlow × recoveryDamping` (when netFlow < 0) |
| Rent tolerance | `1 + rentCurve × (50 − LS) / 50` |
| Policy fun penalty | `max(0, 1 − K × (policies − threshold)^P)` when policies > threshold |
| Consideration fun damp | `1 − considerationPenalty × avgConsideration` |
| Vibes | `(LS × PR × PT)^(1/3)` |
| Churn | `baseChurn + (rent × rentMult × rentToleranceMult) + (baseline − PR) × churnScale` where baseline = 24, applied unconditionally |
| Recruitment | `1 + floor((PT − 35) / 15)` |
| Weekly score | `floor(vibes × popScale × harmony × scaleFactor)` |
| Harmony | `harmonyFloor + harmonyWeight × (min pillar / max pillar)` |

---

## 6. Config Locations

All tunable values are in `server/config.js`:

| Config object | What it controls |
|---------------|-----------------|
| `DEFAULT_PRIMITIVE_CONFIG` | All 8 primitive formulas — rates, multipliers, penalty curves, `recoveryDamping`, `penaltyOnset`, stat coefficients |
| `DEFAULT_POLICY_CONFIG` | Policy effect scaling: `excludePercent`, `funPenalty` |
| `DEFAULT_HEALTH_CONFIG` | Health metric weights, sigmoid parameters, churn/recruit thresholds, fatigue dampening, `rentCurve` |
| `DEFAULT_VIBES_CONFIG` | Tier labels, balance thresholds, branch labels |
| `DEFAULT_BUDGET_CONFIG` | Budget `supplyPerPound` (coverage), `outflowBoostPerPound` (accumulators), budget curve |
| `DEFAULT_TIER_CONFIG` | Population brackets, output/health multipliers, quality caps |
| `DEFAULT_TECH_CONFIG` | Tech costs, weekly costs, effect percentages |
| `DEFAULT_SCORE_CONFIG` | Weekly score formula parameters, population brackets, harmony |
| `MILESTONE_DEFINITIONS` | 53 milestone objects (id, category, badge, points, flavour, condition) |
| `INITIAL_DEFAULTS` | Economy: treasury, rent, ground rent, utilities, churn rates, starting budgets |
| `DEFAULT_BUILDINGS` | Building capacities, costs, multipliers |
| `DEFAULT_NOTICEBOARD_CONFIG` | Max events (100), health/treasury warning thresholds, population milestone triggers |
| `DEFAULT_PRIMITIVE_LABELS` | Per-primitive tier label names and thresholds (e.g. nutrition: "Starving"→"Michelin Starred") |

Also exported: `DAY_NAMES`, `STARTING_LLAMAS`, `POLICY_DEFINITIONS`, `TECH_TREE`.

**Stat neutral point**: All skill multipliers in primitive formulas center on `STAT_NEUTRAL = 9/19 ≈ 0.474`. A resident with stat 10 (average) contributes zero bonus; higher stats boost, lower stats penalise.

Engine logic is split across:

| Module | What it does |
|--------|-------------|
| `server/primitives.js` | Layer 2 calculations (coverage, accumulators, instantaneous) |
| `server/healthMetrics.js` | Layer 3 calculations (LS, PR, PT, sigmoid, fatigue dampening) |
| `server/outcomes.js` | Layer 4 calculations (vibes, churn, recruitment, rent tiers) |
| `server/scoring.js` | Weekly score calculation, milestone checking, scoring trackers |
| `server/gameState.js` | Tick loop orchestration, week-end processing, noticeboard events |
| `server/residents.js` | Resident stat utilities |
| `server/state.js` | Shared mutable state object |
| `server/routes.js` | API endpoints |
| `server/utils.js` | Helper functions (log2CoverageScore, dampener, baseline, statTo01) |

---

## 7. Structural Changes — Implementation Status

All structural changes are implemented:

| # | Change | Status | Files |
|---|--------|--------|-------|
| 1 | Asymmetric accumulator recovery | ✅ | primitives.js |
| 2 | Budgets boost outflow (not subtract stock) | ✅ | primitives.js |
| 3 | Dynamic fatigue dampening | ✅ | healthMetrics.js |
| 4 | Noise boost removed from PT | ✅ | healthMetrics.js |
| 5 | Overcrowding starts below capacity | ✅ | primitives.js |
| 6 | LS wired to rent tolerance | ✅ | outcomes.js |
| B | Policy fun penalty (>3 active policies) | ✅ | primitives.js |
| C | Tidiness on maintenance (secondary stat) | ✅ | primitives.js |
| F | Consideration penalty on fun (max 12%) | ✅ | primitives.js |
