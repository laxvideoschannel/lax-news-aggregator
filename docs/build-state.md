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
- Styling: app-level CSS / custom styling

## Current routes
- `/`
- `/news`
- `/videos`
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

## What currently works
- official PLL and WLL video aggregation
- custom video ingestion via admin endpoint + Supabase
- video library page
- schedule section
- team listing and team detail pages
- merch/shop linking
- news section
- admin surface for video management

## Current constraints / technical debt
- league model is still narrow (`PLL | WLL | CUSTOM`)
- college is not yet modeled as a first-class content type
- training is not yet modeled
- some schedule/team content is still hardcoded
- homepage branding/story currently leans too heavily toward Carolina Chaos
- page architecture is stronger for pro teams than for a broader lacrosse hub

## Current product identity
Right now the app behaves like:
- PLL/WLL media + team hub
with some custom video capability

Target identity:
- video-first lacrosse hub for pro + college first
- training added after the content model is generalized

## What is missing
- explicit school/college entity model
- training provider model
- training event model
- better cross-linking between videos, teams, schools, and events
- clearer “why this site exists” messaging on the homepage
- more neutral top-level brand framing

## Last reviewed
- Update this date whenever this file is edited.
