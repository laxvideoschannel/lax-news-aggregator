export type CollegeConference = 'ACC' | 'Big Ten' | 'Ivy League' | 'Patriot League' | 'Atlantic Coast';
export type CollegeGameStatus = 'final' | 'upcoming';

export interface CollegeWatchLink {
  label: string;
  href: string;
  type: 'rewatch' | 'highlights' | 'schedule' | 'roster' | 'official';
}

export interface CollegeRosterPlayer {
  name: string;
  number: string;
  position: string;
  classYear: string;
  hometown: string;
  standout: string;
  imagePage?: string;
}

export interface CollegeScheduleGame {
  slug: string;
  dateLabel: string;
  opponent: string;
  opponentSlug?: string;
  location: 'home' | 'away' | 'neutral';
  status: CollegeGameStatus;
  result?: string;
  score?: string;
  broadcast: string;
  venue: string;
  notes: string;
  watchHref: string;
  watchLabel?: string;
}

export interface CollegeTeam {
  slug: string;
  school: string;
  shortName: string;
  nickname: string;
  conference: CollegeConference;
  city: string;
  state: string;
  primary: string;
  secondary: string;
  logoUrl?: string;
  headerImageUrl?: string;
  officialUrl: string;
  scheduleUrl: string;
  rosterUrl: string;
  overview: string;
  recruitingAngle: string;
  strengths: string[];
  record: string;
  ranking?: number;
  watchLinks: CollegeWatchLink[];
  roster: CollegeRosterPlayer[];
  featuredSchedule: CollegeScheduleGame[];
}

export interface CollegeRankingRow {
  rank: number;
  school: string;
  slug?: string;
  conference: CollegeConference;
  record: string;
  note: string;
}

export interface CollegeStandingRow {
  school: string;
  slug?: string;
  overall: string;
  conferenceRecord: string;
  streak: string;
}

export interface CollegeConferenceStanding {
  conference: CollegeConference;
  updatedLabel: string;
  rows: CollegeStandingRow[];
}

export interface FeaturedCollegeGame {
  slug: string;
  dateLabel: string;
  awaySchool: string;
  awaySlug?: string;
  homeSchool: string;
  homeSlug?: string;
  status: CollegeGameStatus;
  score?: string;
  broadcast: string;
  venue: string;
  watchHref: string;
  watchLabel?: string;
  notes: string;
}

export const COLLEGE_TEAMS: CollegeTeam[] = [
  {
    slug: 'duke',
    school: 'Duke',
    shortName: 'DUKE',
    nickname: 'Blue Devils',
    conference: 'ACC',
    city: 'Durham',
    state: 'NC',
    primary: '#003087',
    secondary: '#ffffff',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Duke_Athletics_logo.svg/240px-Duke_Athletics_logo.svg.png',
    headerImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Koskinen_Stadium_at_Duke_University.jpg/1200px-Koskinen_Stadium_at_Duke_University.jpg',
    officialUrl: 'https://goduke.com/sports/mens-lacrosse',
    scheduleUrl: 'https://goduke.com/sports/mens-lacrosse/schedule',
    rosterUrl: 'https://goduke.com/sports/mens-lacrosse/roster',
    overview: 'Duke is one of the flagship brands in college lacrosse, with national-title expectations, high-end recruiting pull, and a steady pipeline of pro-ready talent.',
    recruitingAngle: 'Ideal for building out player profile depth, highlight pages, game recaps, and transfer/recruiting watch coverage.',
    strengths: ['National-title contender profile', 'ACC visibility', 'Strong TV and replay footprint'],
    record: '8-0',
    ranking: 8,
    watchLinks: [
      { label: 'Official Team Page', href: 'https://goduke.com/sports/mens-lacrosse', type: 'official' },
      { label: 'Official Roster', href: 'https://goduke.com/sports/mens-lacrosse/roster', type: 'roster' },
      { label: 'Official Schedule', href: 'https://goduke.com/sports/mens-lacrosse/schedule', type: 'schedule' },
      { label: 'Official Game + Schedule Hub', href: 'https://goduke.com/sports/mens-lacrosse/schedule', type: 'rewatch' },
      { label: 'ACC Network Extra', href: 'https://goduke.com/sports/mens-lacrosse/schedule', type: 'rewatch' },
      { label: 'YouTube Search: Duke Men\'s Lacrosse Highlights', href: 'https://www.youtube.com/results?search_query=duke+men%27s+lacrosse+highlights', type: 'highlights' },
    ],
    roster: [
      { name: 'Aidan Maguire', number: '6', position: 'A', classYear: 'Sr', hometown: 'Glen Head, NY', standout: 'Primary scoring catalyst in settled offense', imagePage: 'https://goduke.com/sports/mens-lacrosse/roster/aidan-maguire/21580' },
      { name: 'Max Sloat', number: '34', position: 'M', classYear: 'Sr', hometown: 'Ambler, PA', standout: 'Two-way midfielder with matchup versatility', imagePage: 'https://goduke.com/sports/mens-lacrosse/roster/max-sloat/21582' },
      { name: 'Patrick Jameison', number: '9', position: 'G', classYear: 'Jr', hometown: 'Haddonfield, NJ', standout: 'Backbone goalie presence in big-game spots', imagePage: 'https://goduke.com/sports/mens-lacrosse/roster/patrick-jameison/23116' },
      { name: 'Andrew McAdorey', number: '1', position: 'A', classYear: 'So', hometown: 'Stony Brook, NY', standout: 'Dynamic dodger and transition threat', imagePage: 'https://goduke.com/sports/mens-lacrosse/roster/andrew-mcadorey/26089' },
    ],
    featuredSchedule: [
      { slug: 'duke-vs-virginia-2026-04-04', dateLabel: 'Apr 4', opponent: 'Virginia', opponentSlug: 'virginia', location: 'home', status: 'final', result: 'L', score: '10-14', broadcast: 'ACCNX', venue: 'Durham, NC', notes: 'Virginia knocked off previously unbeaten Duke.', watchHref: 'https://goduke.com/sports/mens-lacrosse/schedule', watchLabel: 'Official recap' },
      { slug: 'duke-at-syracuse-2026-03-28', dateLabel: 'Mar 28', opponent: 'Syracuse', opponentSlug: 'syracuse', location: 'away', status: 'upcoming', broadcast: 'ESPNU', venue: 'Syracuse, NY', notes: 'Top-10 ACC collision with major ranking impact.', watchHref: 'https://cuse.com/sports/mens-lacrosse/schedule', watchLabel: 'Official game page' },
      { slug: 'duke-vs-denver-2026-03-22', dateLabel: 'Mar 22', opponent: 'Denver', location: 'neutral', status: 'final', result: 'W', score: 'Featured Win', broadcast: 'ESPN+', venue: 'National TV Window', notes: 'Momentum-building resume win before ACC play tightened.', watchHref: 'https://goduke.com/sports/mens-lacrosse/schedule', watchLabel: 'Official recap' },
    ],
  },
  {
    slug: 'syracuse',
    school: 'Syracuse',
    shortName: 'CUSE',
    nickname: 'Orange',
    conference: 'ACC',
    city: 'Syracuse',
    state: 'NY',
    primary: '#f76900',
    secondary: '#0f0f0f',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Syracuse_Orange_logo.svg/240px-Syracuse_Orange_logo.svg.png',
    headerImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Carrier_Dome_2009.jpg/1200px-Carrier_Dome_2009.jpg',
    officialUrl: 'https://cuse.com/',
    scheduleUrl: 'https://cuse.com/sports/mens-lacrosse/schedule',
    rosterUrl: 'https://cuse.com/sports/mens-lacrosse/roster',
    overview: 'Syracuse brings one of the sport\'s most recognizable brands, a huge fan base, and strong weekly story volume across schedule, rankings, and player spotlight coverage.',
    recruitingAngle: 'High-value destination for searchable player pages, poll tracking, and storyline-first coverage around blue-chip prospects and breakout scorers.',
    strengths: ['Legacy fan base', 'High search demand', 'ACC and ESPN visibility'],
    record: '8-2',
    ranking: 2,
    watchLinks: [
      { label: 'Official Team Page', href: 'https://cuse.com/', type: 'official' },
      { label: 'Official Roster', href: 'https://cuse.com/sports/mens-lacrosse/roster', type: 'roster' },
      { label: 'Official Schedule', href: 'https://cuse.com/sports/mens-lacrosse/schedule', type: 'schedule' },
      { label: 'Official Videos', href: 'https://cuse.com/sports/mens-lacrosse', type: 'highlights' },
      { label: 'Official Game + Schedule Hub', href: 'https://cuse.com/sports/mens-lacrosse/schedule', type: 'rewatch' },
      { label: 'YouTube Search: Syracuse Men\'s Lacrosse Highlights', href: 'https://www.youtube.com/results?search_query=syracuse+men%27s+lacrosse+highlights', type: 'highlights' },
    ],
    roster: [
      { name: 'Joey Spallina', number: '22', position: 'A', classYear: 'Jr', hometown: 'Mount Sinai, NY', standout: 'Face-of-the-program attackman and creator', imagePage: 'https://cuse.com/sports/mens-lacrosse/roster/joey-spallina/24013' },
      { name: 'Owen Hiltz', number: '77', position: 'A', classYear: 'Sr', hometown: 'Peterborough, ON', standout: 'Finisher with elite lefty scoring touch', imagePage: 'https://cuse.com/sports/mens-lacrosse/roster/owen-hiltz/24014' },
      { name: 'Jimmy McCool', number: '30', position: 'G', classYear: 'Sr', hometown: 'Redding, CT', standout: 'Veteran goalie stabilizing big possession swings', imagePage: 'https://cuse.com/sports/mens-lacrosse/roster/jimmy-mccool/24941' },
      { name: 'Sam English', number: '44', position: 'M', classYear: 'Jr', hometown: 'Haverford, PA', standout: 'High-volume midfielder driving pace and offense', imagePage: 'https://cuse.com/sports/mens-lacrosse/roster/english-sam/23981' },
    ],
    featuredSchedule: [
      { slug: 'syracuse-vs-georgetown-2026-03-22', dateLabel: 'Mar 22', opponent: 'Georgetown', location: 'home', status: 'final', result: 'W', score: '18-12', broadcast: 'ESPNU', venue: 'Syracuse, NY', notes: 'Statement win that pushed the Orange back into the top-tier conversation.', watchHref: 'https://cuse.com/sports/mens-lacrosse/schedule', watchLabel: 'Official recap' },
      { slug: 'syracuse-vs-duke-2026-03-28', dateLabel: 'Mar 28', opponent: 'Duke', opponentSlug: 'duke', location: 'home', status: 'upcoming', broadcast: 'ESPNU', venue: 'Syracuse, NY', notes: 'Top-10 ACC matchup with seeding implications.', watchHref: 'https://cuse.com/sports/mens-lacrosse/schedule', watchLabel: 'Official game page' },
      { slug: 'syracuse-vs-cornell-2026-03-08', dateLabel: 'Mar 8', opponent: 'Cornell', location: 'neutral', status: 'final', result: 'Featured Rivalry', score: 'In-State Test', broadcast: 'ESPN+', venue: 'Central New York', notes: 'One of the sport\'s strongest regional rivalry data points.', watchHref: 'https://cuse.com/sports/mens-lacrosse/schedule', watchLabel: 'Official recap' },
    ],
  },
  {
    slug: 'notre-dame',
    school: 'Notre Dame',
    shortName: 'ND',
    nickname: 'Fighting Irish',
    conference: 'ACC',
    city: 'Notre Dame',
    state: 'IN',
    primary: '#0c2340',
    secondary: '#c99700',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Notre_Dame_Fighting_Irish_logo.svg/240px-Notre_Dame_Fighting_Irish_logo.svg.png',
    headerImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Notre_Dame_Stadium_2010.jpg/1200px-Notre_Dame_Stadium_2010.jpg',
    officialUrl: 'https://fightingirish.com/sports/mlax/',
    scheduleUrl: 'https://fightingirish.com/sports/mlax/schedule/',
    rosterUrl: 'https://fightingirish.com/sports/mlax/roster/',
    overview: 'Notre Dame is a modern college lacrosse power with title-level relevance, consistent highlights, and strong replay value for both casual fans and serious recruits.',
    recruitingAngle: 'Great candidate for premium recap pages, film-room style highlight hubs, and detailed player development/recruiting narratives.',
    strengths: ['National championship relevance', 'Strong highlight output', 'Deep ACC schedule'],
    record: '6-0',
    ranking: 4,
    watchLinks: [
      { label: 'Official Team Page', href: 'https://fightingirish.com/sports/mlax/', type: 'official' },
      { label: 'Official Roster', href: 'https://fightingirish.com/sports/mlax/roster/', type: 'roster' },
      { label: 'Official Schedule', href: 'https://fightingirish.com/sports/mlax/schedule/', type: 'schedule' },
      { label: 'Official Videos', href: 'https://fightingirish.com/sports/mlax/', type: 'highlights' },
      { label: 'Official Game + Schedule Hub', href: 'https://fightingirish.com/sports/mlax/schedule/', type: 'rewatch' },
      { label: 'YouTube Search: Notre Dame Men\'s Lacrosse Highlights', href: 'https://www.youtube.com/results?search_query=notre+dame+men%27s+lacrosse+highlights', type: 'highlights' },
    ],
    roster: [
      { name: 'Jake Taylor', number: '5', position: 'A', classYear: 'Sr', hometown: 'Calgary, AB', standout: 'Premier finisher inside and around the crease', imagePage: 'https://fightingirish.com/sports/mlax/roster/jake-taylor/21820' },
      { name: 'Chris Kavanagh', number: '14', position: 'A', classYear: 'Sr', hometown: 'Rockville Centre, NY', standout: 'High-level initiator with playoff pedigree', imagePage: 'https://fightingirish.com/sports/mlax/roster/chris-kavanagh/26104' },
      { name: 'Liam Entenmann', number: '21', position: 'G', classYear: 'Sr', hometown: 'Garden City, NY', standout: 'One of the nation\'s most respected goalies' },
      { name: 'Will Donovan', number: '19', position: 'D', classYear: 'Sr', hometown: 'Hingham, MA', standout: 'Anchor defender against top attack units', imagePage: 'https://virginiasports.com/sports/mlax/roster/will-donovan/24559' },
    ],
    featuredSchedule: [
      { slug: 'notre-dame-at-virginia-2026-03-28', dateLabel: 'Mar 28', opponent: 'Virginia', opponentSlug: 'virginia', location: 'away', status: 'final', result: 'L', score: '9-11', broadcast: 'ACCNX', venue: 'Charlottesville, VA', notes: 'Virginia collected a marquee ACC win over the Irish.', watchHref: 'https://virginiasports.com/sports/mlax/schedule/', watchLabel: 'Official recap' },
      { slug: 'notre-dame-vs-marquette-2026-02-14', dateLabel: 'Feb 14', opponent: 'Marquette', location: 'home', status: 'final', result: 'W', score: 'Season Opening Win', broadcast: 'ESPN+', venue: 'South Bend, IN', notes: 'Comfortable opener that set up another national run.', watchHref: 'https://fightingirish.com/sports/mlax/schedule/', watchLabel: 'Official recap' },
      { slug: 'notre-dame-vs-acc-showdown-2026-04-11', dateLabel: 'Apr 11', opponent: 'ACC Rival', location: 'home', status: 'upcoming', broadcast: 'ESPN+', venue: 'South Bend, IN', notes: 'Key conference test in the heart of seeding season.', watchHref: 'https://fightingirish.com/sports/mlax/schedule/', watchLabel: 'Official game page' },
    ],
  },
  {
    slug: 'virginia',
    school: 'Virginia',
    shortName: 'UVA',
    nickname: 'Cavaliers',
    conference: 'ACC',
    city: 'Charlottesville',
    state: 'VA',
    primary: '#232d4b',
    secondary: '#f84c1e',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/UVA_Cavaliers_logo.png/240px-UVA_Cavaliers_logo.png',
    headerImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Scott_Stadium_2007.jpg/1200px-Scott_Stadium_2007.jpg',
    officialUrl: 'https://virginiasports.com/sports/mlax/',
    scheduleUrl: 'https://virginiasports.com/sports/mlax/schedule/',
    rosterUrl: 'https://virginiasports.com/sports/mlax/roster/',
    overview: 'Virginia pairs star-power offenses with strong national interest, making the Cavaliers a high-upside school for stat pages, watch pages, and organic search traffic.',
    recruitingAngle: 'Perfect for searchable prospect boards, matchup hubs, and rewatch pages that organize ESPN/ACCN/FloSports links in one place.',
    strengths: ['High event-level traffic', 'Strong TV and replay demand', 'Recruiting interest from fans and players'],
    record: '6-4',
    watchLinks: [
      { label: 'Official Team Page', href: 'https://virginiasports.com/sports/mlax/', type: 'official' },
      { label: 'Official Roster', href: 'https://virginiasports.com/sports/mlax/roster/', type: 'roster' },
      { label: 'Official Schedule', href: 'https://virginiasports.com/sports/mlax/schedule/', type: 'schedule' },
      { label: 'Official Game + Schedule Hub', href: 'https://virginiasports.com/sports/mlax/schedule/', type: 'rewatch' },
      { label: 'ACC Network Extra', href: 'https://virginiasports.com/sports/mlax/schedule/', type: 'rewatch' },
      { label: 'YouTube Search: Virginia Men\'s Lacrosse Highlights', href: 'https://www.youtube.com/results?search_query=virginia+men%27s+lacrosse+highlights', type: 'highlights' },
    ],
    roster: [
      { name: 'Connor Shellenberger', number: '1', position: 'A', classYear: 'Sr', hometown: 'Charlottesville, VA', standout: 'Elite distributor and face of the offense', imagePage: 'https://virginiasports.com/sports/mlax/roster/connor-shellenberger/21690' },
      { name: 'Payton Cormier', number: '42', position: 'A', classYear: 'Sr', hometown: 'Oakville, ON', standout: 'Power shooter and proven game-breaker', imagePage: 'https://virginiasports.com/sports/mlax/roster/payton-cormier/24557' },
      { name: 'Cole Kastner', number: '15', position: 'D', classYear: 'Sr', hometown: 'Atlanta, GA', standout: 'Premier cover defender in ACC matchups', imagePage: 'https://umterps.com/sports/mens-lacrosse/roster/cole-kastner/24038' },
      { name: 'Matthew Nunes', number: '18', position: 'G', classYear: 'Jr', hometown: 'Smithtown, NY', standout: 'Goaltending stabilizer in transition games', imagePage: 'https://umterps.com/sports/mens-lacrosse/roster/matthew-nunes/26260' },
    ],
    featuredSchedule: [
      { slug: 'virginia-at-duke-2026-04-04', dateLabel: 'Apr 4', opponent: 'Duke', opponentSlug: 'duke', location: 'away', status: 'final', result: 'W', score: '14-10', broadcast: 'ACCNX', venue: 'Durham, NC', notes: 'Best resume win of the spring so far for Virginia.', watchHref: 'https://goduke.com/sports/mens-lacrosse/schedule', watchLabel: 'Official recap' },
      { slug: 'virginia-vs-notre-dame-2026-03-28', dateLabel: 'Mar 28', opponent: 'Notre Dame', opponentSlug: 'notre-dame', location: 'home', status: 'final', result: 'W', score: '11-9', broadcast: 'ACCNX', venue: 'Charlottesville, VA', notes: 'Another major ACC result that kept the Cavaliers in the national picture.', watchHref: 'https://virginiasports.com/sports/mlax/schedule/', watchLabel: 'Official recap' },
      { slug: 'virginia-vs-acc-showdown-2026-04-12', dateLabel: 'Apr 12', opponent: 'ACC Rival', location: 'home', status: 'upcoming', broadcast: 'ESPN+', venue: 'Charlottesville, VA', notes: 'Critical stretch game with postseason implications.', watchHref: 'https://virginiasports.com/sports/mlax/schedule/', watchLabel: 'Official game page' },
    ],
  },
  {
    slug: 'maryland',
    school: 'Maryland',
    shortName: 'UMD',
    nickname: 'Terrapins',
    conference: 'Big Ten',
    city: 'College Park',
    state: 'MD',
    primary: '#e03a3e',
    secondary: '#ffd520',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Maryland_Terrapins_logo.svg/240px-Maryland_Terrapins_logo.svg.png',
    headerImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/SECU_Stadium_Maryland.jpg/1200px-SECU_Stadium_Maryland.jpg',
    officialUrl: 'https://umterps.com/',
    scheduleUrl: 'https://umterps.com/sports/mens-lacrosse/schedule',
    rosterUrl: 'https://umterps.com/sports/mens-lacrosse/roster',
    overview: 'Maryland gives the college side an east-coast anchor program with championship expectations, recruiting gravity, and strong crossover appeal for pro-lacrosse fans.',
    recruitingAngle: 'A strong foundation school for player resume pages, portal movement tracking, and game-by-game stat indexing.',
    strengths: ['Big Ten flagship', 'Strong lacrosse brand equity', 'High-value recruiting audience'],
    record: '4-4',
    watchLinks: [
      { label: 'Official Athletics Site', href: 'https://umterps.com/', type: 'official' },
      { label: 'Roster Page', href: 'https://umterps.com/sports/mens-lacrosse/roster', type: 'roster' },
      { label: 'Schedule Page', href: 'https://umterps.com/sports/mens-lacrosse/schedule', type: 'schedule' },
      { label: 'Official Game + Schedule Hub', href: 'https://umterps.com/sports/mens-lacrosse/schedule', type: 'rewatch' },
      { label: 'Big Ten Plus', href: 'https://umterps.com/sports/mens-lacrosse/schedule', type: 'rewatch' },
      { label: 'YouTube Search: Maryland Men\'s Lacrosse Highlights', href: 'https://www.youtube.com/results?search_query=maryland+men%27s+lacrosse+highlights', type: 'highlights' },
    ],
    roster: [
      { name: 'Daniel Kelly', number: '7', position: 'A', classYear: 'Sr', hometown: 'Davenport, IA', standout: 'Lead scoring option with strong off-ball timing', imagePage: 'https://goprincetontigers.com/sports/mens-lacrosse/roster/daniel-kelly/21853' },
      { name: 'Eric Malever', number: '14', position: 'M', classYear: 'Sr', hometown: 'Timonium, MD', standout: 'Veteran midfielder who settles possessions', imagePage: 'https://goprincetontigers.com/sports/mens-lacrosse/roster/eric-malever/21856' },
      { name: 'AJ Larkin', number: '30', position: 'G', classYear: 'Jr', hometown: 'Huntington, NY', standout: 'Key save-maker when games tighten late', imagePage: 'https://clemsontigers.com/sports/mens-lacrosse/roster/aj-larkin/25192' },
      { name: 'Brett Makar', number: '32', position: 'D', classYear: 'Sr', hometown: 'Yorktown Heights, NY', standout: 'Top-end cover defender against primary dodgers', imagePage: 'https://clemsontigers.com/sports/mens-lacrosse/roster/brett-makar/21852' },
    ],
    featuredSchedule: [
      { slug: 'maryland-vs-ohio-state-2026-04-04', dateLabel: 'Apr 4', opponent: 'Ohio State', location: 'home', status: 'upcoming', broadcast: 'Big Ten Plus', venue: 'College Park, MD', notes: 'Major Big Ten swing game in the conference title race.', watchHref: 'https://umterps.com/sports/mens-lacrosse/schedule', watchLabel: 'Official game page' },
      { slug: 'maryland-at-michigan-2026-03-29', dateLabel: 'Mar 29', opponent: 'Michigan', location: 'away', status: 'final', result: 'W', score: '14-8', broadcast: 'Big Ten Plus', venue: 'Ann Arbor, MI', notes: 'Balanced team performance that kept Maryland in the hunt.', watchHref: 'https://umterps.com/sports/mens-lacrosse/schedule', watchLabel: 'Official recap' },
      { slug: 'maryland-vs-johns-hopkins-2026-04-12', dateLabel: 'Apr 12', opponent: 'Johns Hopkins', location: 'home', status: 'upcoming', broadcast: 'Big Ten Plus', venue: 'College Park, MD', notes: 'Traditional rivalry game with postseason weight.', watchHref: 'https://umterps.com/sports/mens-lacrosse/schedule', watchLabel: 'Official game page' },
    ],
  },
  {
    slug: 'princeton',
    school: 'Princeton',
    shortName: 'PU',
    nickname: 'Tigers',
    conference: 'Ivy League',
    city: 'Princeton',
    state: 'NJ',
    primary: '#f58025',
    secondary: '#111111',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/3/31/Princeton_Tigers_logo.svg/240px-Princeton_Tigers_logo.svg.png',
    headerImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Princeton_University_Jadwin_Gym.jpg/1200px-Princeton_University_Jadwin_Gym.jpg',
    officialUrl: 'https://goprincetontigers.com/sports/mens-lacrosse',
    scheduleUrl: 'https://goprincetontigers.com/sports/mens-lacrosse/schedule',
    rosterUrl: 'https://goprincetontigers.com/sports/mens-lacrosse/roster',
    overview: 'Princeton helps round out the college product with Ivy League relevance, strong academic/recruiting interest, and consistent search demand around roster and schedule pages.',
    recruitingAngle: 'Useful for future prospect pages where academics, conference fit, and film links matter just as much as raw stat totals.',
    strengths: ['Ivy League demand', 'Strong recruiting fit content', 'Nationally relevant schedule'],
    record: '5-2',
    ranking: 3,
    watchLinks: [
      { label: 'Official Team Page', href: 'https://goprincetontigers.com/sports/mens-lacrosse', type: 'official' },
      { label: 'Official Roster', href: 'https://goprincetontigers.com/sports/mens-lacrosse/roster', type: 'roster' },
      { label: 'Official Schedule', href: 'https://goprincetontigers.com/sports/mens-lacrosse/schedule', type: 'schedule' },
      { label: 'Official Game + Schedule Hub', href: 'https://goprincetontigers.com/sports/mens-lacrosse/schedule', type: 'rewatch' },
      { label: 'YouTube Search: Princeton Men\'s Lacrosse Highlights', href: 'https://www.youtube.com/results?search_query=princeton+men%27s+lacrosse+highlights', type: 'highlights' },
    ],
    roster: [
      { name: 'Coulter Mackesy', number: '6', position: 'A', classYear: 'Sr', hometown: 'Bronxville, NY', standout: 'One of the most dangerous scorers in the Ivy League', imagePage: 'https://clemsontigers.com/sports/mens-lacrosse/roster/coulter-mackesy/24578' },
      { name: 'Peter Buonanno', number: '13', position: 'M', classYear: 'Sr', hometown: 'Port Washington, NY', standout: 'Play-driving midfielder in key possessions', imagePage: 'https://bceagles.com/sports/mens-lacrosse/roster/peter-buonanno/21779' },
      { name: 'Nate Kabiri', number: '17', position: 'D', classYear: 'Sr', hometown: 'McLean, VA', standout: 'Reliable defender against top-end initiators', imagePage: 'https://bceagles.com/sports/mens-lacrosse/roster/nate-kabiri/24571' },
      { name: 'Michael Gianforcaro', number: '30', position: 'G', classYear: 'Sr', hometown: 'Summit, NJ', standout: 'Strong stopper with postseason-caliber poise', imagePage: 'https://bceagles.com/sports/mens-lacrosse/roster/michael-gianforcaro/21780' },
    ],
    featuredSchedule: [
      { slug: 'princeton-vs-cornell-2026-03-21', dateLabel: 'Mar 21', opponent: 'Cornell', location: 'home', status: 'final', result: 'Ivy Test', score: 'Key Conference Game', broadcast: 'ESPN+', venue: 'Princeton, NJ', notes: 'High-value Ivy result with direct standings significance.', watchHref: 'https://goprincetontigers.com/sports/mens-lacrosse/schedule', watchLabel: 'Official recap' },
      { slug: 'princeton-vs-harvard-2026-04-05', dateLabel: 'Apr 5', opponent: 'Harvard', location: 'away', status: 'upcoming', broadcast: 'ESPN+', venue: 'Cambridge, MA', notes: 'Potential Ivy title-deciding matchup.', watchHref: 'https://goprincetontigers.com/sports/mens-lacrosse/schedule', watchLabel: 'Official game page' },
      { slug: 'princeton-vs-yale-2026-04-12', dateLabel: 'Apr 12', opponent: 'Yale', location: 'home', status: 'upcoming', broadcast: 'ESPN+', venue: 'Princeton, NJ', notes: 'Another major Ivy challenge with NCAA resume value.', watchHref: 'https://goprincetontigers.com/sports/mens-lacrosse/schedule', watchLabel: 'Official game page' },
    ],
  },
  {
    slug: 'clemson',
    school: 'Clemson',
    shortName: 'CU',
    nickname: 'Tigers',
    conference: 'ACC',
    city: 'Clemson',
    state: 'SC',
    primary: '#F66733',
    secondary: '#522D80',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Clemson_Tigers_logo.svg/240px-Clemson_Tigers_logo.svg.png',
    headerImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Clemson_Memorial_Stadium_2012.jpg/1200px-Clemson_Memorial_Stadium_2012.jpg',
    officialUrl: 'https://clemsontigers.com/sports/mens-lacrosse',
    scheduleUrl: 'https://clemsontigers.com/sports/mens-lacrosse/schedule',
    rosterUrl: 'https://clemsontigers.com/sports/mens-lacrosse/roster',
    overview: 'Clemson lacrosse brings an intense football-school energy to the field — fast-paced, physical, and building a national reputation in the ACC.',
    recruitingAngle: 'Premier athletic environment with ACC visibility and Clemson\'s massive brand.',
    strengths: ['ACC competition', 'Football-school recruiting pull', 'Strong athletic support'],
    record: '6-5',
    watchLinks: [
      { label: 'Official Schedule', href: 'https://clemsontigers.com/sports/mens-lacrosse/schedule', type: 'schedule' },
      { label: 'Roster', href: 'https://clemsontigers.com/sports/mens-lacrosse/roster', type: 'roster' },
      { label: 'ACC Network', href: 'https://www.espn.com/watch/accn', type: 'official' },
    ],
    roster: [
      { name: 'Tyler Carpenter', number: '1', position: 'Attack', classYear: 'Sr', hometown: 'Annapolis, MD', standout: 'Leading scorer and team captain.', imagePage: 'https://nusports.com/sports/womens-lacrosse/roster/tyler-carpenter/21904' },
      { name: 'Brendan Kelly', number: '22', position: 'Midfield', classYear: 'Jr', hometown: 'Severna Park, MD', standout: 'Two-way midfielder with high ground ball output.', imagePage: 'https://nusports.com/sports/womens-lacrosse/roster/brendan-kelly/24579' },
    ],
    featuredSchedule: [
      { slug: 'clemson-vs-duke-2026-03-28', dateLabel: 'Mar 28', opponent: 'Duke', opponentSlug: 'duke', location: 'away', status: 'upcoming', broadcast: 'ACCNX', venue: 'Durham, NC', notes: 'Big ACC test against one of the sport\'s premier programs.', watchHref: 'https://clemsontigers.com/sports/mens-lacrosse/schedule', watchLabel: 'Official game page' },
      { slug: 'clemson-vs-notre-dame-2026-04-04', dateLabel: 'Apr 4', opponent: 'Notre Dame', opponentSlug: 'notre-dame', location: 'home', status: 'upcoming', broadcast: 'ESPN+', venue: 'Clemson, SC', notes: 'Home ACC clash in a building rivalry.', watchHref: 'https://clemsontigers.com/sports/mens-lacrosse/schedule', watchLabel: 'Official game page' },
    ],
  },
  {
    slug: 'boston-college',
    school: 'Boston College',
    shortName: 'BC',
    nickname: 'Eagles',
    conference: 'ACC',
    city: 'Chestnut Hill',
    state: 'MA',
    primary: '#8B0000',
    secondary: '#D4AF37',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Boston_College_Eagles_logo.svg/240px-Boston_College_Eagles_logo.svg.png',
    headerImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Alumni_Stadium_Boston_College.jpg/1200px-Alumni_Stadium_Boston_College.jpg',
    officialUrl: 'https://bceagles.com/sports/womens-lacrosse',
    scheduleUrl: 'https://bceagles.com/sports/womens-lacrosse/schedule',
    rosterUrl: 'https://bceagles.com/sports/womens-lacrosse/roster',
    overview: 'Boston College women\'s lacrosse is one of the ACC\'s most decorated programs — a perennial national contender built on elite recruiting, tactical precision, and a culture that produces WLL pros. Shea Dolce is the centerpiece of this team, a generational midfielder whose vision and athleticism define the Eagles\' style.',
    recruitingAngle: 'Top-tier ACC women\'s program with a pipeline to the professional WLL.',
    strengths: ['National championship contender', 'Elite women\'s program', 'ACC powerhouse', 'WLL pipeline'],
    record: '9-1',
    ranking: 3,
    watchLinks: [
      { label: 'Official Schedule', href: 'https://bceagles.com/sports/womens-lacrosse/schedule', type: 'schedule' },
      { label: 'Roster', href: 'https://bceagles.com/sports/womens-lacrosse/roster', type: 'roster' },
      { label: 'ACC Network', href: 'https://www.espn.com/watch/accn', type: 'official' },
      { label: 'ESPN+', href: 'https://www.espnplus.com', type: 'official' },
    ],
    roster: [
      { name: 'Shea Dolce', number: '14', position: 'Midfield', classYear: 'Sr', hometown: 'Setauket, NY', standout: 'Preseason All-American and the heart of BC\'s offense — one of the best midfielders in the country. Plays with rare poise, vision, and a killer shot from distance. Expected WLL first-round talent.' },
      { name: 'Ally Kennedy', number: '3', position: 'Attack', classYear: 'Jr', hometown: 'Hingham, MA', standout: 'Dynamic attacker and key scoring threat alongside Dolce.', imagePage: 'https://nusports.com/sports/womens-lacrosse/roster/ally-kennedy/24576' },
      { name: 'Cameron Whitlock', number: '7', position: 'Defense', classYear: 'Sr', hometown: 'Fairfield, CT', standout: 'Anchor of the Eagles\' back line, consistent All-ACC consideration.' },
    ],
    featuredSchedule: [
      { slug: 'bc-vs-unc-2026-04-05', dateLabel: 'Apr 5', opponent: 'North Carolina', opponentSlug: 'north-carolina', location: 'away', status: 'upcoming', broadcast: 'ACCNX', venue: 'Chapel Hill, NC', notes: 'Top-5 ACC women\'s clash — Dolce vs the Tar Heel defense.', watchHref: 'https://bceagles.com/sports/womens-lacrosse/schedule', watchLabel: 'Official game page' },
      { slug: 'bc-vs-maryland-2026-03-22', dateLabel: 'Mar 22', opponent: 'Maryland', location: 'home', status: 'final', result: 'W', score: '13-10', broadcast: 'ESPN+', venue: 'Chestnut Hill, MA', notes: 'Dominant win over a ranked opponent behind Dolce\'s 4-goal, 3-assist performance.', watchHref: 'https://bceagles.com/sports/womens-lacrosse/schedule', watchLabel: 'Official recap' },
    ],
  },
  {
    slug: 'northwestern',
    school: 'Northwestern',
    shortName: 'NU',
    nickname: 'Wildcats',
    conference: 'Big Ten',
    city: 'Evanston',
    state: 'IL',
    primary: '#4E2A84',
    secondary: '#B6ACD1',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Northwestern_Wildcats_logo.svg/240px-Northwestern_Wildcats_logo.svg.png',
    headerImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Ryan_Field_Northwestern_2009.jpg/1200px-Ryan_Field_Northwestern_2009.jpg',
    officialUrl: 'https://nusports.com/sports/womens-lacrosse',
    scheduleUrl: 'https://nusports.com/sports/womens-lacrosse/schedule',
    rosterUrl: 'https://nusports.com/sports/womens-lacrosse/roster',
    overview: 'Northwestern women\'s lacrosse is the most decorated program in the country — seven national championships, a pipeline of All-Americans, and a standard that defines what elite looks like. The Wildcats are always in the final four conversation.',
    recruitingAngle: 'The gold standard in women\'s college lacrosse. Seven national titles and counting.',
    strengths: ['Seven national championships', 'Big Ten powerhouse', 'Elite recruiting pipeline', 'Coaching excellence'],
    record: '8-2',
    ranking: 2,
    watchLinks: [
      { label: 'Official Schedule', href: 'https://nusports.com/sports/womens-lacrosse/schedule', type: 'schedule' },
      { label: 'Roster', href: 'https://nusports.com/sports/womens-lacrosse/roster', type: 'roster' },
      { label: 'Big Ten Network', href: 'https://www.btn.com', type: 'official' },
    ],
    roster: [
      { name: 'Izzy Scane', number: '9', position: 'Attack', classYear: 'Sr', hometown: 'Lake Forest, IL', standout: 'Three-time Tewaaraton Award winner — the greatest scorer in women\'s college lacrosse history.' },
      { name: 'Samantha Meeder', number: '22', position: 'Midfield', classYear: 'Jr', hometown: 'Westfield, NJ', standout: 'High-energy two-way midfielder who sets the tone in transition.', imagePage: 'https://nusports.com/sports/womens-lacrosse/roster/samantha-meeder/24580' },
    ],
    featuredSchedule: [
      { slug: 'nu-vs-maryland-2026-04-06', dateLabel: 'Apr 6', opponent: 'Maryland', location: 'home', status: 'upcoming', broadcast: 'BTN', venue: 'Evanston, IL', notes: 'Marquee Big Ten showdown between two national title contenders.', watchHref: 'https://nusports.com/sports/womens-lacrosse/schedule', watchLabel: 'Official game page' },
      { slug: 'nu-vs-ohio-state-2026-03-28', dateLabel: 'Mar 28', opponent: 'Ohio State', location: 'away', status: 'final', result: 'W', score: '16-8', broadcast: 'BTN+', venue: 'Columbus, OH', notes: 'Another dominant road win that underscores NU\'s national caliber.', watchHref: 'https://nusports.com/sports/womens-lacrosse/schedule', watchLabel: 'Official recap' },
    ],
  },
  {
    slug: 'north-carolina',
    school: 'North Carolina',
    shortName: 'UNC',
    nickname: 'Tar Heels',
    conference: 'ACC',
    city: 'Chapel Hill',
    state: 'NC',
    primary: '#56A0D3',
    secondary: '#FFFFFF',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/North_Carolina_Tar_Heels_logo.svg/240px-North_Carolina_Tar_Heels_logo.svg.png',
    headerImageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Kenan_Memorial_Stadium_2014.jpg/1200px-Kenan_Memorial_Stadium_2014.jpg',
    officialUrl: 'https://goheels.com/sports/womens-lacrosse',
    scheduleUrl: 'https://goheels.com/sports/womens-lacrosse/schedule',
    rosterUrl: 'https://goheels.com/sports/womens-lacrosse/roster',
    overview: 'UNC women\'s lacrosse is one of the sport\'s most storied programs — multiple national championships, relentless ACC competition, and a reputation for developing elite offensive talent in the Carolina blue tradition.',
    recruitingAngle: 'Six national championships and a consistent top-5 presence in the national polls.',
    strengths: ['Six national titles', 'Elite ACC competition', 'Premium offensive system', 'WLL pipeline'],
    record: '7-3',
    ranking: 6,
    watchLinks: [
      { label: 'Official Schedule', href: 'https://goheels.com/sports/womens-lacrosse/schedule', type: 'schedule' },
      { label: 'Roster', href: 'https://goheels.com/sports/womens-lacrosse/roster', type: 'roster' },
      { label: 'ACC Network', href: 'https://www.espn.com/watch/accn', type: 'official' },
    ],
    roster: [
      { name: 'Katie Hoeg', number: '6', position: 'Attack', classYear: 'Jr', hometown: 'New Canaan, CT', standout: 'Preseason All-ACC with a relentless shot and exceptional off-ball movement.', imagePage: 'https://goheels.com/sports/womens-lacrosse/roster/katie-hoeg/24581' },
      { name: 'Olivia Dirks', number: '13', position: 'Midfield', classYear: 'Sr', hometown: 'Lutherville, MD', standout: 'Two-way mid who leads the Tar Heels in caused turnovers and ranks top-5 in ACC scoring.', imagePage: 'https://goheels.com/sports/womens-lacrosse/roster/olivia-dirks/21905' },
    ],
    featuredSchedule: [
      { slug: 'unc-vs-bc-2026-04-05', dateLabel: 'Apr 5', opponent: 'Boston College', opponentSlug: 'boston-college', location: 'home', status: 'upcoming', broadcast: 'ACCNX', venue: 'Chapel Hill, NC', notes: 'Top-5 ACC women\'s matchup — massive seeding implications.', watchHref: 'https://goheels.com/sports/womens-lacrosse/schedule', watchLabel: 'Official game page' },
      { slug: 'unc-vs-duke-2026-03-21', dateLabel: 'Mar 21', opponent: 'Duke', opponentSlug: 'duke', location: 'away', status: 'final', result: 'W', score: '11-9', broadcast: 'ACCNX', venue: 'Durham, NC', notes: 'Rivalry win over Duke that solidified UNC\'s top-10 standing.', watchHref: 'https://goheels.com/sports/womens-lacrosse/schedule', watchLabel: 'Official recap' },
    ],
  },
];

export const COLLEGE_RANKINGS: CollegeRankingRow[] = [
  { rank: 1, school: 'Richmond', conference: 'Patriot League', record: '8-0', note: 'Unbeaten and sitting atop the latest RPI snapshot.' },
  { rank: 2, school: 'Syracuse', slug: 'syracuse', conference: 'ACC', record: '8-2', note: 'Strong offense and major non-conference wins.' },
  { rank: 3, school: 'Princeton', slug: 'princeton', conference: 'Ivy League', record: '5-2', note: 'Ivy heavyweight with top-end wins.' },
  { rank: 4, school: 'Notre Dame', slug: 'notre-dame', conference: 'ACC', record: '6-0', note: 'Championship-caliber floor every week.' },
  { rank: 5, school: 'North Carolina', conference: 'ACC', record: '8-1', note: 'High-end talent and a strong spring profile.' },
  { rank: 6, school: 'Johns Hopkins', conference: 'Big Ten', record: '6-2', note: 'Big Ten contender with strong top-line metrics.' },
  { rank: 7, school: 'Harvard', conference: 'Ivy League', record: '8-0', note: 'One of the country\'s best early-season records.' },
  { rank: 8, school: 'Duke', slug: 'duke', conference: 'ACC', record: '8-0', note: 'National contender with premium ACC schedule ahead.' },
  { rank: 9, school: 'Cornell', conference: 'Ivy League', record: '5-2', note: 'Dangerous offense in a loaded Ivy race.' },
  { rank: 10, school: 'Georgetown', conference: 'Patriot League', record: '3-4', note: 'Still dangerous despite a rocky start.' },
];

export const COLLEGE_STANDINGS: CollegeConferenceStanding[] = [
  {
    conference: 'ACC',
    updatedLabel: 'Snapshot board',
    rows: [
      { school: 'North Carolina', overall: '8-1', conferenceRecord: '2-0', streak: 'W4' },
      { school: 'Duke', slug: 'duke', overall: '8-0', conferenceRecord: '1-0', streak: 'W8' },
      { school: 'Syracuse', slug: 'syracuse', overall: '8-2', conferenceRecord: '1-1', streak: 'W2' },
      { school: 'Notre Dame', slug: 'notre-dame', overall: '6-0', conferenceRecord: '1-0', streak: 'W6' },
      { school: 'Virginia', slug: 'virginia', overall: '6-4', conferenceRecord: '1-2', streak: 'W2' },
    ],
  },
  {
    conference: 'Big Ten',
    updatedLabel: 'Featured teams',
    rows: [
      { school: 'Ohio State', overall: '8-2', conferenceRecord: '2-0', streak: 'W3' },
      { school: 'Johns Hopkins', overall: '6-2', conferenceRecord: '1-1', streak: 'W1' },
      { school: 'Maryland', slug: 'maryland', overall: '4-4', conferenceRecord: '1-1', streak: 'W1' },
      { school: 'Michigan', overall: '4-5', conferenceRecord: '0-2', streak: 'L1' },
    ],
  },
  {
    conference: 'Ivy League',
    updatedLabel: 'Featured teams',
    rows: [
      { school: 'Harvard', overall: '8-0', conferenceRecord: '2-0', streak: 'W8' },
      { school: 'Princeton', slug: 'princeton', overall: '5-2', conferenceRecord: '1-1', streak: 'W1' },
      { school: 'Cornell', overall: '5-2', conferenceRecord: '1-1', streak: 'W1' },
      { school: 'Yale', overall: '4-3', conferenceRecord: '1-1', streak: 'W2' },
    ],
  },
];

export const COLLEGE_FEATURED_GAMES: FeaturedCollegeGame[] = [
  {
    slug: 'uva-at-duke-apr-4',
    dateLabel: 'Apr 4',
    awaySchool: 'Virginia',
    awaySlug: 'virginia',
    homeSchool: 'Duke',
    homeSlug: 'duke',
    status: 'final',
    score: '14-10',
    broadcast: 'ACCNX',
    venue: 'Durham, NC',
    watchHref: 'https://goduke.com/sports/mens-lacrosse/schedule',
    watchLabel: 'Official recap',
    notes: 'Virginia handed Duke its first loss in a huge ACC result.',
  },
  {
    slug: 'maryland-vs-ohio-state-apr-4',
    dateLabel: 'Apr 4',
    awaySchool: 'Ohio State',
    homeSchool: 'Maryland',
    homeSlug: 'maryland',
    status: 'upcoming',
    broadcast: 'Big Ten Plus',
    venue: 'College Park, MD',
    watchHref: 'https://umterps.com/sports/mens-lacrosse/schedule',
    watchLabel: 'Official game page',
    notes: 'Big Ten title-race swing game.',
  },
  {
    slug: 'duke-at-syracuse-mar-28',
    dateLabel: 'Mar 28',
    awaySchool: 'Duke',
    awaySlug: 'duke',
    homeSchool: 'Syracuse',
    homeSlug: 'syracuse',
    status: 'upcoming',
    broadcast: 'ESPNU',
    venue: 'Syracuse, NY',
    watchHref: 'https://cuse.com/sports/mens-lacrosse/schedule',
    watchLabel: 'Official game page',
    notes: 'Nationally relevant ACC showdown.',
  },
  {
    slug: 'notre-dame-at-virginia-mar-28',
    dateLabel: 'Mar 28',
    awaySchool: 'Notre Dame',
    awaySlug: 'notre-dame',
    homeSchool: 'Virginia',
    homeSlug: 'virginia',
    status: 'final',
    score: '9-11',
    broadcast: 'ACCNX',
    venue: 'Charlottesville, VA',
    watchHref: 'https://virginiasports.com/sports/mlax/schedule/',
    watchLabel: 'Official recap',
    notes: 'Virginia added a marquee ACC win to its resume.',
  },
  {
    slug: 'princeton-at-harvard-apr-5',
    dateLabel: 'Apr 5',
    awaySchool: 'Princeton',
    awaySlug: 'princeton',
    homeSchool: 'Harvard',
    status: 'upcoming',
    broadcast: 'ESPN+',
    venue: 'Cambridge, MA',
    watchHref: 'https://goprincetontigers.com/sports/mens-lacrosse/schedule',
    watchLabel: 'Official game page',
    notes: 'Potential Ivy title-decider.',
  },
];

export const COLLEGE_CONFERENCES = Array.from(new Set(COLLEGE_TEAMS.map((team) => team.conference)));

export function getCollegeTeam(slug: string) {
  return COLLEGE_TEAMS.find((team) => team.slug === slug);
}
