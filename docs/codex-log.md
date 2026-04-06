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
