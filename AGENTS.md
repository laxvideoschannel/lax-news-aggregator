# AGENTS.md

## Product identity
LaxHub is a video-first lacrosse hub.

It currently centers on:
- official PLL and WLL YouTube embeds
- official team/shop links
- custom videos stored in Supabase
- schedules, team pages, and news

Planned expansion:
- college lacrosse
- training providers and training events
- more original video and eventually original merch

## Core product rule
Every feature must strengthen at least one of these:
- watch
- follow
- train

If a feature does not clearly support one of those, do not prioritize it.

## Current implementation reality
This codebase is a Next.js 14 App Router app deployed on Vercel and backed by Supabase.

Current major routes:
- /
- /news
- /videos
- /schedule
- /schedule/[slug]
- /team
- /team/[slug]
- /admin

Current backend/data patterns:
- official PLL/WLL YouTube feeds are aggregated
- custom videos are stored in Supabase
- current video league values are PLL, WLL, CUSTOM
- schedules and some team content are still largely hardcoded/static
- team/shop linking exists already

## Important product constraints
- Do not rehost official third-party videos; prefer embeds.
- Do not build a full commerce system yet; keep merch as outbound official links for now.
- Do not turn the site into a generic everything-lacrosse portal.
- College should be added first as:
  - videos
  - teams/schools
  - schedules/events
- Training should be added later as:
  - providers
  - training events
  - outbound inquiry/signup links
- Prefer reusable entity models over new hardcoded sections.

## Current product priorities
1. Make the site feel like a hub, not just a Carolina Chaos-heavy landing page.
2. Generalize the data model so college can fit cleanly.
3. Make video pages and team pages more useful.
4. Add college content without breaking the current PLL/WLL structure.
5. Add training only after the above is stable.

## Engineering rules
- Keep changes minimal and aligned with existing conventions.
- Favor reusable data structures and helper functions over page-specific hacks.
- Keep TypeScript types updated when new entities are added.
- Prefer server-friendly patterns consistent with the current Next.js app router structure.
- Do not delete working admin/video ingestion flows unless replacing them with a better documented equivalent.

## Required docs workflow
Before coding:
- read `docs/build-state.md`
- read `docs/next-task.md`
- read `docs/content-model.md`

After coding:
- update `docs/build-state.md`
- update `docs/next-task.md`
- append a short entry to `docs/codex-log.md`

## Done criteria
A task is not done unless:
- code changes are complete
- loading/empty/error states are handled where relevant
- docs are updated
- changed files are summarized
- assumptions are documented
