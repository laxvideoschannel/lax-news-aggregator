# Next Task

## Current objective
Generalize the site from a PLL/WLL-only experience into a broader hub structure without breaking current functionality.

## Immediate task
Refactor the content model and top-level messaging so college content can be added cleanly.

## Why this matters
The current site already supports:
- official pro video feeds
- custom videos
- schedules
- team pages
- merch links

But the current structure is too tied to PLL/WLL-specific assumptions. College should be the next expansion, and training should come after that. We need a cleaner shared model first.

## Requirements
- keep current PLL/WLL flows working
- reduce homepage/team-shell overemphasis on Carolina Chaos
- prepare for college support without shipping a giant college portal yet
- do not add training yet unless needed for data-model design

## Acceptance criteria
- the top-level site language is hub-first, not single-team-first
- data/types are ready for adding college teams/schools/events
- no existing video/admin routes are broken
- docs are updated after implementation

## Out of scope
- full training marketplace
- full NCAA scoreboard clone
- custom commerce system
- live sync for every team or school
