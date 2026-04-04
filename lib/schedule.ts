export type GameStatus = 'final' | 'upcoming';

export type GameScoreBreakdown = {
  label: string;
  away: number;
  home: number;
};

export type GameScorer = {
  player: string;
  teamId: string;
  goals: number;
  assists?: number;
  note?: string;
};

export type GameMediaLink = {
  label: string;
  href: string;
  type: 'highlights' | 'article' | 'rewatch' | 'tickets';
};

export type Game = {
  slug: string;
  dateLabel: string;
  sortDate: string;
  venue: string;
  event: string;
  homeId: string;
  awayId: string;
  time: string;
  broadcast: string;
  status: GameStatus;
  score?: string;
  ticketUrl?: string;
  recapTitle?: string;
  recapSummary?: string;
  scoreByPeriod?: GameScoreBreakdown[];
  topScorers?: GameScorer[];
  media?: GameMediaLink[];
};

const SCHEDULE_TICKETS_URL = 'https://premierlacrosseleague.com/schedule';

export const CHAOS_SCHEDULE_2026: Game[] = [
  {
    slug: '2026-championship-series-final-chaos-vs-redwoods',
    dateLabel: 'Mar 8, Sun',
    sortDate: '2026-03-08',
    venue: 'Washington, D.C.',
    event: 'Championship Series Final',
    homeId: 'chaos',
    awayId: 'redwoods',
    time: '3:00 PM ET',
    broadcast: 'ESPN+',
    status: 'final',
    score: '24-16',
    recapTitle: 'Chaos capture the Championship Series crown',
    recapSummary: 'Carolina closed its Championship Series run with a 24-16 win over California, jumping out to a 7-4 first-quarter lead and taking a 15-7 advantage into halftime before finishing the job.',
    scoreByPeriod: [
      { label: 'Q1', away: 4, home: 7 },
      { label: 'Q2', away: 3, home: 8 },
      { label: '2H', away: 9, home: 9 },
    ],
    topScorers: [
      { player: 'Shane Knobloch', teamId: 'chaos', goals: 6, assists: 1, note: '9 total points' },
      { player: 'Andrew McAdorey', teamId: 'chaos', goals: 5, assists: 1, note: '7 total points' },
      { player: 'Austin Kaut', teamId: 'chaos', goals: 0, assists: 0, note: '20 saves in goal' },
    ],
    media: [
      { label: 'PLL Championship Series Hub', href: 'https://premierlacrosseleague.com/championship-series', type: 'article' },
    ],
  },
  {
    slug: '2026-championship-series-semifinal-chaos-vs-outlaws',
    dateLabel: 'Mar 7, Sat',
    sortDate: '2026-03-07',
    venue: 'Washington, D.C.',
    event: 'Championship Series Semifinal',
    homeId: 'chaos',
    awayId: 'outlaws',
    time: '7:00 PM ET',
    broadcast: 'ESPN+',
    status: 'final',
    score: '23-22',
    recapTitle: 'Chaos edge Outlaws in a one-goal semifinal thriller',
    recapSummary: 'Carolina survived a back-and-forth semifinal and punched its ticket to the Championship Series title game when Cole Williams buried the late winner in a 23-22 victory.',
    topScorers: [
      { player: 'Cole Williams', teamId: 'chaos', goals: 1, assists: 0, note: 'Game-winning goal with 47 seconds left' },
    ],
    media: [
      { label: 'PLL Championship Series Hub', href: 'https://premierlacrosseleague.com/championship-series', type: 'article' },
    ],
  },
  {
    slug: '2026-05-08-atlas-vs-chaos',
    dateLabel: 'May 8, Fri',
    sortDate: '2026-05-08',
    venue: 'Salt Lake City, UT',
    event: 'Archers Homecoming',
    homeId: 'chaos',
    awayId: 'atlas',
    time: '10:30 PM ET',
    broadcast: 'TBD',
    status: 'upcoming',
    ticketUrl: SCHEDULE_TICKETS_URL,
  },
  {
    slug: '2026-06-05-archers-vs-chaos',
    dateLabel: 'Jun 5, Fri',
    sortDate: '2026-06-05',
    venue: 'Charlotte, NC',
    event: 'Chaos Homecoming',
    homeId: 'chaos',
    awayId: 'archers',
    time: '6:00 PM ET',
    broadcast: 'TBD',
    status: 'upcoming',
    ticketUrl: SCHEDULE_TICKETS_URL,
  },
  {
    slug: '2026-06-06-outlaws-vs-chaos',
    dateLabel: 'Jun 6, Sat',
    sortDate: '2026-06-06',
    venue: 'Charlotte, NC',
    event: 'Chaos Homecoming',
    homeId: 'chaos',
    awayId: 'outlaws',
    time: '5:30 PM ET',
    broadcast: 'TBD',
    status: 'upcoming',
    ticketUrl: SCHEDULE_TICKETS_URL,
  },
];

export function getScheduleGame(slug: string) {
  return CHAOS_SCHEDULE_2026.find((game) => game.slug === slug);
}
