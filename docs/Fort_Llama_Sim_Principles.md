# Fort Llama — Simulation Principles

*Last major update: February 2026*

> **What this document is:** The strategic anchor for Fort Llama's simulation design. It describes what the game should *feel* like and why, so that when specific numbers need tuning or new features need designing, there's a shared understanding of what we're trying to achieve. No formulas or config values live here — those belong in the [Causal Chain](Fort_Llama_Causal_Chain.md).
>
> **Implementation status:** Only the early game is currently built and playable. Mid and late game sections describe *design targets* — what those phases should feel like when implemented. Each section is clearly marked.

---

## The Game in One Sentence

> **Found a commune and expand. Recruit members, invest in facilities, find equilibrium — or spiral into acrimony, burnout, and bankruptcy.**

Fort Llama is a management simulation where the player runs a communal living facility for anthropomorphic llamas. The core fantasy is building something that works: a place where people want to live, where the books balance, and where the whole thing doesn't collapse under its own weight. Most games will end in collapse. The ones that don't will feel earned.

---

## Core Philosophy

### The default state drifts toward failure

The commune's natural trajectory is decline. Without active player investment, dirt accumulates, maintenance backlogs grow, fatigue builds, and residents leave. This isn't punitive — it's the game's heartbeat. Every week the player doesn't intervene, entropy wins a little more ground. Success is earned through deliberate choices, not by doing nothing and watching numbers go up.

### Diminishing returns encourage diversification

Pouring all your resources into one area works at first, but hits a ceiling. The third pound spent on cleaning is worth less than the first. The game's maths (logarithmic scoring, multiplicative health metrics, geometric mean vibes) all enforce this: balanced investment outperforms min-maxing. A commune that neglects one pillar pays a disproportionate price, even if the other two are excellent.

### Past decisions have memory

Accumulator systems (cleanliness, maintenance, fatigue) don't reset when you start paying attention. Weeks of neglect leave a debt that takes longer to recover from than it took to accumulate. Recovery is asymmetric by design — prevention is cheaper than cure. This creates genuine strategic weight: the player can't just fix problems instantly by throwing money at them.

### Growth is a double-edged sword

More residents means more rent income, but also more mess, more noise, more strain on every system. The commune that grows too fast without investing in infrastructure will collapse harder than one that grows cautiously. Recruitment is a lever the player must learn to use carefully, not a simple "more is better" button.

---

## The Double Ledger Is the Heartbeat

Everything in the game flows through money. Residents pay rent; rent pays for upkeep, investment, and expansion. The player's core weekly rhythm is a financial one: did I make money this week, or lose it? Can I afford to invest, or am I just surviving?

This economic pressure is the pacing mechanism of the entire game. Early on, the player feels the squeeze — income barely covers costs, and every budget decision matters. Growth increases income but also increases strain. The player is always chasing a moving equilibrium.

Every new mechanic should ultimately connect back to the ledger. If something doesn't affect income or costs (directly or indirectly), question whether it belongs. Bankruptcy is the primary fail state — the game-over threshold exists to create stakes, not to punish experimentation.

---

## Three Pillars, One Tension

The three health metrics — Living Standards, Productivity, and Partytime — are the strategic soul of the game. They represent three distinct dimensions of commune life that the player must keep in balance:

**Living Standards** — Is this a decent place to live? Nutrition, cleanliness, maintenance, crowding. Failure mode: *"We're not students, we have standards."*

**Productivity** — Can people work and function here? Drive, focus, quiet. Failure mode: *"This is fun, but I have a career to think about."*

**Partytime** — Is this place socially magnetic? Fun, energy, atmosphere. Failure mode: *"I'm bored and burnt out living here."*

The central tension is between Productivity and Partytime: pushing one tends to pull the other down. Living Standards acts as the foundation that both depend on — neglect it and both suffer regardless.

The Vibes formula (geometric mean of the three metrics) mathematically enforces balance: one metric dragging creates a disproportionate penalty. Imbalances produce distinct narrative identities — Party Mansion, Sweat Shop, Shanty Town — that signal the problem to the player.

No single metric should be ignorable, and no single metric should dominate strategy. Investment in any one area should have diminishing returns and increasing side-effects that pull the player back toward balance.

---

## Feedback Loops, Not Brick Walls

When things go wrong, the player should see it coming and have time to react. When things go right, the improvement should feel tangible and encourage continued investment. The core mechanics use graduated pressure, not sudden death.

Growth increases income but also strain. Strain increases churn and risk. Stabilisation reduces risk but slows growth. This creates a natural rhythm of expansion and consolidation that the player learns to navigate.

Base state conditions should be engineered to mildly frustrate the player. The multiplier mechanics — budgets, policies, tech — represent the key to shifting the balance. Until they hit another scaling bottleneck, and need more multipliers, more baseline capacity. Success needs to be possible: if a player catches a declining metric and invests in fixing it, improvement should be achievable. Permanent death spirals with no escape are a design failure.

---

## The Player Learns by Doing

The game should teach through consequences, not tutorials. A new player should understand within their first few weeks that neglecting cleanliness makes people leave, that raising rent too high creates churn, that budgets actually matter. The cause-and-effect chain should be legible enough that the player can form theories and test them.

The noticeboard, the sparklines, the tier labels — all of these exist to make the simulation's internal logic visible. When Living Standards drops, the player should be able to trace it back to the dirty kitchens or the overcrowded bedrooms. When churn spikes, the connection to rent or low productivity should be inferrable.

Commonly-experienced states should feel manageable rather than alarming. Extreme states should convey genuine urgency. A metric at 35% should say "could be better" — not "everything is on fire." A metric at 12% should feel like a real crisis.

---

## Residents Are People, Not Headcount

Each llama has a distinct skill profile across 8 attributes. These skills flow into the simulation through stat-averaging mechanics (cooking skill affects nutrition output, tidiness affects cleanliness, etc.). The player's resident composition genuinely matters — a commune of neat, hardworking llamas plays differently from one full of social butterflies.

Policies that exclude the worst performers create a meaningful trade-off: better stat averages but reduced community inclusivity. The player's choices about who to recruit and which policies to enact shape the commune's character.

Future development deepens this: residents will gain individual personalities, preferences, events, and relationships. The commune should feel like a community, not a spreadsheet.

---

## Game Feel by Phase

### Early Game — BUILT ✅

**The feeling:** Survival mode. Debt pressure. Learning the levers.

The player starts at £0 with fixed costs exceeding income. Every decision feels consequential because resources are scarce. The commune is small enough that one bad week is felt across everything.

The core loop: set rent, allocate budgets, research tech, recruit carefully, advance week. The immediate threat is treasury — running out of money means game over. The victory condition for the early game is stabilising the economy: breaking even, then building a small cushion.

Accumulators are the slow-burn tension. At 4 residents, only fatigue accumulates meaningfully. But as the player recruits to fix the economy, cleanliness and maintenance start building too. This is the "difficulty squeeze" — growth solves one problem while creating others. Tech progression is the escape valve.

### Mid Game — DESIGN TARGET 🎯

**The feeling:** Economy stabilises. The tension shifts from "will we survive?" to "how do we grow well?"

Accumulators create lingering consequences — past neglect takes time to recover from. The player starts making genuine strategic trade-offs between pillars. Which tech tree to prioritise? How to balance Productivity vs Partytime with fatigue as the constraint? How high can rent go before Living Standards can't support it?

The tech tree deepens: Level 3 unlocks and deep specialist tracks open new possibilities but also new costs and tensions. The MVP mechanic (spec TBC) creates a new strategic dimension once the economy is stable and the basic tech tree is explored.

Residents become more individual — personalities, preferences, events. The commune starts to feel like a community, not just a headcount.

### Late Game — DESIGN TARGET 🎯

**The feeling:** Scale creates complexity. The question shifts from "will we survive?" to "how high can we push the score?"

More residents means more income but the systems are harder to keep in balance. The disaster mechanic (spec TBC) tests commune resilience — random or triggered events that punish complacency.

Deep tech tracks pay off — specialist communes have distinct character. The Party Mansion, the Grind House, the Dolls House. The player is juggling multiple interdependent systems at scale, optimising for score while preventing any single system from tipping over.

---

## Difficulty Scaling

Difficulty presets (Easy / Medium / Hard) should adjust the *pressure* on the player without changing the fundamental shape of the game.

**The levers for difficulty are:**
- Starting conditions (treasury, resident count, starting budgets)
- Accumulator decay rates and recovery damping
- Economic tightness (rent ceiling vs fixed costs, game-over threshold)
- Recruitment pool quality
- How forgiving the game-over threshold is

**Easy** should let a new player learn the systems without constant crisis. The commune drifts slowly enough that mistakes are recoverable.

**Medium** is the intended experience — the "perilous but navigable" baseline. The player needs to be actively engaged every week or things deteriorate.

**Hard** compresses the margins: less starting runway, faster decay, tighter economics. Intended for players who've mastered the systems and want to be tested.

Importantly, difficulty should NOT change the *shape* of the game. All three presets should produce the same early→mid→late arc, just with different pressure levels. A Hard game doesn't skip the early game — it makes it more intense.

---

## Scoring Philosophy

The scoring system creates an arcade-style motivation layer on top of the simulation. It rewards sustained quality (weekly points from high vibes) and exploration (one-off milestone bonuses for reaching new thresholds).

Weekly points accumulate — they never go down. Every week of survival adds to the total, but better-managed communes earn dramatically more per week. This creates the feel where longer runs naturally score higher, but a tight 20-week commune can outscore a sloppy 40-week one.

Milestones reward breadth: growing population, exploring the tech tree, pushing into new vibes territory, achieving financial stability. The culture/tech milestones are the single biggest category, heavily rewarding players who invest in the tech tree rather than just optimising the three health pillars.

The harmony bonus gently steers toward balanced play — an imbalanced commune loses up to 30% of weekly points, which is a nudge not a cliff. The population scale multiplier rewards growth, but only if you can keep vibes up at the same time.

---

## Accumulator Philosophy

Accumulators (cleanliness, maintenance, fatigue) are the game's "memory" system. They model consequences that persist over time rather than resetting each week.

**Asymmetric recovery** is the core design principle. Debt builds at a known rate but recovers at only ~65% of that speed. This means prevention is cheaper than cure — a player who invests early in cleaning budgets avoids a debt that would cost more to fix later. The asymmetry creates the strategic weight that makes accumulator management feel meaningful.

**Budget interaction** follows the outflow-boost model: spending money doesn't subtract directly from the debt stock, it amplifies the natural cleaning/repair/recovery rate. This means budgets work best when the debt is moderate (high outflow rate applied to meaningful stock) and become less effective at extremes (nothing to clean when debt is zero, overwhelmed when debt is maximal).

**Fatigue** is the special case. It creates the intended tension between Productivity and Partytime through a dynamic weight-shift system. When fatigue is low, both pillars benefit equally. When fatigue is high, it creates a seesaw — boosting one pillar comes at a greater cost to the other.

---

## Coverage Philosophy

Coverage primitives (nutrition, fun, drive) model supply-versus-demand systems scored on a logarithmic curve.

The logarithmic scoring means that moving from "terrible" to "okay" is relatively easy, but pushing from "good" to "excellent" requires disproportionate investment. This creates natural diminishing returns and makes the middle range (where most gameplay happens) the most sensitive to player decisions.

Coverage tier labels are tailored per primitive to create thematic variety. Nutrition uses food-themed labels ("Scraps" → "Feast"), Fun uses entertainment-themed labels, and Drive uses motivation-themed labels. The commonly-experienced mid-range tiers should feel descriptive and manageable, not alarming. Extreme tiers should convey real urgency.

---

*This is a living document. Changes should be deliberate — if a principle is being revised, that revision should be discussed and documented.*
