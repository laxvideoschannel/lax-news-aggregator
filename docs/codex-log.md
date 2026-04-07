# Codex Log

Append one entry per completed task.

---

## Template

### Date
YYYY-MM-DD

### Task
Short title of what was implemented.

### Why
Why this task was chosen.

### Files changed
- file/path
- file/path

### What changed
- short bullet
- short bullet
- short bullet

### Assumptions
- assumption
- assumption

### Follow-up
- next likely task
- known issue

---

### Date
2026-04-06

### Task
Homepage hero tiles (championships, stars, record, next game + tickets), remove stats divider, spotlight imagery.

### Why
Align the landing grid with what fans expect (titles, names, record, next matchup with tickets) and drop the duplicate stats bar; add a visual player treatment without rehosting arbitrary images (proxy existing league og images).

### Files changed
- `app/page.tsx`
- `lib/schedule.ts`
- `app/schedule/page.tsx`
- `app/api/player-spotlight/route.ts`
- `docs/build-state.md`
- `docs/next-task.md`
- `docs/codex-log.md`

### What changed
- exported `parseScore`, `getTeamSeasonRecord`, and `getNextUpcomingGameForTeam` from `lib/schedule` (schedule page imports `parseScore`)
- hero four-card grid: titles, roster star names, 2026 W–L from loaded PLL finals, next game card with ticket CTA or league fallback links
- removed the full-width stats strip between hero and spotlight
- spotlight: removed the “AI-POWERED” ribbon, added split color/grayscale photo (`SpotlightPlayerPhoto`) using `/api/player-image` + `imagePage` / team hub fallbacks in the API

### Assumptions
- WLL clubs still use PLL schedule data only where IDs match; record/next-game fallbacks point users to the WLL site
- ticket URLs continue to come from static schedule rows or PLL/WLL hub links

### Follow-up
- optional team-specific ticket deep links per game when available
- richer WLL schedule parity if/when data lands in-repo

---

### Date
2026-04-06

### Task
Homepage team sync and dynamic hero/stats for the selected club.

### Why
The root layout updated theme CSS on team pick, but `/` only listened for the `storage` event (other tabs). Same-tab picks did not refresh React state, so spotlight and copy lagged behind the new colors.

### Files changed
- `app/page.tsx`
- `docs/build-state.md`
- `docs/next-task.md`
- `docs/codex-log.md`

### What changed
- subscribe to `lax-team-change` (and `storage`) so `teamId` stays in sync with the header picker
- drive hero headline, intro copy, hero stat cards, and the stats bar from `getTeam(teamId)` and `getTeamPageContent(teamId)`

### Assumptions
- `TEAM_PAGE_CONTENT` remains the source of per-team narrative stats; unknown ids still fall back like `getTeamPageContent` already does

### Follow-up
- optional: make the layout ticker messages team- or league-aware
- continue planned college player / game detail work per `next-task.md`

---

### Date
2026-04-06

### Task
Ship the first college foundation and reconcile project docs to the new build state.

### Why
The active docs still described the app as a PLL/WLL-only hub even after the new college pages, data model, and sitemap changes had landed.

### Files changed
- `app/college/page.tsx`
- `app/college/teams/[slug]/page.tsx`
- `lib/college.ts`
- `app/sitemap.ts`
- `docs/build-state.md`
- `docs/next-task.md`
- `docs/codex-log.md`

### What changed
- added the first college hub layer with landing, school, scoreboard, standings, and rankings pages
- extended the shared college data model with schools, roster watch entries, featured schedule entries, rankings, and standings
- updated sitemap coverage and cleaned a few visible text issues in the new college pages
- refreshed the docs so the recorded build state and next task match the actual codebase

### Assumptions
- the current college content is a curated foundation, not a live authoritative NCAA data feed
- official school athletics pages and major broadcast hubs are acceptable outbound watch / roster / schedule destinations for this phase

### Follow-up
- build college player profile pages and college game detail pages next
- later unify the broader content model so pro teams, schools, players, and events share more of the same structure
