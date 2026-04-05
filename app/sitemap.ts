import type { MetadataRoute } from 'next';
import { ALL_PLAYERS } from '@/lib/players';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lax-news-aggregator.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ['', '/news', '/videos', '/schedule', '/team'].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: path === '' ? 1 : 0.8,
  }));

  const playerPages = ALL_PLAYERS.map((player) => ({
    url: `${SITE_URL}/team/${player.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...playerPages];
}
