# Fort Llama 🦙

**A browser-based management simulation where you run a communal living facility for anthropomorphic llamas.**

Found a commune and expand. Recruit members, invest in facilities, find equilibrium — or spiral into acrimony, burnout, and bankruptcy.

---

## What Is This?

Fort Llama is a single-player strategy game that plays like an arcade-style management sim. You're in charge of a fledgling commune of llamas: setting rent, hiring staff, building facilities, researching upgrades, and trying to keep the whole thing from collapsing under its own weight.

### Core Loop

Each game week, you review your commune's state and make decisions:

- **Set rent** — balance income against resident tolerance
- **Allocate budgets** — cleaning, maintenance, food, activities
- **Recruit** — grow your population (but more residents means more strain)
- **Build** — expand capacity and unlock new capabilities
- **Research** — invest in upgrades that reshape how your commune works
- **Set policies** — communal rules that create trade-offs

Then you advance the week and watch the consequences unfold. Most games end in collapse. The ones that don't will feel earned.

---

## Current Status

Fort Llama has a working prototype with a complete game loop, scoring system, and dev tools for balance tuning. The core simulation engine is functional — the project is currently in a rebuild phase, migrating from a server-based prototype toward a clean, open-source-ready codebase.

**What's built:**

- Four-layer simulation engine (player actions → primitives → health metrics → outcomes)
- Weekly game loop with rent, budgets, building, recruitment, policies, and research
- Arcade-style scoring with weekly points and 53 milestone badges
- Full dev tools panel for live balance tuning and config editing
- Headless simulator for automated balance testing

**What's ahead:**

- Client-side engine migration (removing unnecessary server dependency)
- Cloudflare Pages deployment at [fortllamathegame.com](https://fortllamathegame.com)
- Community contribution workflows
- Leaderboard system

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)

### Run Locally

```bash
git clone https://github.com/tfparsons/Fort-Llama-The-Game.git
cd Fort-Llama-The-Game
npm install
npm run dev
```

This starts the game in dev mode — the full game plus a dev tools panel for inspecting and tuning every parameter in the simulation. The game will be available at `http://localhost:3000`.

### Other Commands

| Command | What it does |
|---------|-------------|
| `npm run dev` | Full dev environment (game + dev tools) |
| `npm run build` | Production build |
| `npm run simulate` | Headless balance testing (no browser needed) |

---

## Documentation

The game's design and architecture are documented in detail across four companion documents in the `/docs` folder:

| Document | What's in it |
|----------|-------------|
| [**MVP Overview**](docs/Fort_Llama_MVP_Overview.md) | Start here. Current state of the project, what's built, what's planned, and the full technical stack. |
| [**Sim Principles**](docs/Fort_Llama_Sim_Principles.md) | The game's design philosophy — what it should *feel* like and why. Covers the core principles that guide every balance and feature decision. |
| [**Causal Chain**](docs/Fort_Llama_Causal_Chain.md) | Every formula in the simulation engine. The ground truth for how player actions flow through to outcomes. |
| [**Player Experience Spec**](docs/Fort_Llama_Player_Experience_Spec.md) | Everything the player sees and interacts with — dashboard layout, UI components, visual design system, and all game mechanics. |
| [**Architecture**](docs/Fort_Llama_Architecture.md) | Codebase structure, module responsibilities, build setup, deployment plans, dev tools, and contribution workflows. |

If you're a **coding agent** (Claude Code, Cursor, etc.), start with [`CLAUDE.md`](CLAUDE.md) in the project root for a quick-start orientation.

---

## Contributing

Fort Llama is designed for two kinds of contributors:

**Balance tuners** — the lowest-barrier way to contribute. Clone the repo, run the game in dev mode, adjust parameters using the built-in dev tools, export your config, and open a PR. The diff shows exactly what you changed, and discussion happens around concrete numbers.

**Feature developers** — for new mechanics, UI features, or engine work. The design docs above describe the strategic intent and how systems connect, so new work stays aligned with the overall vision.

Detailed contribution workflows are documented in [Architecture](docs/Fort_Llama_Architecture.md).

---

## Tech Stack

- **Runtime:** Node.js + Express (server), React 19 (client)
- **Build:** Vite
- **Balance testing:** Headless simulator (`tools/simulate.js`)
- **Deployment (planned):** Cloudflare Pages + Workers + D1

---

*Fort Llama is built by someone who actually runs a commune. The spreadsheets were real before the game was.*
