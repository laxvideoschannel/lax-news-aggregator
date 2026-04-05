import { getTeam } from '@/lib/teams';

export interface TeamMerchItem {
  title: string;
  subtitle: string;
  href: string;
  accent: string;
  image?: string;
  price?: string;
}

export interface TeamMerchContent {
  shopUrl: string;
  featuredTitle: string;
  featuredSubtitle: string;
  items: TeamMerchItem[];
}

export interface TeamMerchSource {
  baseUrl: string;
  collectionHandle?: string;
  shopUrl: string;
}

export const TEAM_MERCH_SOURCES: Record<string, TeamMerchSource> = {
  chaos: {
    baseUrl: 'https://shop.premierlacrosseleague.com',
    collectionHandle: 'carolina-chaos',
    shopUrl: 'https://shop.premierlacrosseleague.com/collections/carolina-chaos',
  },
  archers: {
    baseUrl: 'https://shop.premierlacrosseleague.com',
    collectionHandle: 'utah-archers',
    shopUrl: 'https://shop.premierlacrosseleague.com/collections/utah-archers',
  },
  outlaws: {
    baseUrl: 'https://shop.premierlacrosseleague.com',
    collectionHandle: 'denver-outlaws',
    shopUrl: 'https://shop.premierlacrosseleague.com/search?q=Denver%20Outlaws',
  },
  redwoods: {
    baseUrl: 'https://shop.premierlacrosseleague.com',
    collectionHandle: 'california-redwoods',
    shopUrl: 'https://shop.premierlacrosseleague.com/search?q=California%20Redwoods',
  },
  cannons: {
    baseUrl: 'https://shop.premierlacrosseleague.com',
    collectionHandle: 'boston-cannons',
    shopUrl: 'https://shop.premierlacrosseleague.com/collections/boston-cannons',
  },
  whipsnakes: {
    baseUrl: 'https://shop.premierlacrosseleague.com',
    collectionHandle: 'maryland-whipsnakes',
    shopUrl: 'https://shop.premierlacrosseleague.com/search?q=Maryland%20Whipsnakes',
  },
  atlas: {
    baseUrl: 'https://shop.premierlacrosseleague.com',
    collectionHandle: 'new-york-atlas',
    shopUrl: 'https://shop.premierlacrosseleague.com/search?q=New%20York%20Atlas',
  },
  waterdogs: {
    baseUrl: 'https://shop.premierlacrosseleague.com',
    collectionHandle: 'philadelphia-waterdogs',
    shopUrl: 'https://shop.premierlacrosseleague.com/search?q=Philadelphia%20Waterdogs',
  },
  guard: {
    baseUrl: 'https://wllshop.com',
    collectionHandle: 'guard',
    shopUrl: 'https://wllshop.com/collections/guard',
  },
  palms: {
    baseUrl: 'https://wllshop.com',
    collectionHandle: 'palms',
    shopUrl: 'https://wllshop.com/collections/palms',
  },
  charm: {
    baseUrl: 'https://wllshop.com',
    collectionHandle: 'charm',
    shopUrl: 'https://wllshop.com/collections/charm',
  },
  charging: {
    baseUrl: 'https://wllshop.com',
    collectionHandle: 'charging',
    shopUrl: 'https://wllshop.com/collections/charging',
  },
};

const CARD_LIBRARY: Record<'PLL' | 'WLL', { title: string; subtitle: string; accent: string }[]> = {
  PLL: [
    { title: 'Replica Jersey', subtitle: 'Official team threads', accent: 'JERSEY' },
    { title: 'Sideline Apparel', subtitle: 'Tees, hoodies, and layers', accent: 'APPAREL' },
    { title: 'Game-Day Hat', subtitle: 'Top off the fit', accent: 'HAT' },
    { title: 'Fan Gear', subtitle: 'Flags, pennants, and extras', accent: 'FAN' },
  ],
  WLL: [
    { title: 'Replica Jersey', subtitle: 'Player and personalized looks', accent: 'JERSEY' },
    { title: 'Team Apparel', subtitle: 'Tees, fleece, and everyday gear', accent: 'APPAREL' },
    { title: 'Accessories', subtitle: 'Wristbands, hats, and keychains', accent: 'GEAR' },
    { title: 'Collectibles', subtitle: 'Mini-sticks, posters, and more', accent: 'COLLECT' },
  ],
};

export function getTeamMerch(teamId: string): TeamMerchContent {
  const team = getTeam(teamId);
  const source = TEAM_MERCH_SOURCES[teamId];
  const shopUrl = source?.shopUrl ?? (team.league === 'PLL'
    ? `https://shop.premierlacrosseleague.com/search?q=${encodeURIComponent(team.full)}`
    : `https://wllshop.com/search?q=${encodeURIComponent(team.full)}`);

  const items = CARD_LIBRARY[team.league].map((item, index) => ({
    ...item,
    href: shopUrl,
    accent: `${item.accent} 0${index + 1}`,
  }));

  return {
    shopUrl,
    featuredTitle: `${team.full} Gear Drop`,
    featuredSubtitle: team.league === 'PLL'
      ? 'Official PLL shop gear for game day, sideline fits, and team collectibles.'
      : 'Official WLL shop gear for jerseys, apparel, and collectibles built around your squad.',
    items,
  };
}
