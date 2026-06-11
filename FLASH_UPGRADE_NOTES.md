# Flash Group Website Upgrade Notes

## What changed
- Rebuilt the home hero from destination-led messaging to group-led corporate messaging.
- Replaced “THE EMPIRE HQ” with “Crafting Hospitality Since 1985”.
- Added a portfolio-driven hero switcher: Flash Group, Cruises, Hospitality, Mobility.
- Added `GroupPortfolio.tsx` to present Flash Group as an integrated ecosystem.
- Added `LegacyTimeline.tsx` to show the 1985–2026 corporate evolution.
- Reordered the homepage so Global Infrastructure appears earlier for stronger B2B impact.
- Updated Navbar language from tourism-style navigation to corporate navigation:
  - The Group
  - Portfolio
  - Enterprise Solutions
  - Global Operations
- Updated Contact hero to “Partner With Flash Group”.
- Adjusted stats wording to feel more credible and corporate.

## Important
This package excludes `node_modules` and `.next`. Run:

```bash
npm install
npm run dev
```

Build could not be completed inside this environment because Next.js attempted to download the Linux SWC binary and the container blocks that registry call. TypeScript check passed with:

```bash
./node_modules/.bin/tsc --noEmit
```
