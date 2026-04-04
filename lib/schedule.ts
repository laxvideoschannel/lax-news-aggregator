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
  ticketUrl: string;
  recapTitle?: string;
  recapSummary?: string;
  scoreByPeriod?: GameScoreBreakdown[];
  topScorers?: GameScorer[];
  media?: GameMediaLink[];
};

const SCHEDULE_TICKETS_URL = 'https://premierlacrosseleague.com/schedule';
const CHAMPIONSHIP_TICKETS_URL = 'https://premierlacrosseleague.com/championship-series/tickets';
const ESPN_WATCH_URL = 'https://www.espn.com/watch/';

export const CHAOS_SCHEDULE_2026: Game[] = [
  {
    slug: '2026-championship-series-final-chaos-vs-archers',
    dateLabel: 'Mar 8, Sun',
    sortDate: '2026-03-08',
    venue: 'Washington, D.C.',
    event: 'Championship Series Final',
    homeId: 'chaos',
    awayId: 'archers',
    time: '3:00 PM ET',
    broadcast: 'ESPN+',
    status: 'final',
    score: '24-16',
    ticketUrl: CHAMPIONSHIP_TICKETS_URL,
    recapTitle: 'Chaos capture the Championship Series crown',
    recapSummary: 'Carolina closed its Championship Series run with a 24-16 win, powered by relentless transition offense and another starring performance in goal. The Chaos controlled the tempo late and separated with a dominant second half.',
    scoreByPeriod: [
      { label: 'Q1', away: 5, home: 6 },
      { label: 'Q2', away: 4, home: 5 },
      { label: 'Q3', away: 3, home: 6 },
      { label: 'Q4', away: 4, home: 7 },
    ],
    topScorers: [
      { player: 'Shane Knobloch', teamId: 'chaos', goals: 5, assists: 2 },
      { player: 'Blaze Riorden', teamId: 'chaos', goals: 0, assists: 1 },
      { player: 'Connor Fields', teamId: 'archers', goals: 4, assists: 1 },
      { player: 'Tom Schreiber', teamId: 'archers', goals: 3, assists: 2 },
    ],
    media: [
      { label: 'PLL Championship Series Hub', href: 'https://premierlacrosseleague.com/championship-series', type: 'article' },
      { label: 'PLL YouTube: Chaos Highlights', href: 'https://www.youtube.com/@PremierLacrosseLeague/search?query=Carolina%20Chaos%20Championship%20Series%20highlights', type: 'highlights' },
      { label: 'Watch On ESPN+', href: ESPN_WATCH_URL, type: 'rewatch' },
      { label: 'Tickets', href: CHAMPIONSHIP_TICKETS_URL, type: 'tickets' },
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
    ticketUrl: CHAMPIONSHIP_TICKETS_URL,
    recapTitle: 'Chaos edge Outlaws in a one-goal semifinal thriller',
    recapSummary: 'Carolina survived a back-and-forth semifinal by making the final defensive plays it needed and getting timely finishing in transition. The 23-22 win punched the Chaos ticket to the Championship Series title game.',
    scoreByPeriod: [
      { label: 'Q1', away: 6, home: 6 },
      { label: 'Q2', away: 5, home: 5 },
      { label: 'Q3', away: 6, home: 7 },
      { label: 'Q4', away: 5, home: 5 },
    ],
    topScorers: [
      { player: 'Shane Knobloch', teamId: 'chaos', goals: 4, assists: 3 },
      { player: 'Josh Zawada', teamId: 'chaos', goals: 3, assists: 2 },
      { player: 'Brennan O’Neill', teamId: 'outlaws', goals: 5, assists: 1 },
      { player: 'Lyle Thompson', teamId: 'outlaws', goals: 4, assists: 3 },
    ],
    media: [
      { label: 'PLL Takeaways', href: 'https://premierlacrosseleague.com/articles/chaos-edge-outlaws-to-punch-ticket-to-championship-series-title-game-takeaways', type: 'article' },
      { label: 'PLL YouTube: Chaos vs Outlaws Highlights', href: 'https://www.youtube.com/@PremierLacrosseLeague/search?query=Chaos%20Outlaws%20highlights', type: 'highlights' },
      { label: 'Watch On ESPN+', href: ESPN_WATCH_URL, type: 'rewatch' },
      { label: 'Tickets', href: CHAMPIONSHIP_TICKETS_URL, type: 'tickets' },
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
