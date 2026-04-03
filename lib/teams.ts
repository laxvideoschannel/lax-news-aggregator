export interface Team {
  id: string;
  name: string;
  city: string;
  full: string;
  primary: string;
  secondary: string;
  accent: string;
  conference: 'Eastern' | 'Western';
  logo: string; // emoji fallback
}

export const PLL_TEAMS: Team[] = [
  // Western
  { id: 'chaos', name: 'Chaos', city: 'Carolina', full: 'Carolina Chaos', primary: '#CC0000', secondary: '#000000', accent: '#FFFFFF', conference: 'Western', logo: '🔴' },
  { id: 'archers', name: 'Archers', city: 'Utah', full: 'Utah Archers', primary: '#1B3A6B', secondary: '#C8A951', accent: '#FFFFFF', conference: 'Western', logo: '🏹' },
  { id: 'outlaws', name: 'Outlaws', city: 'Denver', full: 'Denver Outlaws', primary: '#002868', secondary: '#BF0A30', accent: '#FFFFFF', conference: 'Western', logo: '⭐' },
  { id: 'redwoods', name: 'Redwoods', city: 'California', full: 'California Redwoods', primary: '#8B2500', secondary: '#228B22', accent: '#FFFFFF', conference: 'Western', logo: '🌲' },
  // Eastern
  { id: 'cannons', name: 'Cannons', city: 'Boston', full: 'Boston Cannons', primary: '#002244', secondary: '#C8102E', accent: '#FFFFFF', conference: 'Eastern', logo: '💣' },
  { id: 'whipsnakes', name: 'Whipsnakes', city: 'Maryland', full: 'Maryland Whipsnakes', primary: '#FFD700', secondary: '#000000', accent: '#FFFFFF', conference: 'Eastern', logo: '🐍' },
  { id: 'atlas', name: 'Atlas', city: 'New York', full: 'New York Atlas', primary: '#003087', secondary: '#C8102E', accent: '#FFFFFF', conference: 'Eastern', logo: '🗺️' },
  { id: 'waterdogs', name: 'Waterdogs', city: 'Philadelphia', full: 'Philadelphia Waterdogs', primary: '#003087', secondary: '#009A44', accent: '#FFFFFF', conference: 'Eastern', logo: '🐕' },
];

export const DEFAULT_TEAM = PLL_TEAMS[0]; // Carolina Chaos

export function getTeam(id: string): Team {
  return PLL_TEAMS.find(t => t.id === id) ?? DEFAULT_TEAM;
}

// Player spotlight data - seeded with real Chaos players
export interface PlayerSpotlight {
  name: string;
  number: string;
  position: string;
  hometown: string;
  college: string;
  teamId: string;
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
    stats: [
      { label: 'All-Star Selections', value: '3x' },
      { label: 'Position', value: 'Close D' },
      { label: 'Conference', value: 'Western' },
      { label: 'Season', value: '2025' },
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
    stats: [
      { label: 'All-Star', value: '2024' },
      { label: 'Specialty', value: 'LH Attackmen' },
      { label: 'Style', value: 'World-Class' },
      { label: 'Conference', value: 'Western' },
    ],
    quote: 'Defense wins championships. That\'s the identity we carry every single game.',
    accolades: ['2024 PLL All-Star', '2021 PLL Champion', 'Elite left-hand specialist defender'],
    description: 'World-class defensive prowess on left-handed attackmen makes Neumann one of the most valuable defenders in the PLL.',
  },
];
