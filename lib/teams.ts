export interface Team {
  id: string;
  name: string;
  city: string;
  full: string;
  short: string;
  league: 'PLL' | 'WLL';
  group: string;
  primary: string;
  secondary: string;
  accent: string;
  conference: string;
  logo: string; // emoji fallback
}

export const PLL_TEAMS: Team[] = [
  // Eastern
  { id: 'chaos', name: 'Chaos', city: 'Carolina', full: 'Carolina Chaos', short: 'CC', league: 'PLL', group: 'Eastern Conference', primary: '#CC0000', secondary: '#000000', accent: '#FFFFFF', conference: 'Eastern', logo: 'CC' },
  // Western
  { id: 'archers', name: 'Archers', city: 'Utah', full: 'Utah Archers', short: 'UA', league: 'PLL', group: 'Western Conference', primary: '#1B3A6B', secondary: '#C8A951', accent: '#FFFFFF', conference: 'Western', logo: 'UA' },
  { id: 'outlaws', name: 'Outlaws', city: 'Denver', full: 'Denver Outlaws', short: 'DO', league: 'PLL', group: 'Western Conference', primary: '#002868', secondary: '#BF0A30', accent: '#FFFFFF', conference: 'Western', logo: 'DO' },
  { id: 'redwoods', name: 'Redwoods', city: 'California', full: 'California Redwoods', short: 'CR', league: 'PLL', group: 'Western Conference', primary: '#8B2500', secondary: '#228B22', accent: '#FFFFFF', conference: 'Western', logo: 'CR' },
  { id: 'cannons', name: 'Cannons', city: 'Boston', full: 'Boston Cannons', short: 'BC', league: 'PLL', group: 'Eastern Conference', primary: '#0E4D92', secondary: '#C8102E', accent: '#FFFFFF', conference: 'Eastern', logo: 'BC' },
  { id: 'whipsnakes', name: 'Whipsnakes', city: 'Maryland', full: 'Maryland Whipsnakes', short: 'MW', league: 'PLL', group: 'Eastern Conference', primary: '#FFD700', secondary: '#000000', accent: '#FFFFFF', conference: 'Eastern', logo: 'MW' },
  { id: 'atlas', name: 'Atlas', city: 'New York', full: 'New York Atlas', short: 'NY', league: 'PLL', group: 'Eastern Conference', primary: '#003087', secondary: '#C8102E', accent: '#FFFFFF', conference: 'Eastern', logo: 'NY' },
  { id: 'waterdogs', name: 'Waterdogs', city: 'Philadelphia', full: 'Philadelphia Waterdogs', short: 'PW', league: 'PLL', group: 'Eastern Conference', primary: '#003087', secondary: '#009A44', accent: '#FFFFFF', conference: 'Eastern', logo: 'PW' },
];

export const WLL_TEAMS: Team[] = [
  { id: 'guard', name: 'Guard', city: 'Boston', full: 'Boston Guard', short: 'BG', league: 'WLL', group: 'WLL Teams', primary: '#C8102E', secondary: '#003087', accent: '#FFFFFF', conference: 'WLL', logo: 'BG' },
  { id: 'palms', name: 'Palms', city: 'California', full: 'California Palms', short: 'CP', league: 'WLL', group: 'WLL Teams', primary: '#E0B83A', secondary: '#2D7C5A', accent: '#FFFFFF', conference: 'WLL', logo: 'CP' },
  { id: 'charm', name: 'Charm', city: 'Maryland', full: 'Maryland Charm', short: 'MC', league: 'WLL', group: 'WLL Teams', primary: '#9B3F67', secondary: '#F2A7C2', accent: '#FFFFFF', conference: 'WLL', logo: 'MC' },
  { id: 'charging', name: 'Charging', city: 'New York', full: 'New York Charging', short: 'NC', league: 'WLL', group: 'WLL Teams', primary: '#244E9B', secondary: '#B7D9FF', accent: '#FFFFFF', conference: 'WLL', logo: 'NC' },
];

export const DEFAULT_TEAM = PLL_TEAMS[0]; // Carolina Chaos
export const ALL_TEAMS = [...PLL_TEAMS, ...WLL_TEAMS];

export function getTeam(id: string): Team {
  return ALL_TEAMS.find(t => t.id === id) ?? DEFAULT_TEAM;
}

// Player spotlight data - seeded with real Chaos players
export interface PlayerSpotlight {
  name: string;
  number: string;
  position: string;
  hometown: string;
  college: string;
  teamId: string;
  imagePage: string;
  stats: { label: string; value: string }[];
  quote: string;
  accolades: string[];
  description: string;
}

export const CHAOS_SPOTLIGHTS: PlayerSpotlight[] = [
  {
    name: 'Blaze Riorden',
    number: '30',
    position: 'Goalie',
    hometown: 'Fairport, NY',
    college: 'University at Albany',
    teamId: 'chaos',
    imagePage: 'https://premierlacrosseleague.com/articles/blaze-riorden-professional-lacrosses-greatest-playoff-performer',
    stats: [
      { label: 'Save %', value: '59.4%' },
      { label: 'PLL Record Saves', value: '25' },
      { label: 'Goalie of the Year', value: '5x' },
      { label: 'Goals Against / Game', value: '11.0' },
    ],
    quote: 'The strength of the Carolina Chaos has always been our will to win and fierce competitive nature.',
    accolades: ['5x Oren Lyons Goalie of the Year', '2021 Jim Brown MVP', '2021 PLL Champion', 'PLL Single-Game Save Record (25)'],
    description: 'Widely regarded as the greatest goalie of his generation. A once-in-a-generation talent who backstops the best defense in professional lacrosse.',
  },
  {
    name: 'Jack Rowlett',
    number: '4',
    position: 'Close Defense',
    hometown: 'Chesapeake, VA',
    college: 'Duke University',
    teamId: 'chaos',
    imagePage: 'https://premierlacrosseleague.com/articles/how-a-simple-question-inspired-jack-rowletts-love-for-lacrosse',
    stats: [
      { label: 'All-Star Selections', value: '3x' },
      { label: 'Career-High CT', value: '14' },
      { label: 'Conference', value: 'East' },
      { label: 'College', value: 'Duke' },
    ],
    quote: 'Every year we come back hungry. This defense doesn\'t accept anything less than the best.',
    accolades: ['3x PLL All-Star', '2021 PLL Champion', 'Top-rated close defender'],
    description: 'One of the premier close defenders in professional lacrosse. An anchor of the Chaos defensive unit that consistently ranks among the best in the PLL.',
  },
  {
    name: 'Jarrod Neumann',
    number: '22',
    position: 'Close Defense',
    hometown: 'Smithtown, NY',
    college: 'Cornell University',
    teamId: 'chaos',
    imagePage: 'https://premierlacrosseleague.com/articles/jarrod-neumann-records-fastest-shot-in-pll-history',
    stats: [
      { label: 'All-Star', value: '2024' },
      { label: 'Fastest Shot', value: '121 MPH' },
      { label: 'College', value: 'Cornell' },
      { label: 'Conference', value: 'East' },
    ],
    quote: 'Defense wins championships. That\'s the identity we carry every single game.',
    accolades: ['2024 PLL All-Star', '2021 PLL Champion', 'Elite left-hand specialist defender'],
    description: 'World-class defensive prowess on left-handed attackmen makes Neumann one of the most valuable defenders in the PLL.',
  },
];
