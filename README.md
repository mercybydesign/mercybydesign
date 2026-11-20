# MercyByDesign — Interactive Studies in Islamic Wisdom

**Mission:** Demonstrate through transparent, interactive simulations how the principles Allah prescribed in Islam benefit **individuals, families, communities, and society as a whole**—designed to be welcoming, credible, and clear for both Muslims and non-Muslims.

## Design System
- **Theme:** Warm Light Editorial (inspired by *The Pudding*, *Stripe Press*, and *Our World in Data*)
- **Palette:** Warm ivory paper (`#faf7f2`), deep charcoal ink (`#1c1b18`), forest green (`#1b4332`), antique brass (`#9a7432`), terracotta (`#b54534`)
- **Typography:** `Newsreader` (editorial serif for headlines & verses), `DM Sans` (body/UI), `JetBrains Mono` (tabular numbers)
- **Logo:** Geometric 8-pointed *Rub el Hizb* SVG mark (`public/favicon.svg` & `src/components/Logo.jsx`)

## Live Modules (All 6 Sections + Community Pages)
- **Overview** (`src/components/HomePage.jsx`): Editorial hero, 4-level impact strip (Individual, Family, Community, Society), and full platform blueprint.
- **01. Salah** (`src/components/SalahModule.jsx`): 24-hour stress & cortisol recovery curve comparing an unbroken modern workday against 5 daily prayer resets (*Fajr, Dhuhr, Asr, Maghrib, Isha*).
- **02. Zakat** (`src/simulation/zakatEngine.js`, `src/components/HumanVisuals.jsx`, `src/components/PersonalZakat.jsx`, `src/components/WisdomBanner.jsx`, `src/components/Charts.jsx`):
  - Classical Fiqh al-Zakah engine using the **85g Gold Nisab** standard, **Hawl** (1 year), **2.5%** on net zakatable wealth, inflation/CPI modeling, and *Asnaf* cascade redistribution.
  - Multi-region scope: **Entire World**, **United States**, **United Kingdom**, **India**, **Indonesia**.
  - 4 focused sub-tabs: *Visual Impact (100 Human Silhouettes + Flow)*, *What Does My Zakat Do?*, *Zakat vs. 5% Income Tax*, and *Economic Charts & Fiqh Rules*.
- **03. Sawm** (`src/components/SawmModule.jsx`): 0–18 hour daily fast metabolic progression and 30-day Ramadan habit/empathy tracker.
- **04. No Riba** (`src/components/RibaModule.jsx`): Compound interest (*Riba*) vs. *Qard Hasan* (0% + hardship respite per Qur'an 2:280).
- **05. Waqf** (`src/components/WaqfModule.jsx`): 10–100 year generational perpetual endowment compounder.
- **06. Community** (`src/components/CommunityModule.jsx`): 20-household *Silat al-Rahim* & neighbor-rights mutual-aid network graph.
- **Ideas & Voting** (`src/components/IdeasPage.jsx`): Community roadmap where visitors upvote and submit new simulator ideas (currently persisted in `localStorage`; ready for Supabase/Firebase).
- **About & Contact** (`src/components/AboutPage.jsx`): Mission, creator bio, and contact form.

## Local Development & Deployment
```powershell
npm install
npm run dev       # http://localhost:5173
npm run build     # Outputs production bundle to dist/
```

### Deploying to Vercel
```powershell
vercel login
vercel --prod
```
Then attach `mercybydesign.org` (and redirect `mercybydesign.com`) in **Vercel Dashboard → Project Settings → Domains**.
