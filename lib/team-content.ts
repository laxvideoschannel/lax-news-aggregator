import { WLL_TEAM_PAGE_CONTENT } from './wll-content';

export type TeamRosterPlayer = {
  slug?: string;
  name: string;
  number?: string;
  pos: string;
  hometown?: string;
  college?: string;
  highlight: string;
  imagePage?: string;
};

export type TeamSpotlight = {
  name: string;
  number?: string;
  position: string;
  hometown?: string;
  college?: string;
  imagePage?: string;
  description: string;
  quote: string;
  stats: { label: string; value: string }[];
};

export type TeamPageContent = {
  titleTag: string;
  seasonNote: string;
  championships: string;
  rosterSize: string;
  founded: string;
  heroImagePage?: string;
  roster: TeamRosterPlayer[];
  spotlights: TeamSpotlight[];
};

export const TEAM_PAGE_CONTENT: Record<string, TeamPageContent> = {
  chaos: {
    titleTag: '2026 PLL Champions',
    seasonNote: '2026 PLL Championship Series Winners - Eastern Conference',
    championships: '2',
    rosterSize: '25',
    founded: '2019',
    heroImagePage: 'https://premierlacrosseleague.com/teams/carolina-chaos',
    roster: [
      { slug: 'blaze-riorden', name: 'Blaze Riorden', number: '30', pos: 'G', hometown: 'Fairport, NY', college: 'Albany', highlight: '5x Goalie of the Year', imagePage: 'https://premierlacrosseleague.com/articles/blaze-riorden-professional-lacrosses-greatest-playoff-performer' },
      { slug: 'jack-rowlett', name: 'Jack Rowlett', number: '4', pos: 'D', hometown: 'Chesapeake, VA', college: 'Duke', highlight: '3x All-Star close defender', imagePage: 'https://premierlacrosseleague.com/articles/how-a-simple-question-inspired-jack-rowletts-love-for-lacrosse' },
      { slug: 'jarrod-neumann', name: 'Jarrod Neumann', number: '22', pos: 'D', hometown: 'Smithtown, NY', college: 'Cornell', highlight: '2024 All-Star', imagePage: 'https://premierlacrosseleague.com/articles/jarrod-neumann-records-fastest-shot-in-pll-history' },
      { slug: 'shane-knobloch', name: 'Shane Knobloch', number: '11', pos: 'A', hometown: 'Charlotte, NC', college: 'Duke', highlight: 'Golden Stick winner', imagePage: 'https://premierlacrosseleague.com/articles/shane-knobloch-breakout-game-carolina-chaos' },
      { slug: 'troy-reh', name: 'Troy Reh', number: '14', pos: 'LSM', hometown: 'Glen Cove, NY', college: 'Albany', highlight: 'Elite long-stick midfielder', imagePage: 'https://premierlacrosseleague.com/articles/how-troy-rehs-off-ball-defense-binds-the-chaos-defense-together' },
    ],
    spotlights: [
      { name: 'Blaze Riorden', number: '30', position: 'Goalie', hometown: 'Fairport, NY', college: 'University at Albany', imagePage: 'https://premierlacrosseleague.com/articles/blaze-riorden-professional-lacrosses-greatest-playoff-performer', description: 'Widely regarded as the greatest goalie of his generation. A once-in-a-generation talent who backstops the best defense in professional lacrosse.', quote: 'The strength of the Carolina Chaos has always been our will to win and fierce competitive nature.', stats: [{ label: 'Save %', value: '59.4%' }, { label: 'Record Saves', value: '25' }, { label: 'GOY', value: '5x' }, { label: 'GAA', value: '11.0' }] },
      { name: 'Jack Rowlett', number: '4', position: 'Close Defense', hometown: 'Chesapeake, VA', college: 'Duke University', imagePage: 'https://premierlacrosseleague.com/articles/how-a-simple-question-inspired-jack-rowletts-love-for-lacrosse', description: 'One of the premier close defenders in professional lacrosse and a foundational piece of the Chaos defensive identity.', quote: 'Every year we come back hungry. This defense does not accept anything less than the best.', stats: [{ label: 'All-Star', value: '3x' }, { label: 'Career-High CT', value: '14' }, { label: 'College', value: 'Duke' }, { label: 'Conference', value: 'East' }] },
      { name: 'Jarrod Neumann', number: '22', position: 'Close Defense', hometown: 'Smithtown, NY', college: 'Cornell University', imagePage: 'https://premierlacrosseleague.com/articles/jarrod-neumann-records-fastest-shot-in-pll-history', description: 'A matchup eraser for the Chaos who brings length, toughness, and disruptive stick work to Carolina’s back line.', quote: 'Defense wins championships. That is the identity we carry every single game.', stats: [{ label: 'All-Star', value: '2024' }, { label: 'Fastest Shot', value: '121 MPH' }, { label: 'College', value: 'Cornell' }, { label: 'Conference', value: 'East' }] },
    ],
  },
  archers: {
    titleTag: 'Reigning Powers',
    seasonNote: 'Loaded with offensive firepower and championship-level balance.',
    championships: '2',
    rosterSize: '25',
    founded: '2019',
    heroImagePage: 'https://premierlacrosseleague.com/teams/utah-archers',
    roster: [
      { name: 'Tom Schreiber', number: '7', pos: 'A', hometown: 'Huntington, NY', college: 'Princeton', highlight: 'All-time great playmaker' },
      { name: 'Grant Ament', number: '10', pos: 'A', hometown: 'Doylestown, PA', college: 'Penn State', highlight: 'Elite distributor at X' },
      { name: 'Connor Fields', number: '8', pos: 'A', hometown: 'East Amherst, NY', college: 'Albany', highlight: 'Dangerous scorer from every angle' },
      { name: 'Brett Dobson', number: '19', pos: 'G', hometown: 'Oshawa, ON', college: 'St. Bonaventure', highlight: 'Reliable presence in cage' },
    ],
    spotlights: [
      { name: 'Tom Schreiber', number: '7', position: 'Attack', hometown: 'Huntington, NY', college: 'Princeton', description: 'Schreiber remains one of the PLL’s smartest and most complete offensive engines, capable of running an entire game from behind the cage or up top.', quote: 'When the ball moves, everybody becomes dangerous.', stats: [{ label: 'All-Star', value: 'Multi' }, { label: 'Position', value: 'Attack' }, { label: 'College', value: 'Princeton' }, { label: 'Conference', value: 'West' }] },
      { name: 'Grant Ament', number: '10', position: 'Attack', hometown: 'Doylestown, PA', college: 'Penn State', description: 'Ament is a pace-setting creator whose vision and feeding ability make the Archers one of the hardest offenses in the league to cover.', quote: 'The more connected we are, the harder we are to guard.', stats: [{ label: 'Role', value: 'Creator' }, { label: 'Position', value: 'Attack' }, { label: 'College', value: 'Penn State' }, { label: 'Conference', value: 'West' }] },
    ],
  },
  outlaws: {
    titleTag: 'High-Octane Offense',
    seasonNote: 'Denver brings shotmaking, star power, and transition pace every week.',
    championships: '1',
    rosterSize: '25',
    founded: '2019',
    heroImagePage: 'https://premierlacrosseleague.com/teams/denver-outlaws',
    roster: [
      { name: 'Lyle Thompson', number: '4', pos: 'A', hometown: 'Onondaga Nation, NY', college: 'Albany', highlight: 'One of the greatest ever' },
      { name: 'Brennan O’Neill', number: '13', pos: 'A', hometown: 'Bay Shore, NY', college: 'Duke', highlight: 'Power dodger and scorer' },
      { name: 'Logan McNaney', number: '29', pos: 'G', hometown: 'Coronado, CA', college: 'Maryland', highlight: 'Calm, poised young goalie' },
      { name: 'Jared Bernhardt', number: '1', pos: 'M', hometown: 'Longwood, FL', college: 'Maryland', highlight: 'Dynamic athlete in space' },
    ],
    spotlights: [
      { name: 'Lyle Thompson', number: '4', position: 'Attack', hometown: 'Onondaga Nation, NY', college: 'Albany', description: 'Few players in the sport can match Thompson’s creativity, touch, and finishing craft around the crease and from the wing.', quote: 'The game gives back when you play it the right way.', stats: [{ label: 'Legacy', value: 'Elite' }, { label: 'Position', value: 'Attack' }, { label: 'College', value: 'Albany' }, { label: 'Conference', value: 'West' }] },
      { name: 'Brennan O’Neill', number: '13', position: 'Attack', hometown: 'Bay Shore, NY', college: 'Duke', description: 'O’Neill brings size, range, and downhill force that make him a nightmare matchup when he gets his hands free.', quote: 'I want every dodge to feel like pressure on the defense.', stats: [{ label: 'Style', value: 'Power' }, { label: 'Position', value: 'Attack' }, { label: 'College', value: 'Duke' }, { label: 'Conference', value: 'West' }] },
    ],
  },
  cannons: {
    titleTag: 'Original Brand, New Edge',
    seasonNote: 'Boston combines legacy, pace, and shot creation with a deep offensive core.',
    championships: '1',
    rosterSize: '25',
    founded: '2019',
    heroImagePage: 'https://premierlacrosseleague.com/teams/boston-cannons',
    roster: [
      { name: 'Asher Nolting', number: '1', pos: 'A', hometown: 'Burlington, ON', college: 'High Point', highlight: 'One of the league’s best initiators' },
      { name: 'Marcus Holman', number: '77', pos: 'A', hometown: 'Baltimore, MD', college: 'North Carolina', highlight: 'Veteran finisher with touch' },
      { name: 'Matt Campbell', number: '5', pos: 'M', hometown: 'Madison, NJ', college: 'Villanova', highlight: 'Creative two-hand threat' },
      { name: 'Dillon Ward', number: '45', pos: 'G', hometown: 'Orangeville, ON', college: 'Bellarmine', highlight: 'Battle-tested goalie' },
    ],
    spotlights: [
      { name: 'Asher Nolting', number: '1', position: 'Attack', hometown: 'Burlington, ON', college: 'High Point', imagePage: 'https://premierlacrosseleague.com/articles/the-evolution-of-asher-nolting-from-playmaker-to-quarterback', description: 'Nolting is a matchup problem because he can bully short sticks, feed through traffic, and still finish like a pure scorer.', quote: 'If you can force a slide, you can open the whole field.', stats: [{ label: 'Role', value: 'Initiator' }, { label: 'Position', value: 'Attack' }, { label: 'College', value: 'High Point' }, { label: 'Conference', value: 'East' }] },
      { name: 'Marcus Holman', number: '77', position: 'Attack', hometown: 'Baltimore, MD', college: 'North Carolina', imagePage: 'https://premierlacrosseleague.com/articles/how-marcus-holmans-off-ball-mastery-fuels-cannons-elite-two-man-game', description: 'Holman remains one of the most polished finishers in the PLL, dangerous off-ball and lethal when he turns the corner.', quote: 'Great offense starts with spacing and trust.', stats: [{ label: 'Role', value: 'Finisher' }, { label: 'Position', value: 'Attack' }, { label: 'College', value: 'UNC' }, { label: 'Conference', value: 'East' }] },
    ],
  },
  whipsnakes: {
    titleTag: 'Built For Big Moments',
    seasonNote: 'Maryland stays dangerous with championship habits and proven closers.',
    championships: '4',
    rosterSize: '25',
    founded: '2019',
    heroImagePage: 'https://premierlacrosseleague.com/teams/maryland-whipsnakes',
    roster: [
      { name: 'Matt Rambo', number: '1', pos: 'A', hometown: 'Berwyn, PA', college: 'Maryland', highlight: 'One of the fiercest finishers alive' },
      { name: 'Zed Williams', number: '6', pos: 'A', hometown: 'Utica, NY', college: 'Virginia', highlight: 'Power and touch around the crease' },
      { name: 'Brad Smith', number: '8', pos: 'M', hometown: 'Oshawa, ON', college: 'Duke', highlight: 'Transition and sixes nightmare' },
      { name: 'Joe Nardella', number: '91', pos: 'FO', hometown: 'Cazenovia, NY', college: 'Rutgers', highlight: 'Faceoff tone-setter' },
    ],
    spotlights: [
      { name: 'Matt Rambo', number: '1', position: 'Attack', hometown: 'Berwyn, PA', college: 'Maryland', description: 'Rambo plays with an edge that defines the Whipsnakes, thriving through contact and scoring in the moments when possessions get ugly.', quote: 'You have to love the dirty goals if you want to win in this league.', stats: [{ label: 'Champion', value: 'Multi' }, { label: 'Position', value: 'Attack' }, { label: 'College', value: 'Maryland' }, { label: 'Conference', value: 'East' }] },
      { name: 'Brad Smith', number: '8', position: 'Midfield', hometown: 'Oshawa, ON', college: 'Duke', description: 'Smith’s speed, versatility, and two-way motor let Maryland stress defenses before they can get set.', quote: 'If we can run, we can control the game.', stats: [{ label: 'Style', value: 'Two-way' }, { label: 'Position', value: 'Midfield' }, { label: 'College', value: 'Duke' }, { label: 'Conference', value: 'East' }] },
    ],
  },
  atlas: {
    titleTag: 'The New York Rise',
    seasonNote: 'New York blends elite creators with game-breaking stars across the field.',
    championships: '1',
    rosterSize: '25',
    founded: '2019',
    heroImagePage: 'https://premierlacrosseleague.com/teams/new-york-atlas',
    roster: [
      { name: 'Jeff Teat', number: '17', pos: 'A', hometown: 'Brampton, ON', college: 'Cornell', highlight: 'Premier quarterback of the offense' },
      { name: 'Connor Shellenberger', number: '11', pos: 'A', hometown: 'Charlottesville, VA', college: 'Virginia', highlight: 'Silky creator and passer' },
      { name: 'Trevor Baptiste', number: '9', pos: 'FO', hometown: 'Dulles, VA', college: 'Denver', highlight: 'Faceoff dominance changes games' },
      { name: 'Jake Carraway', number: '55', pos: 'M', hometown: 'Annapolis, MD', college: 'Georgetown', highlight: 'Stretch shooter and dodger' },
    ],
    spotlights: [
      { name: 'Jeff Teat', number: '17', position: 'Attack', hometown: 'Brampton, ON', college: 'Cornell', description: 'Teat sees the field two passes ahead and punishes late rotations with calm, precise decision-making every possession.', quote: 'Patience creates the windows you are looking for.', stats: [{ label: 'Role', value: 'Quarterback' }, { label: 'Position', value: 'Attack' }, { label: 'College', value: 'Cornell' }, { label: 'Conference', value: 'East' }] },
      { name: 'Connor Shellenberger', number: '11', position: 'Attack', hometown: 'Charlottesville, VA', college: 'Virginia', description: 'Shellenberger’s vision and touch give Atlas another elite feeder who can tilt matchups with subtle changes of pace.', quote: 'The best offense is about making the next read easy.', stats: [{ label: 'Role', value: 'Creator' }, { label: 'Position', value: 'Attack' }, { label: 'College', value: 'Virginia' }, { label: 'Conference', value: 'East' }] },
    ],
  },
  waterdogs: {
    titleTag: 'Built Around Pressure',
    seasonNote: 'Philadelphia thrives on pace, physicality, and turning loose balls into momentum.',
    championships: '0',
    rosterSize: '25',
    founded: '2020',
    heroImagePage: 'https://premierlacrosseleague.com/teams/philadelphia-waterdogs',
    roster: [
      { name: 'Michael Sowers', number: '22', pos: 'A', hometown: 'Upper Dublin, PA', college: 'Duke', highlight: 'Quickest feet in the league' },
      { name: 'Kieran McArdle', number: '15', pos: 'A', hometown: 'Melbourne, AUS', college: 'St. John’s', highlight: 'Savvy veteran scorer' },
      { name: 'Trevor Baptiste', number: '5', pos: 'FO', hometown: 'Aurora, CO', college: 'Denver', highlight: 'Faceoff specialist with game control' },
      { name: 'Ethan Walker', number: '9', pos: 'A', hometown: 'Peterborough, ON', college: 'Denver', highlight: 'Crafty finisher and feeder' },
    ],
    spotlights: [
      { name: 'Michael Sowers', number: '22', position: 'Attack', hometown: 'Upper Dublin, PA', college: 'Duke', description: 'Sowers wins with pace, body control, and the ability to put defenders on skates in tight spaces.', quote: 'If I can get the defense shifting, everything opens up.', stats: [{ label: 'Role', value: 'Dodger' }, { label: 'Position', value: 'Attack' }, { label: 'College', value: 'Duke' }, { label: 'Conference', value: 'East' }] },
      { name: 'Kieran McArdle', number: '15', position: 'Attack', hometown: 'Melbourne, AUS', college: 'St. John’s', description: 'McArdle remains a polished finisher whose feel around the crease gives Philadelphia a steady scoring floor.', quote: 'The best finishers stay calm when the game speeds up.', stats: [{ label: 'Role', value: 'Finisher' }, { label: 'Position', value: 'Attack' }, { label: 'College', value: 'St. John’s' }, { label: 'Conference', value: 'East' }] },
    ],
  },
  redwoods: {
    titleTag: 'West Coast Muscle',
    seasonNote: 'California leans on size, shot power, and physical downhill offense.',
    championships: '0',
    rosterSize: '25',
    founded: '2019',
    heroImagePage: 'https://premierlacrosseleague.com/teams/california-redwoods',
    roster: [
      { name: 'Ryder Garnsey', number: '13', pos: 'A', hometown: 'Denver, CO', college: 'Notre Dame', highlight: 'Creative finisher and feeder' },
      { name: 'Jules Heningburg', number: '10', pos: 'M', hometown: 'West Nyack, NY', college: 'Rutgers', highlight: 'Strong, downhill dodger' },
      { name: 'TD Ierlan', number: '55', pos: 'FO', hometown: 'Victor, NY', college: 'Denver', highlight: 'Faceoff and possession machine' },
      { name: 'Myles Jones', number: '3', pos: 'M', hometown: 'Huntington, NY', college: 'Duke', highlight: 'Explosive dodging midfielder' },
    ],
    spotlights: [
      { name: 'Ryder Garnsey', number: '13', position: 'Attack', hometown: 'Denver, CO', college: 'Notre Dame', description: 'Garnsey’s imagination and release variety make him a dangerous finisher from bad angles and broken plays.', quote: 'Sometimes the best attack move is the one no one expects.', stats: [{ label: 'Role', value: 'Creator' }, { label: 'Position', value: 'Attack' }, { label: 'College', value: 'Notre Dame' }, { label: 'Conference', value: 'West' }] },
      { name: 'TD Ierlan', number: '55', position: 'Faceoff', hometown: 'Victor, NY', college: 'Denver', description: 'Ierlan changes the game before it starts, giving the Redwoods extra possessions and dictating rhythm from the stripe.', quote: 'Possession is a weapon if you stay consistent.', stats: [{ label: 'Role', value: 'Faceoff' }, { label: 'Position', value: 'FO' }, { label: 'College', value: 'Denver' }, { label: 'Conference', value: 'West' }] },
    ],
  },
  ...WLL_TEAM_PAGE_CONTENT,
};

export function getTeamPageContent(teamId: string) {
  return TEAM_PAGE_CONTENT[teamId] || TEAM_PAGE_CONTENT.chaos;
}
