# Content Model

## Goal
Support pro + college first, then training, using reusable entities.

## Core entities

### League
Represents a league or top-level competition group.

Suggested examples:
- PLL
- WLL
- NCAA Men
- NCAA Women
- Custom

Possible fields:
- id
- name
- type
- gender
- level
- officialSiteUrl

---

### Team
Represents a professional team.

Current examples already exist for PLL/WLL.

Possible fields:
- id
- name
- city
- fullName
- shortName
- leagueId
- colors
- conference
- logo
- officialSiteUrl
- officialShopUrl

---

### School
Represents a college/university program container.

Possible fields:
- id
- name
- slug
- division
- conference
- gender
- officialSiteUrl
- officialShopUrl
- logo
- colors

---

### Video
Represents any watchable content item.

Current sources:
- official YouTube feed items
- custom admin-added YouTube entries

Possible fields:
- id
- title
- youtubeUrl
- embedUrl
- thumbnailUrl
- sourceType
- sourceName
- leagueId
- teamId
- schoolId
- playerId
- eventId
- publishedAt
- description
- featured

---

### Event
Represents a game or training event.

Possible fields:
- id
- title
- slug
- type (`game` | `training`)
- leagueId
- teamId
- schoolId
- providerId
- startTime
- endTime
- location
- externalUrl
- ticketUrl
- watchUrl
- status

---

### Provider
Represents a training provider, coach, club, or organizer.

Possible fields:
- id
- name
- slug
- type
- location
- websiteUrl
- contactUrl
- logo
- description
- specialties
- ageGroups

---

### MerchLink
Represents outbound merch destinations.

Possible fields:
- id
- label
- url
- teamId
- schoolId
- leagueId
- providerId
- official
- affiliate

## Current implementation notes
- current `VideoLeague` type is `PLL | WLL | CUSTOM`
- current team model is pro-team-centric
- school/provider/event abstractions do not yet exist as first-class types

## Migration direction
1. keep current types working
2. add broader shared entity types
3. adapt pages gradually
4. only then add college data
5. only then add training data
