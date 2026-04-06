# Next Task

## Current objective
Deepen the new college layer without disrupting the working PLL, WLL, video, admin, and merch flows.

## Recently completed (context)
Home (`/`) now listens for `lax-team-change` like `/videos` and `/schedule`, and hero/stat blocks pull from the selected team plus `getTeamPageContent` so the page updates in-place when the user picks a new team in the header.

## Immediate task
Build college player profile pages and the first pass of college game detail pages so the new school hubs connect to deeper, searchable destinations.

## Why this matters
The college foundation is now live:
- college landing page
- conference-filtered school directory
- school hub pages
- scoreboard
- standings
- rankings

The next weak point is depth. Right now school pages can introduce programs, but they do not yet branch into dedicated player pages or game-specific destination pages the way a real college lacrosse hub should.

## Requirements
- keep current PLL/WLL flows working
- keep `/videos`, `/admin`, `/team`, and `/schedule` stable
- reuse shared entities and helper patterns where possible
- add college depth without inventing a huge live-data system yet
- prefer official school / broadcast / replay destinations over made-up internal data

## Acceptance criteria
- at least one reusable college player profile route exists
- college school pages can link into player detail pages where data exists
- at least one reusable college game detail route exists
- scoreboard / school schedule cards can link into those game pages where data exists
- docs are updated after implementation

## Out of scope
- full NCAA-wide live stat sync
- full recruiting marketplace
- player self-service editing
- training marketplace
- custom commerce system
