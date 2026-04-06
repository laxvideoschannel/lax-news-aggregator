# Build State

## Stack
- Framework: Next.js 14 App Router
- Language: TypeScript
- Hosting: Vercel
- Database: Supabase
- External content sources:
  - official PLL YouTube
  - official WLL YouTube
  - custom admin-added YouTube videos
  - official pro and college team / school links
- Styling: app-level CSS / custom styling

## Current routes
- `/`
- `/news`
- `/videos`
- `/college`
- `/college/scoreboard`
- `/college/standings`
- `/college/rankings`
- `/college/teams/[slug]`
- `/schedule`
- `/schedule/[slug]`
- `/team`
- `/team/[slug]`
- `/admin`

## Current API routes
- `/api/videos`
- `/api/news`
- `/api/fetch-news`
- `/api/player-image`
- `/api/player-spotlight`
- `/api/team-gear`
- `/api/admin/login`
- `/api/admin/logout`
- `/api/admin/videos`
- `/api/admin/video-sources`
- `/api/admin/video-sources/import`
- `/api/admin/video-sources/preview`

## Current libraries / data modules
- `lib/videos.ts`
- `lib/teams.ts`
- `lib/team-content.ts`
- `lib/team-merch.ts`
- `lib/schedule.ts`
- `lib/players.ts`
- `lib/wll-content.ts`
- `lib/admin-auth.ts`
- `lib/college.ts`

## What currently works
- homepage hero and quick stats follow the header-selected team (same-tab sync via `lax-team-change`, content from `lib/teams` + `lib/team-content`)
- official PLL and WLL video aggregation
- custom video ingestion via admin endpoint + Supabase
- video library page
- pro schedule section and game recap pages
- pro team listing and player detail pages
- merch/shop linking
- news section with fallback feed behavior
- admin surface for video management
- college landing page
- college school directory with conference filtering
- college school hub pages with roster watch and featured schedule cards
- college scoreboard, standings, and rankings snapshot pages

## Current constraints / technical debt
- league model is still narrow (`PLL | WLL | CUSTOM`) even though college content now exists
- college data is still curated/static, not a live synced feed
- college pages use text-based school marks, not official school logo assets
- training is not yet modeled
- some pro schedule/team content is still hardcoded
- homepage is team-personalizable for copy/stats but the top ticker strip in `layout` is still static Chaos-oriented text
- recruiting flows, player-owned profiles, and coach uploads are still roadmap items

## Current product identity
Right now the app behaves like:
- PLL/WLL media + team hub
- early-stage college lacrosse hub layer
- admin-managed video library

Target identity:
- video-first lacrosse hub for pro + college first
- recruiting layer after college entities are deeper
- training added after the content model is generalized further

## What is missing
- explicit shared school/player/event model across pro and college
- college player profile pages
- college game detail / recap pages
- recruiting profile workflow for players and coaches
- training provider model
- training event model
- better cross-linking between videos, teams, schools, and events
- clearer "why this site exists" messaging on the homepage
- more neutral top-level brand framing

## Last reviewed
- 2026-04-06
