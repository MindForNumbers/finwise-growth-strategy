# FinWise Co. — Onboarding Prototype (4 Screens)

A clickable, fully interactive trial-onboarding flow that takes a new user from intent to a live 30/60/90-day cash flow runway forecast.

## Flow

```text
/            Screen 1  Intent & Business Type
/connect     Screen 2  Frictionless Data Connection
/drivers     Screen 3  Key Driver Setup
/runway      Screen 4  Aha! Runway Dashboard
```

A slim progress rail (4 dots) sits at the top of every screen; back navigation is always available, and non-essential steps can be skipped.

## Screen 1 — Intent
- Four goal cards (Forecast Cash Flow, Track Expenses, Plan Payroll, Invoice Faster); Cash Flow is pre-selected as recommended.
- On select: page cross-fades from the generic welcome state into a blurred skeleton of the cash-flow workspace behind a frosted-glass card, plus a toast: "Configured your workspace for Cash Flow Forecasting. We've hidden everything else."
- Continue routes to Screen 2 after the reveal beat.

## Screen 2 — Data Connection
- Primary action: "Explore with Pre-filled Sample Data". Secondary, visibly de-emphasized: connect a bank/accounting tool (marked as slower).
- Clicking runs a ~2.5s live tally that counts up: transactions imported → auto-categorized → accounts linked, with a thin progress line, then auto-advances to Screen 3.

## Screen 3 — Key Driver
- One slider: Estimated Monthly Overhead, pre-filled at $18,400 from the "imported" data.
- Live text beside it recalculates on every move: "At this rate, your business needs to generate $X/day to break even."
- "Looks right" continues; "Skip" keeps the pre-filled value.

## Screen 4 — Runway Dashboard
- Headline runway number (days of cash left) with health color: green healthy, amber at-risk, red shortfall.
- 90-day projected cash-balance line chart with 30/60/90 markers and a zero line, rendered as a lightweight inline SVG so it animates smoothly.
- Scenario slider: revenue change from -30% to +20%, default 0%. Chart, runway number, and 30/60/90 cards all update live.
- Natural-language insight box updates with the slider, e.g. "Warning: A 10% revenue drop causes a shortfall by Week 6. Recommendation: Reduce software spend."
- Restart-flow link back to Screen 1.

## Data
A single sample dataset module: opening balance, 1,402 sample transactions summarized into weekly inflow/outflow, category breakdown, and a deterministic projection function that takes overhead + revenue-delta and returns the 90-day balance series, runway days, and health state. Screen 3's overhead choice carries into Screen 4.

## Design system
- Apple-esque: Inter loaded via `<link>` in the root route, mapped to a `--font-display` token.
- Monochrome palette (white, layered grays) with Apple Blue `#007AFF` as the only interactive accent; functional green/amber/red tokens used only on Screen 4.
- Generous whitespace, 12–18px radii, hairline borders, soft shadows, frosted-glass overlay cards via `backdrop-blur`.
- Minimal line icons (lucide, stroke 1.5) at small sizes.
- All colors defined as oklch tokens in `src/styles.css`; no hardcoded color classes in components.

## Technical notes
- Four TanStack Start routes plus shared components: `ProgressRail`, `GoalCard`, `SyncTally`, `AppleSlider` (custom-styled range input), `RunwayChart` (inline SVG), `InsightBox`.
- Onboarding state (goal, overhead, scenario) held in a small React context provider mounted in `__root.tsx`, with sane defaults so any screen is directly viewable.
- Toasts via sonner; `<Toaster />` mounted once in `__root.tsx`.
- Each route gets its own `head()` with unique title/description/og tags.
- Mobile-first layout: single column, thumb-reachable primary actions, chart scales to viewport.
