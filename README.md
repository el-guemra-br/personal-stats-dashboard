# Personal Stats Dashboard

> 📊 A production-ready Portfolio Analytics Hub built with **Next.js App Router** + **TypeScript** + **Tailwind CSS 4** + **Recharts**.
>
> Display your GitHub presence, coding activity, and social influence in a beautiful, shareable dashboard. Multi-user capable, beginner-friendly, and fully open-source.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green)](./LICENSE)

## ✨ Features

- **GitHub Analytics**: Repositories, followers, top starred repos, contribution trends, language breakdown, recent activity, streak counter
- **WakaTime Integration** (optional): Coding hours, streak, productive day, language mix, daily charts
- **Social Aggregation**: GitHub + optional Twitter + optional LinkedIn follower counts
- **Portfolio Metrics**: Total projects, estimated LOC, most used language, average repo size
- **Growth Insights**: Contribution trends, repository growth, month-over-month comparisons
- **Public Sharing**: Download as PNG, copy shareable UTM links, embed iframe code
- **Smart Caching**: In-memory caching with stale fallback and manual refresh
- **Multi-User Mode**: Any GitHub username can view their stats via query param
- **Beginner-Friendly**: One-click launcher for non-technical users (Windows .bat, npm run local)

## What It Includes

- GitHub analytics: repositories, followers, top starred repos, contribution trends, language breakdown, recent activity, streak.
- WakaTime analytics (optional): coding hours, streak, productive day, language mix, daily chart.
- Social aggregation: GitHub + optional Twitter + optional LinkedIn follower counts.
- Portfolio metrics: total projects, estimated LOC, most used language, average repo size.
- Growth insights: contribution trend, repository growth trend, month-over-month contribution comparison.
- Public sharing tools: download dashboard as PNG, copy UTM share link, iframe embed code.
- Caching strategy: in-memory cache with stale fallback and manual cache clear endpoint.

## Stack

- Next.js 16 (App Router, TypeScript)
- Tailwind CSS 4
- Recharts
- Zod for environment validation
- Vitest for utility tests

## Project Structure

```text
personal-stats-dashboard/
├── app/
│   ├── api/
│   │   ├── cache-clear/route.ts
│   │   ├── github/route.ts
│   │   ├── social/route.ts
│   │   └── wakatime/route.ts
│   ├── components/
│   │   ├── CodingHoursChart.tsx
│   │   ├── ContributionChart.tsx
│   │   ├── Header.tsx
│   │   ├── LanguagesChart.tsx
│   │   ├── LoadingSkeletons.tsx
│   │   ├── RecentActivity.tsx
│   │   ├── RefreshButton.tsx
│   │   ├── RepositoryGrowthChart.tsx
│   │   ├── SharePanel.tsx
│   │   └── StatsCard.tsx
│   ├── lib/
│   │   ├── cache.ts
│   │   ├── dashboard.ts
│   │   ├── env.ts
│   │   ├── formatting.test.ts
│   │   ├── formatting.ts
│   │   ├── github.ts
│   │   ├── social.ts
│   │   ├── types.ts
│   │   ├── utils.ts
│   │   └── wakatime.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── scripts/
│   ├── deploy-vercel.ps1
│   └── deploy-vercel.sh
├── .env.example
├── next.config.ts
├── package.json
└── vitest.config.ts
```

## Setup

## Fast Local Start (Best For Inexperienced Users)

Option A (Windows double-click):

- Double-click Start-Dashboard.bat

Option B (PowerShell):

```powershell
npm run local
```

What this does automatically:

- Installs dependencies if needed
- Creates .env.local from .env.example if missing
- Starts the app
- Opens your browser when server is ready

No GitHub username is required at startup. Users can enter one in the UI.

By default, the app now opens a username prompt screen to avoid showing one person's data to everyone.

1. Install dependencies:

```bash
npm install
```

2. Easiest setup (recommended for beginners):

```bash
npm run setup
```

This asks for your GitHub username and creates/updates `.env.local` automatically.

3. Manual environment setup (if you prefer):

Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

macOS/Linux:

```bash
cp .env.example .env.local
```

4. Fill in at least:

```bash
GITHUB_USERNAME=your-github-username
```

`GITHUB_USERNAME` is now optional if you prefer dynamic mode.
In dynamic mode, any user can open:

```text
http://localhost:3000?username=github-handle
```

or use the username input box directly on the dashboard.

5. Run locally:

```bash
npm run dev
```

6. Open http://localhost:3000.

## First-Time User (No Experience)

1. Install Node.js LTS from nodejs.org.
2. Open the project folder in VS Code.
3. Open Terminal in VS Code.
4. Run `npm run local`.
5. Wait for browser to open automatically.
6. Enter any GitHub username in the app.

Alternative: double-click Start-Dashboard.bat in File Explorer.

If terminal says port `3000` is already in use, open the alternate URL (for example `http://localhost:3001`).

## API Key Setup Guide

### GitHub

Required (one of these):

- `GITHUB_USERNAME`
- or `?username=...` in the URL

Recommended:

- `GITHUB_TOKEN` (GitHub Personal Access Token) for higher rate limits.

Suggested scopes for public data only:

- `public_repo` is typically enough for public repository metadata.

### WakaTime (Optional)

- Add `WAKATIME_API_KEY` from your WakaTime account settings.
- If omitted, dashboard still works and displays WakaTime as inactive.
- Set `WAKATIME_USERNAME` to show your WakaTime handle in the coding-hours section and link to your profile.

### Developer Links

- Set `DEVELOPER_GITHUB_USERNAME` to show your GitHub profile link in the dashboard header.
- Set `DEVELOPER_INSTAGRAM_USERNAME` to show your Instagram profile link in the dashboard header.

### Twitter (Optional)

- Add `TWITTER_USERNAME`.
- Add `TWITTER_BEARER_TOKEN` from Twitter API credentials.

### LinkedIn (Optional)

- LinkedIn public follower API is limited for MVP use-cases.
- Set `LINKEDIN_FOLLOWERS` manually as a numeric env value.

### Cache Clear Security (Optional)

- Set `CACHE_CLEAR_TOKEN` to require `x-refresh-token` header for POST `/api/cache-clear`.

## Cache Strategy

- GitHub: 24h
- WakaTime: 4h
- Social: 48h
- Manual refresh clears in-memory caches and triggers fresh fetch.
- If an API fails and stale cache exists, stale data is served with an outdated badge.

## Scripts

- `npm run local` one-command local launcher for beginners
- `npm run dev` start local dev server
- `npm run lint` run ESLint
- `npm run test` run Vitest tests
- `npm run build` create production build
- `npm run deploy:vercel` deploy to Vercel (requires Vercel CLI auth)

## Vercel Deployment Guide

1. Install and authenticate Vercel CLI:

```bash
npm i -g vercel
vercel login
```

2. Deploy interactively first time:

```bash
vercel
```

3. Set all env vars in Vercel Project Settings.

4. Production deploy:

```bash
npm run deploy:vercel
```

Or run the all-in-one scripts:

- PowerShell: `./scripts/deploy-vercel.ps1`
- Bash: `./scripts/deploy-vercel.sh`

## Customization Guide

1. Change identity text in `.env.local`:
- `DASHBOARD_NAME`
- `DASHBOARD_BIO`
- `DASHBOARD_LOCATION`

2. Change links:
- `PORTFOLIO_URL`
- `LINKEDIN_URL`

3. Add/remove data sources:
- GitHub logic: `app/lib/github.ts`
- WakaTime logic: `app/lib/wakatime.ts`
- Social logic: `app/lib/social.ts`

4. Modify cards/charts layout:
- Main page composition: `app/page.tsx`

## Testing Checklist (Manual QA)

1. Open dashboard on mobile (375px), tablet, desktop.
2. Verify all key metric cards render with no layout overlap.
3. Confirm charts render and resize correctly.
4. Toggle network offline and ensure fallback/error UI appears.
5. Trigger refresh button and confirm new fetch behavior.
6. Verify `/api/github`, `/api/wakatime`, `/api/social` return JSON.
7. Run Lighthouse and confirm performance/accessibility scores.
8. Verify PNG export downloads correctly.
9. Verify share link and iframe embed snippet are valid.

## Performance Checklist

- Dynamic import for chart components (below-the-fold heavy UI).
- Server-side data fetching and ISR-like revalidation behavior.
- In-memory cache to avoid repeated third-party API calls.
- Optimized image loading for GitHub avatar.
- Minimal client-side state outside refresh/export interactions.

## Suggested Next Upgrades

1. Persistent historical storage (Postgres/Redis) for true growth comparisons and follower timelines.
2. Authentication for private repository analytics.
3. Cron-based snapshots and weekly digest email.
4. Team mode: compare multiple profiles on one board.
5. Add OpenTelemetry + error reporting service.
6. Generate dynamic OG images per username.

## Notes

- Total lines of code is an estimate computed from language byte distribution (for public repositories).
- Social trend is estimated in MVP until persistent historical snapshots are available.

## Troubleshooting

- Error: `Attempting to parse an unsupported color function "oklab"`
	This was caused by the old PNG export library and has been fixed by switching to `html-to-image`.
	If you still see it, run:

```bash
rm -rf .next node_modules package-lock.json
npm install
npm run dev
```

Windows PowerShell equivalent:

```powershell
Remove-Item -Recurse -Force .next, node_modules
Remove-Item package-lock.json
npm install
npm run dev
```

## License

This project is open-source and available under the **MIT License**. You're free to use, modify, and distribute this code for personal and commercial projects. See [LICENSE](./LICENSE) for details.

## Contributing

Found a bug or have a feature idea? Open an issue or submit a pull request! Contributions are welcome.

## Built For

This dashboard is designed as a **portfolio showcase project** demonstrating:
- Full-stack Next.js development with modern patterns
- Third-party API integration and rate-limiting strategies
- Performance optimization (ISR, caching, dynamic imports)
- TypeScript best practices and type safety
- Responsive UI design with Tailwind CSS 4
- Accessibility and mobile optimization
- User experience design for both technical and non-technical users

Perfect for developers looking to display their presence, activity, and growth in a professional, interactive format.
