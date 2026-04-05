import type { TeamPageContent } from './team-content';

function buildRoster(
  positions: Record<string, string[]>,
  defaultHighlight: string,
  customHighlights: Record<string, string> = {},
) {
  return Object.entries(positions).flatMap(([pos, names]) =>
    names.map((name) => ({
      name,
      pos,
      highlight: customHighlights[name] ?? defaultHighlight,
    })),
  );
}

export const WLL_TEAM_PAGE_CONTENT: Record<string, TeamPageContent> = {
  guard: {
    titleTag: 'Defending WLL Champions',
    seasonNote: '2026 WLL Championship Series contender built around Charlotte North, two-way midfield depth, and a title-tested core.',
    championships: '1',
    rosterSize: '13',
    founded: '2025',
    roster: buildRoster(
      {
        A: ['Andie Aldave', 'Charlotte North', 'Jackie Wolak'],
        M: ['Madison Ahern', 'Dempsey Arsenault', 'Kasey Choma', 'Hannah Dorney', 'Cassidy Weeks'],
        D: ['Maddie Burns', 'Kaylee Dyer', 'Brittany Read', 'Courtney Taylor'],
        G: ['Rachel Hall'],
      },
      '2026 WLL Championship Series roster',
      {
        'Charlotte North': 'Best player on the planet candidate',
        'Cassidy Weeks': 'High-motor two-way midfielder',
        'Rachel Hall': 'Veteran goalie presence',
        'Dempsey Arsenault': 'Transition-driving midfielder',
      },
    ),
    spotlights: [
      {
        name: 'Charlotte North',
        position: 'Attack',
        description: 'Charlotte North remains the face of the Guard attack and one of the biggest stars in the sport. ESPN picked her as a top Golden Stick candidate thanks to the way the new two-point line amplifies her scoring range.',
        quote: 'Boston still has the standard because the Guard have the most feared scorer in the tournament.',
        stats: [
          { label: 'League', value: 'WLL' },
          { label: 'Golden Stick', value: 'Contender' },
          { label: 'Role', value: 'Lead Scorer' },
          { label: 'Team Status', value: 'Defending Champs' },
        ],
      },
      {
        name: 'Cassidy Weeks',
        position: 'Midfield',
        description: 'Cassidy Weeks gives Boston another dynamic engine between the lines, with the type of box-to-box presence that translates naturally to the sixes format.',
        quote: 'The Guard stay dangerous because they can attack from anywhere in the middle of the field.',
        stats: [
          { label: 'Position', value: 'Midfield' },
          { label: 'Style', value: 'Two-Way' },
          { label: 'Series Fit', value: 'High' },
          { label: 'League', value: 'WLL' },
        ],
      },
      {
        name: 'Rachel Hall',
        position: 'Goalie',
        description: 'Rachel Hall anchors the back end for Boston and helps the Guard keep their championship identity intact heading into another Championship Series run.',
        quote: 'Title teams keep their floor high by getting reliable goalie play and organized defense.',
        stats: [
          { label: 'Position', value: 'Goalie' },
          { label: 'Experience', value: 'Veteran' },
          { label: 'League', value: 'WLL' },
          { label: 'Team Status', value: 'Defending Champs' },
        ],
      },
    ],
  },
  palms: {
    titleTag: 'West Coast Playmakers',
    seasonNote: 'The Palms bring elite versatility, goalie star power, and one of the best all-around midfielders in the WLL.',
    championships: '0',
    rosterSize: '13',
    founded: '2025',
    roster: buildRoster(
      {
        A: ['Sam Geiersbach', 'Gabby Rosenzweig', 'Caitlyn Wurzburger'],
        M: ['Sammy Jo Adelsberger', 'Erin Bakes', 'Ally Mastroianni', 'Ellie Masera', 'Jill Smith'],
        D: ['Anna Brandt', 'Emily Nalls', 'Caroline Steele'],
        G: ['Kait Devir', 'Taylor Moreno'],
      },
      '2026 WLL Championship Series roster',
      {
        'Ally Mastroianni': 'ESPN pick as a player who does it all',
        'Taylor Moreno': 'Star goalie and transition starter',
        'Emily Nalls': 'Shutdown defender',
        'Caitlyn Wurzburger': 'Dangerous scoring option',
      },
    ),
    spotlights: [
      {
        name: 'Ally Mastroianni',
        position: 'Midfield',
        description: 'ESPN called Ally Mastroianni the player you want with the game on the line. She runs the field, wins gritty possessions, scores in key moments, and gives California a true tone-setter.',
        quote: 'The Palms can dictate tempo because Mastroianni impacts every phase of a possession.',
        stats: [
          { label: 'League', value: 'WLL' },
          { label: 'Role', value: 'Engine' },
          { label: 'Series Fit', value: 'Elite' },
          { label: 'Style', value: 'Two-Way' },
        ],
      },
      {
        name: 'Taylor Moreno',
        position: 'Goalie',
        description: 'Taylor Moreno is one of the most recognizable goalie names in the WLL field and gives California the kind of backbone that can swing a short-format tournament.',
        quote: 'When the Palms get saves and quick outlets, they become one of the fastest teams in the event.',
        stats: [
          { label: 'Position', value: 'Goalie' },
          { label: 'League', value: 'WLL' },
          { label: 'Strength', value: 'Outlet Game' },
          { label: 'Impact', value: 'High' },
        ],
      },
      {
        name: 'Emily Nalls',
        position: 'Defense',
        description: 'Emily Nalls gives California a physical defender who can survive in space and help the Palms turn stops into transition opportunities.',
        quote: 'California\'s ceiling rises when its defenders can win matchups without needing help.',
        stats: [
          { label: 'Position', value: 'Defense' },
          { label: 'Style', value: 'Physical' },
          { label: 'League', value: 'WLL' },
          { label: 'Unit', value: 'Back Line' },
        ],
      },
    ],
  },
  charm: {
    titleTag: 'Two-Way Threat',
    seasonNote: 'Maryland\'s WLL group leans on all-around athletes, fresh star additions, and high-end passing talent in sixes space.',
    championships: '0',
    rosterSize: '13',
    founded: '2025',
    roster: buildRoster(
      {
        A: ['Sydni Black', 'Aurora Cordingley', 'Ashley Humphrey'],
        M: ['Grace Griffin', 'McKenzie Blake', 'Ally Kennedy', 'Sam Swart'],
        D: ['Abby Bosco', 'Megan Douty', 'Olivia Dirks', 'Kelly Denes'],
        G: ['Paulina DiFatta', 'Caylee Waters'],
      },
      '2026 WLL Championship Series roster',
      {
        'Ally Kennedy': 'Team USA star making WLL debut',
        'Ashley Humphrey': 'Record-setting passer joins the WLL',
        'Caylee Waters': 'Experienced goalie option',
        'Abby Bosco': 'Top defensive stopper',
      },
    ),
    spotlights: [
      {
        name: 'Ally Kennedy',
        position: 'Midfield',
        description: 'ESPN highlighted Ally Kennedy as one of the most intriguing WLL players entering the 2026 series. Her two-way value and international resume make her a huge piece for Maryland in the sixes format.',
        quote: 'Kennedy gives Maryland a true do-everything midfielder who fits sixes almost perfectly.',
        stats: [
          { label: 'League', value: 'WLL' },
          { label: 'Role', value: 'Two-Way Mid' },
          { label: 'Debut', value: '2026' },
          { label: 'Impact', value: 'Immediate' },
        ],
      },
      {
        name: 'Ashley Humphrey',
        position: 'Attack',
        description: 'Ashley Humphrey enters the WLL after setting the NCAA single-season assists record, bringing elite playmaking and vision that can unlock Maryland\'s half-field possessions.',
        quote: 'Few additions raise a team\'s passing ceiling the way Humphrey does.',
        stats: [
          { label: 'League', value: 'WLL' },
          { label: 'Calling Card', value: 'Playmaking' },
          { label: 'Record', value: '90 Assists' },
          { label: 'Role', value: 'Creator' },
        ],
      },
      {
        name: 'Caylee Waters',
        position: 'Goalie',
        description: 'Caylee Waters brings calm, experienced goalie play to Maryland and gives the Charm a chance to steal momentum swings during short sixes runs.',
        quote: 'In this format, a timely goalie stretch can change an entire weekend.',
        stats: [
          { label: 'Position', value: 'Goalie' },
          { label: 'League', value: 'WLL' },
          { label: 'Strength', value: 'Poise' },
          { label: 'Unit', value: 'Charm Defense' },
        ],
      },
    ],
  },
  charging: {
    titleTag: 'Loaded With Finishers',
    seasonNote: 'New York enters with elite scorers, a dangerous two-point shooting profile, and one of the strongest goalie duos in the event.',
    championships: '0',
    rosterSize: '13',
    founded: '2025',
    roster: buildRoster(
      {
        A: ['Meg Carney', 'Erin Coykendall', 'Izzy Scane', 'Grace Fujinaga'],
        M: ['Lauren Gilbert', 'Emily Hawryschuk', 'Samantha Smith', 'Chase Boyle'],
        D: ['Kendall Halpern', 'Katie Goodale', 'Emerson Bohlig'],
        G: ['Madison Doucette', 'Molly Laliberty'],
      },
      '2026 WLL Championship Series roster',
      {
        'Emily Hawryschuk': 'Reigning Golden Stick winner',
        'Izzy Scane': 'ESPN Golden Stick favorite',
        'Madison Doucette': 'Part of elite goalie duo',
        'Meg Carney': 'Two-point shooting threat',
      },
    ),
    spotlights: [
      {
        name: 'Emily Hawryschuk',
        position: 'Midfield',
        description: 'Emily Hawryschuk returns to New York after winning last season\'s Golden Stick, giving the Charging a proven star who already knows how to dominate this format.',
        quote: 'The Charging always have game-breaking range when Hawryschuk is on the floor.',
        stats: [
          { label: 'League', value: 'WLL' },
          { label: 'Golden Stick', value: 'Winner' },
          { label: 'Style', value: 'Range Scorer' },
          { label: 'Impact', value: 'Elite' },
        ],
      },
      {
        name: 'Izzy Scane',
        position: 'Attack',
        description: 'ESPN identified Izzy Scane as a Golden Stick favorite for 2026, and New York\'s offense is built to put the ball in her hands in space and let her finish.',
        quote: 'If New York gets enough touches for Scane, the Charging can score in waves.',
        stats: [
          { label: 'League', value: 'WLL' },
          { label: 'Golden Stick', value: 'Favorite' },
          { label: 'Role', value: 'Primary Scorer' },
          { label: 'Series Fit', value: 'Elite' },
        ],
      },
      {
        name: 'Madison Doucette',
        position: 'Goalie',
        description: 'Madison Doucette headlines a goalie duo ESPN called one of New York\'s biggest strengths, capable of flipping momentum in an instant.',
        quote: 'Goalie play is a separator in sixes, and Doucette gives New York real winning equity.',
        stats: [
          { label: 'Position', value: 'Goalie' },
          { label: 'League', value: 'WLL' },
          { label: 'Strength', value: 'Momentum Swings' },
          { label: 'Unit', value: 'Goalie Duo' },
        ],
      },
    ],
  },
};
