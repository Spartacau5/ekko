# Ekko

> Intelligence platform for nonprofits and civic organizations.

Ekko brings together internal knowledge, external signals, and shared ecosystem intelligence into one clear, actionable workspace. This repository contains the **Phase 1 desktop prototype** — a React + TypeScript + Tailwind frontend with static mock data, built to demonstrate core flows and a complete design system.

The product is designed to feel **institution-grade, editorial, trustworthy, information-rich, and calm** — drawing structural inspiration from tools like Candid, not from trendy startup aesthetics.

---

## Status

**Phase 2 — Expanded prototype.** Frontend only, no backend. All data is mock data wired through TypeScript modules. Phase 2 deepens every surface to feel like a more complete and believable SaaS workspace while staying inside the same visual system.

What Phase 2 adds on top of Phase 1:

- **People** is now a workspace, not a single list. New sub-routes for Donors / Groups / Accounts, with a saved-views bar, sortable columns, multi-select bulk actions, and a richer donor detail page (filterable timeline, persona insight, group memberships).
- **Policy** has a watchlist + alerts page, a topic-organized browse mode, watchlist toggles on every card, and a richer policy detail with stakeholder alignment bars and internal team discussion.
- **Peers** has full peer organization detail pages with you-vs-them benchmark comparisons and a separate Campaign intelligence library page with theme/channel filtering.
- **Dashboard** is now a mission-control surface with KPI sparklines, a priority tasks panel, fundraising trend chart, and a cross-feature recent activity feed.

---

## Tech stack

- **React 19** + **TypeScript**
- **Tailwind CSS 3** with custom design tokens
- **React Router 7** for client-side routing
- **Lucide React** for icons
- **Recharts** for benchmark visualizations
- Bootstrapped with **Create React App**

---

## Screens included

| # | Screen | Route |
|---|---|---|
| 1 | 6-step onboarding | `/onboarding` |
| 2 | Mission-control dashboard | `/dashboard` |
| 3 | Spotlight tour (4 steps) | overlays dashboard |
| 4 | Donors list (saved views, sort, multi-select) | `/people/donors` |
| 5 | Donor detail (filterable timeline, persona insight) | `/people/donors/:id` |
| 6 | Groups list | `/people/groups` |
| 7 | Group detail | `/people/groups/:id` |
| 8 | Accounts list | `/people/accounts` |
| 9 | Account detail (gift history chart) | `/people/accounts/:id` |
| 10 | Policy list (List + By topic views) | `/policy` |
| 11 | Policy watchlist + alerts | `/policy/watchlist` |
| 12 | Policy detail (stakeholder alignment, discussion) | `/policy/:id` |
| 13 | Peers / benchmark overview | `/peers` |
| 14 | Peer organization detail | `/peers/:id` |
| 15 | Campaign intelligence library | `/peers/campaigns` |
| 16 | Settings overview | `/settings` |

---

## Design system

Defined in [`tailwind.config.js`](tailwind.config.js) and used consistently throughout the app.

### Color tokens

| Token | Value | Use |
|---|---|---|
| `bg-page` | `#F3F1EC` | Warm gray page background |
| `bg-surface` | `#FFFFFF` | Cards and elevated surfaces |
| `bg-surface-muted` | `#ECE8E1` | Inset / hover states |
| `text-primary` | `#111111` | Body text |
| `text-secondary` | `#5C5A57` | Supporting text |
| `text-muted` | `#7A756E` | Metadata / labels |
| `border-default` | `#262626` | Strong borders |
| `border-subtle` | `#D6D0C7` | Card outlines |
| `accent` | `#F4BE00` | Primary actions, highlighted states |
| `accent-soft` | `#F7E59E` | Featured / hover backgrounds |
| `success` | `#0E7C66` | Healthy donors, positive deltas |
| `warning` | `#B07100` | Attention required |
| `danger` | `#A14A3B` | At-risk donors, high-risk policies |
| `info` | `#48627A` | Neutral metadata, jurisdiction chips |

### Typography

- **Display (serif)**: Source Serif 4 — `display-1` (48/56) and `display-2` (36/44)
- **UI (sans)**: Inter — `heading-1` (28/36), `heading-2` (22/30), `body` (16/24), `body-sm` (14/20), `label` (13/18)
- **Stat**: Inter Semibold 32/36 for large numeric values

### Radius & spacing

- Border radius: 2 / 4 / 8px (minimal rounding)
- Spacing scale: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64

---

## Project structure

```
src/
├── components/
│   ├── ui/             Reusable primitives: Button, TextInput, SelectInput,
│   │                   Checkbox, Chip, Modal, Tabs, Banner, SearchBar,
│   │                   PageHeader, EmptyState, ProgressBar
│   ├── layout/         TopNav, AppLayout
│   ├── onboarding/     OnboardingStepper
│   └── tour/           SpotlightTour (4-step guided tour)
├── pages/
│   ├── OnboardingPage.tsx       6-step flow with progressive disclosure
│   ├── DashboardPage.tsx        Org summary, signals, 3-column priority grid
│   ├── PeoplePage.tsx           Filterable donors table
│   ├── DonorDetailPage.tsx      Header, timeline, suggested next-step panel
│   ├── PolicyPage.tsx           Filterable policy cards
│   ├── PolicyDetailPage.tsx     Stakeholder map, impact panel, timeline
│   ├── PeersPage.tsx            Benchmarks, peer org grid, campaign insights
│   └── SettingsPage.tsx         5 tabbed settings sections
├── data/                Mock data: organization, donors, policies, peers, alerts
├── App.tsx              Router setup
└── index.tsx            Entry
```

---

## Mock data

The prototype is populated with realistic data for **Rivergate Community Alliance**, a fictional mid-size NYC housing nonprofit:

- **10 donors** with personas, giving history, risk levels, suggested next actions, and rich activity timelines
- **6 policies** spanning city, state, federal, and regional jurisdictions, each with stakeholders and event timelines
- **8 peer organizations** with mission areas, campaign themes, and benchmark stats
- **5 dashboard alerts** covering people, policy, peer, and setup categories

All mock data lives in [`src/data/`](src/data/).

---

## UX principles

- **Progressive disclosure** — never show giant forms up front; reveal fields only when needed
- **Structured density** — readable, scannable, information-rich without feeling cluttered
- **Detailed filtering** — modal-based filter pickers for People, Policy, and Peers
- **Plain-language copy** — no jargon, no hype
- **Editorial tone** — serif headlines, calm warm-gray surfaces, strong borders, minimal shadows
- **Spotlight tour** for first-run education

---

## Getting started

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:3000)
npm start

# Production build
npm run build
```

The app opens on `/onboarding` by default. Walk through the 6-step flow, then land on the personalized dashboard where the spotlight tour will run automatically on first visit.

---

## Companion Figma file

A complete Figma design system with all 13 screens, color variables, text styles, and reusable components was built in parallel using the Figma MCP server. It mirrors the React app one-to-one.

The Figma file contains three pages:
1. **Design Tokens** — color swatches and type specimen
2. **Components** — Buttons, Chips, Inputs, Tabs, Cards, etc. (real Figma components)
3. **Screens** — all 13 desktop screens at 1440px width

---

## What's intentionally **not** here

- No backend, no API, no auth — Phase 1 is frontend-only
- No tests — this is a UX prototype, not production code
- No mobile layouts — desktop-first
- No animations beyond subtle hover/transition states — calm by design
- No glassmorphism, neon gradients, oversized rounding, or trendy startup aesthetics

---

## License

This is a private prototype.
