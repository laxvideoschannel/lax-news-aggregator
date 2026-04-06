export type CollegeConference = 'ACC' | 'Big Ten' | 'Ivy League' | 'Patriot League';
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
      { label: 'ESPN College Lacrosse Hub', href: 'https://www.espn.com/college-sports/lacrosse/', type: 'rewatch' },
      { label: 'ACC Network', href: 'https://www.espn.com/watch/catalog/36d7765d-1be2-46e5-9c17-29621f1f6951/acc-network-extra', type: 'rewatch' },
      { label: 'YouTube Search: Duke Men\'s Lacrosse Highlights', href: 'https://www.youtube.com/results?search_query=duke+men%27s+lacrosse+highlights', type: 'highlights' },
    ],
    roster: [
      { name: 'Aidan Maguire', number: '6', position: 'A', classYear: 'Sr', hometown: 'Glen Head, NY', standout: 'Primary scoring catalyst in settled offense' },
      { name: 'Max Sloat', number: '34', position: 'M', classYear: 'Sr', hometown: 'Ambler, PA', standout: 'Two-way midfielder with matchup versatility' },
      { name: 'Patrick Jameison', number: '9', position: 'G', classYear: 'Jr', hometown: 'Haddonfield, NJ', standout: 'Backbone goalie presence in big-game spots' },
      { name: 'Andrew McAdorey', number: '1', position: 'A', classYear: 'So', hometown: 'Stony Brook, NY', standout: 'Dynamic dodger and transition threat' },
    ],
    featuredSchedule: [
      { slug: 'duke-vs-virginia-2026-04-04', dateLabel: 'Apr 4', opponent: 'Virginia', opponentSlug: 'virginia', location: 'home', status: 'final', result: 'L', score: '10-14', broadcast: 'ACCNX', venue: 'Durham, NC', notes: 'Virginia knocked off previously unbeaten Duke.', watchHref: 'https://www.espn.com/watch/catalog/36d7765d-1be2-46e5-9c17-29621f1f6951/acc-network-extra' },
      { slug: 'duke-at-syracuse-2026-03-28', dateLabel: 'Mar 28', opponent: 'Syracuse', opponentSlug: 'syracuse', location: 'away', status: 'upcoming', broadcast: 'ESPNU', venue: 'Syracuse, NY', notes: 'Top-10 ACC collision with major ranking impact.', watchHref: 'https://www.espn.com/watch/' },
      { slug: 'duke-vs-denver-2026-03-22', dateLabel: 'Mar 22', opponent: 'Denver', location: 'neutral', status: 'final', result: 'W', score: 'Featured Win', broadcast: 'ESPN+', venue: 'National TV Window', notes: 'Momentum-building resume win before ACC play tightened.', watchHref: 'https://www.espn.com/watch/' },
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
      { label: 'Official Videos', href: 'https://cuse.com/', type: 'highlights' },
      { label: 'ESPN College Lacrosse Hub', href: 'https://www.espn.com/college-sports/lacrosse/', type: 'rewatch' },
      { label: 'YouTube Search: Syracuse Men\'s Lacrosse Highlights', href: 'https://www.youtube.com/results?search_query=syracuse+men%27s+lacrosse+highlights', type: 'highlights' },
    ],
    roster: [
      { name: 'Joey Spallina', number: '22', position: 'A', classYear: 'Jr', hometown: 'Mount Sinai, NY', standout: 'Face-of-the-program attackman and creator' },
      { name: 'Owen Hiltz', number: '77', position: 'A', classYear: 'Sr', hometown: 'Peterborough, ON', standout: 'Finisher with elite lefty scoring touch' },
      { name: 'Jimmy McCool', number: '30', position: 'G', classYear: 'Sr', hometown: 'Redding, CT', standout: 'Veteran goalie stabilizing big possession swings' },
      { name: 'Sam English', number: '44', position: 'M', classYear: 'Jr', hometown: 'Haverford, PA', standout: 'High-volume midfielder driving pace and offense' },
    ],
    featuredSchedule: [
      { slug: 'syracuse-vs-georgetown-2026-03-22', dateLabel: 'Mar 22', opponent: 'Georgetown', location: 'home', status: 'final', result: 'W', score: '18-12', broadcast: 'ESPNU', venue: 'Syracuse, NY', notes: 'Statement win that pushed the Orange back into the top-tier conversation.', watchHref: 'https://www.espn.com/watch/' },
      { slug: 'syracuse-vs-duke-2026-03-28', dateLabel: 'Mar 28', opponent: 'Duke', opponentSlug: 'duke', location: 'home', status: 'upcoming', broadcast: 'ESPNU', venue: 'Syracuse, NY', notes: 'Top-10 ACC matchup with seeding implications.', watchHref: 'https://www.espn.com/watch/' },
      { slug: 'syracuse-vs-cornell-2026-03-08', dateLabel: 'Mar 8', opponent: 'Cornell', location: 'neutral', status: 'final', result: 'Featured Rivalry', score: 'In-State Test', broadcast: 'ESPN+', venue: 'Central New York', notes: 'One of the sport\'s strongest regional rivalry data points.', watchHref: 'https://www.espn.com/watch/' },
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
      { label: 'ESPN College Lacrosse Hub', href: 'https://www.espn.com/college-sports/lacrosse/', type: 'rewatch' },
      { label: 'YouTube Search: Notre Dame Men\'s Lacrosse Highlights', href: 'https://www.youtube.com/results?search_query=notre+dame+men%27s+lacrosse+highlights', type: 'highlights' },
    ],
    roster: [
      { name: 'Jake Taylor', number: '5', position: 'A', classYear: 'Sr', hometown: 'Calgary, AB', standout: 'Premier finisher inside and around the crease' },
      { name: 'Chris Kavanagh', number: '14', position: 'A', classYear: 'Sr', hometown: 'Rockville Centre, NY', standout: 'High-level initiator with playoff pedigree' },
      { name: 'Liam Entenmann', number: '21', position: 'G', classYear: 'Sr', hometown: 'Garden City, NY', standout: 'One of the nation\'s most respected goalies' },
      { name: 'Will Donovan', number: '19', position: 'D', classYear: 'Sr', hometown: 'Hingham, MA', standout: 'Anchor defender against top attack units' },
    ],
    featuredSchedule: [
      { slug: 'notre-dame-at-virginia-2026-03-28', dateLabel: 'Mar 28', opponent: 'Virginia', opponentSlug: 'virginia', location: 'away', status: 'final', result: 'L', score: '9-11', broadcast: 'ACCNX', venue: 'Charlottesville, VA', notes: 'Virginia collected a marquee ACC win over the Irish.', watchHref: 'https://www.espn.com/watch/catalog/36d7765d-1be2-46e5-9c17-29621f1f6951/acc-network-extra' },
      { slug: 'notre-dame-vs-marquette-2026-02-14', dateLabel: 'Feb 14', opponent: 'Marquette', location: 'home', status: 'final', result: 'W', score: 'Season Opening Win', broadcast: 'ESPN+', venue: 'South Bend, IN', notes: 'Comfortable opener that set up another national run.', watchHref: 'https://www.espn.com/watch/' },
      { slug: 'notre-dame-vs-acc-showdown-2026-04-11', dateLabel: 'Apr 11', opponent: 'ACC Rival', location: 'home', status: 'upcoming', broadcast: 'ESPN+', venue: 'South Bend, IN', notes: 'Key conference test in the heart of seeding season.', watchHref: 'https://www.espn.com/watch/' },
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
      { label: 'ACC Network', href: 'https://www.espn.com/watch/catalog/36d7765d-1be2-46e5-9c17-29621f1f6951/acc-network-extra', type: 'rewatch' },
      { label: 'ESPN College Lacrosse Hub', href: 'https://www.espn.com/college-sports/lacrosse/', type: 'rewatch' },
      { label: 'YouTube Search: Virginia Men\'s Lacrosse Highlights', href: 'https://www.youtube.com/results?search_query=virginia+men%27s+lacrosse+highlights', type: 'highlights' },
    ],
    roster: [
      { name: 'Connor Shellenberger', number: '1', position: 'A', classYear: 'Sr', hometown: 'Charlottesville, VA', standout: 'Elite distributor and face of the offense' },
      { name: 'Payton Cormier', number: '42', position: 'A', classYear: 'Sr', hometown: 'Oakville, ON', standout: 'Power shooter and proven game-breaker' },
      { name: 'Cole Kastner', number: '15', position: 'D', classYear: 'Sr', hometown: 'Atlanta, GA', standout: 'Premier cover defender in ACC matchups' },
      { name: 'Matthew Nunes', number: '18', position: 'G', classYear: 'Jr', hometown: 'Smithtown, NY', standout: 'Goaltending stabilizer in transition games' },
    ],
    featuredSchedule: [
      { slug: 'virginia-at-duke-2026-04-04', dateLabel: 'Apr 4', opponent: 'Duke', opponentSlug: 'duke', location: 'away', status: 'final', result: 'W', score: '14-10', broadcast: 'ACCNX', venue: 'Durham, NC', notes: 'Best resume win of the spring so far for Virginia.', watchHref: 'https://www.espn.com/watch/catalog/36d7765d-1be2-46e5-9c17-29621f1f6951/acc-network-extra' },
      { slug: 'virginia-vs-notre-dame-2026-03-28', dateLabel: 'Mar 28', opponent: 'Notre Dame', opponentSlug: 'notre-dame', location: 'home', status: 'final', result: 'W', score: '11-9', broadcast: 'ACCNX', venue: 'Charlottesville, VA', notes: 'Another major ACC result that kept the Cavaliers in the national picture.', watchHref: 'https://www.espn.com/watch/catalog/36d7765d-1be2-46e5-9c17-29621f1f6951/acc-network-extra' },
      { slug: 'virginia-vs-acc-showdown-2026-04-12', dateLabel: 'Apr 12', opponent: 'ACC Rival', location: 'home', status: 'upcoming', broadcast: 'ESPN+', venue: 'Charlottesville, VA', notes: 'Critical stretch game with postseason implications.', watchHref: 'https://www.espn.com/watch/' },
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
      { label: 'Big Ten Plus', href: 'https://www.bigtenplus.com/en-int/page/home', type: 'rewatch' },
      { label: 'YouTube Search: Maryland Men\'s Lacrosse Highlights', href: 'https://www.youtube.com/results?search_query=maryland+men%27s+lacrosse+highlights', type: 'highlights' },
    ],
    roster: [
      { name: 'Daniel Kelly', number: '7', position: 'A', classYear: 'Sr', hometown: 'Davenport, IA', standout: 'Lead scoring option with strong off-ball timing' },
      { name: 'Eric Malever', number: '14', position: 'M', classYear: 'Sr', hometown: 'Timonium, MD', standout: 'Veteran midfielder who settles possessions' },
      { name: 'AJ Larkin', number: '30', position: 'G', classYear: 'Jr', hometown: 'Huntington, NY', standout: 'Key save-maker when games tighten late' },
      { name: 'Brett Makar', number: '32', position: 'D', classYear: 'Sr', hometown: 'Yorktown Heights, NY', standout: 'Top-end cover defender against primary dodgers' },
    ],
    featuredSchedule: [
      { slug: 'maryland-vs-ohio-state-2026-04-04', dateLabel: 'Apr 4', opponent: 'Ohio State', location: 'home', status: 'upcoming', broadcast: 'Big Ten Plus', venue: 'College Park, MD', notes: 'Major Big Ten swing game in the conference title race.', watchHref: 'https://www.bigtenplus.com/en-int/page/home' },
      { slug: 'maryland-at-michigan-2026-03-29', dateLabel: 'Mar 29', opponent: 'Michigan', location: 'away', status: 'final', result: 'W', score: '14-8', broadcast: 'Big Ten Plus', venue: 'Ann Arbor, MI', notes: 'Balanced team performance that kept Maryland in the hunt.', watchHref: 'https://www.bigtenplus.com/en-int/page/home' },
      { slug: 'maryland-vs-johns-hopkins-2026-04-12', dateLabel: 'Apr 12', opponent: 'Johns Hopkins', location: 'home', status: 'upcoming', broadcast: 'Big Ten Plus', venue: 'College Park, MD', notes: 'Traditional rivalry game with postseason weight.', watchHref: 'https://www.bigtenplus.com/en-int/page/home' },
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
      { label: 'ESPN College Lacrosse Hub', href: 'https://www.espn.com/college-sports/lacrosse/', type: 'rewatch' },
      { label: 'YouTube Search: Princeton Men\'s Lacrosse Highlights', href: 'https://www.youtube.com/results?search_query=princeton+men%27s+lacrosse+highlights', type: 'highlights' },
    ],
    roster: [
      { name: 'Coulter Mackesy', number: '6', position: 'A', classYear: 'Sr', hometown: 'Bronxville, NY', standout: 'One of the most dangerous scorers in the Ivy League' },
      { name: 'Peter Buonanno', number: '13', position: 'M', classYear: 'Sr', hometown: 'Port Washington, NY', standout: 'Play-driving midfielder in key possessions' },
      { name: 'Nate Kabiri', number: '17', position: 'D', classYear: 'Sr', hometown: 'McLean, VA', standout: 'Reliable defender against top-end initiators' },
      { name: 'Michael Gianforcaro', number: '30', position: 'G', classYear: 'Sr', hometown: 'Summit, NJ', standout: 'Strong stopper with postseason-caliber poise' },
    ],
    featuredSchedule: [
      { slug: 'princeton-vs-cornell-2026-03-21', dateLabel: 'Mar 21', opponent: 'Cornell', location: 'home', status: 'final', result: 'Ivy Test', score: 'Key Conference Game', broadcast: 'ESPN+', venue: 'Princeton, NJ', notes: 'High-value Ivy result with direct standings significance.', watchHref: 'https://www.espn.com/watch/' },
      { slug: 'princeton-vs-harvard-2026-04-05', dateLabel: 'Apr 5', opponent: 'Harvard', location: 'away', status: 'upcoming', broadcast: 'ESPN+', venue: 'Cambridge, MA', notes: 'Potential Ivy title-deciding matchup.', watchHref: 'https://www.espn.com/watch/' },
      { slug: 'princeton-vs-yale-2026-04-12', dateLabel: 'Apr 12', opponent: 'Yale', location: 'home', status: 'upcoming', broadcast: 'ESPN+', venue: 'Princeton, NJ', notes: 'Another major Ivy challenge with NCAA resume value.', watchHref: 'https://www.espn.com/watch/' },
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
    watchHref: 'https://www.espn.com/watch/catalog/36d7765d-1be2-46e5-9c17-29621f1f6951/acc-network-extra',
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
    watchHref: 'https://www.bigtenplus.com/en-int/page/home',
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
    watchHref: 'https://www.espn.com/watch/',
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
    watchHref: 'https://www.espn.com/watch/catalog/36d7765d-1be2-46e5-9c17-29621f1f6951/acc-network-extra',
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
    watchHref: 'https://www.espn.com/watch/',
    notes: 'Potential Ivy title-decider.',
  },
];

export const COLLEGE_CONFERENCES = Array.from(new Set(COLLEGE_TEAMS.map((team) => team.conference)));

export function getCollegeTeam(slug: string) {
  return COLLEGE_TEAMS.find((team) => team.slug === slug);
}
