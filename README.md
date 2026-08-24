# FinWise Fast Track

Build a clickable onboarding prototype for FinWise Co., a financial-management

SaaS for small businesses (product-led growth, reverse trial).

Create 4 screens that take a brand-new trial user from sign-up to their

Aha moment as fast as possible. The Aha moment is: Seeing an automated 30-day cash flow runway forecast generated from their actual (or sample) business data.

Screens:

Screen 1: Intent & Business Type

- Single Job: Identify the user's primary financial goal to suppress irrelevant UI modules.

- Single Action: Select one core objective (e.g., "Forecast Cash Flow").

- Mini Aha: On click, instantly shift the background from a generic welcome state to a blurred skeleton layout of their specific goal, with a toast saying: "Configured your workspace for Cash Flow Forecasting. We've hidden everything else."

Screen 2: Frictionless Data Connection

- Single Job: Ingest financial data into FinWise as fast as possible using sample data for speed.

- Single Action: Click "Explore with Pre-filled Sample Data".

- Mini Aha: Show a rapid-fire live tally during a brief loading state: "Syncing... 1,402 transactions imported. 1,350 auto-categorized."

Screen 3: Key Driver Setup

- Single Job: Set a baseline operational parameter so the generated forecast is contextualized.

- Single Action: Confirm or adjust a single estimated monthly expense slider (e.g., "Estimated Monthly Overhead").

- Mini Aha: As the slider moves, dynamically update a text element next to it: "At this rate, your business needs to generate $X/day to break even."

Screen 4: The "Aha!" Runway Dashboard

- Single Job: Deliver immediate visual clarity on 30/60/90-day projected cash positions.

- Single Action: Toggle a scenario slider (e.g., "What if revenue drops 10%?") to see the live chart update instantly.

- Mini Aha: Display a natural-language insight box that updates with the slider: "Warning: A 10% revenue drop causes a shortfall by Week 6. Recommendation: Reduce software spend."

Design notes:

- Must be a fully interactive, clickable prototype. Ensure all buttons, sliders, and toggles actually trigger state changes and successfully route to the next screen. Static, non-functional layouts are not acceptable.

- Show one thing per screen that delivers immediate value.

- Pre-fill or skip anything that isn't essential to reach Aha.

- Modern, clean SaaS UI. Mobile-friendly. Use realistic FinWise sample data.

- Make it navigable so I can click through the full flow.

[DESIGN & INTERACTION CONSTRAINTS] 1. Visual Aesthetic: Strict Apple-esque design language. This must look premium, sleek, and minimalist. * Typography: Reliance on SF Pro/San Francisco or a closely matching clean sans-serif typeface (Inter). * Palette: Monochromatic (White and various shades of Gray) with classic Apple Blue (#007AFF) for all interactive buttons and sliders. * Icons: Line-based, minimalist, SF Symbols style. * Spacing: Generous, precise use of negative space for maximum focus. * Materials: Subtle use of background blur (frosted glass) effects on overlay cards. * Functional Color: Reserved strictly for Screen 4 (Green for healthy, Yellow for at-risk, Red for shortfall), but integrated into the sleek aesthetic, not jarring. 2. Full Interactivity Required: All buttons, options, sliders, and navigation links must trigger actual UI state changes, chart updates, or route to the next screen. Static, unclickable layouts are not acceptable. 3. Friction Reduction: Pre-fill all fields and allow skips wherever non-essential. Before generating any code, ask me any clarifying questions if needed to clarify requirements. Otherwise, proceed directly to building the interactive prototype.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://runway-reveal-prototype.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/fed31957-ae95-4205-adb1-451d9651d807).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
