import Parser from 'rss-parser';

export type VideoLeague = 'PLL' | 'WLL' | 'CUSTOM';

export interface VideoItem {
  id: string;
  title: string;
  youtubeUrl: string;
  embedUrl: string;
  thumbnailUrl: string;
  channelName: string;
  league: VideoLeague;
  source: 'official' | 'custom';
  publishedAt?: string;
  description?: string;
  featured?: boolean;
}

type YouTubeFeedEntry = {
  id?: string;
  title?: string;
  link?: string;
  pubDate?: string;
  content?: string;
  contentSnippet?: string;
  creator?: string;
};

const parser = new Parser<Record<string, never>, YouTubeFeedEntry>();

const OFFICIAL_CHANNELS: Array<{ handleUrl: string; league: Exclude<VideoLeague, 'CUSTOM'>; channelName: string }> = [
  {
    handleUrl: 'https://www.youtube.com/@PremierLacrosseLeague',
    league: 'PLL',
    channelName: 'Premier Lacrosse League',
  },
  {
    handleUrl: 'https://www.youtube.com/@WomensLacrosseLeague',
    league: 'WLL',
    channelName: 'Women\'s Lacrosse League',
  },
];

const FALLBACK_VIDEOS: VideoItem[] = [
  {
    id: 'wll-launch-9XEmE2BVuNQ',
    title: 'Why We Launched the Women\'s Lacrosse League',
    youtubeUrl: 'https://www.youtube.com/watch?v=9XEmE2BVuNQ',
    embedUrl: 'https://www.youtube.com/embed/9XEmE2BVuNQ',
    thumbnailUrl: 'https://i.ytimg.com/vi/9XEmE2BVuNQ/hqdefault.jpg',
    channelName: 'Premier Lacrosse League',
    league: 'WLL',
    source: 'official',
    publishedAt: '2024-12-09T00:00:00.000Z',
    description: 'Official launch video for the WLL.',
    featured: true,
  },
  {
    id: 'pll-channel-featured',
    title: 'Official PLL YouTube Channel',
    youtubeUrl: 'https://www.youtube.com/@PremierLacrosseLeague/videos',
    embedUrl: 'https://www.youtube.com/embed?listType=user_uploads&list=premierlacrosseleague',
    thumbnailUrl: 'https://i.ytimg.com/vi_webp/9XEmE2BVuNQ/maxresdefault.webp',
    channelName: 'Premier Lacrosse League',
    league: 'PLL',
    source: 'official',
    description: 'Browse the official PLL video feed.',
  },
];

export function getYouTubeVideoId(url: string) {
  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/i,
    /youtu\.be\/([^?&/]+)/i,
    /youtube\.com\/shorts\/([^?&/]+)/i,
    /youtube\.com\/embed\/([^?&/]+)/i,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) return match[1];
  }

  return null;
}

export function createYouTubeEmbedUrl(url: string) {
  const videoId = getYouTubeVideoId(url);
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
}

export function createYouTubeThumbnailUrl(url: string) {
  const videoId = getYouTubeVideoId(url);
  return videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : '';
}

async function resolveChannelId(handleUrl: string) {
  try {
    const response = await fetch(`${handleUrl}/videos`, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) return null;
    const html = await response.text();
    const match = html.match(/"channelId":"(UC[^"]+)"/);
    return match?.[1] ?? null;
  } catch {
    return null;
  }
}

async function fetchOfficialFeedVideos(channel: (typeof OFFICIAL_CHANNELS)[number]): Promise<VideoItem[]> {
  try {
    const channelId = await resolveChannelId(channel.handleUrl);
    if (!channelId) return [];

    const feed = await parser.parseURL(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`);

    return (feed.items ?? []).slice(0, 8).map((item) => {
      const youtubeUrl = item.link ?? '';
      const videoId = getYouTubeVideoId(youtubeUrl) ?? item.id?.split(':').pop() ?? crypto.randomUUID();

      return {
        id: `${channel.league.toLowerCase()}-${videoId}`,
        title: item.title ?? 'Untitled video',
        youtubeUrl,
        embedUrl: `https://www.youtube.com/embed/${videoId}`,
        thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
        channelName: item.creator ?? channel.channelName,
        league: channel.league,
        source: 'official',
        publishedAt: item.pubDate,
        description: item.contentSnippet ?? item.content ?? '',
      };
    });
  } catch {
    return [];
  }
}

async function fetchCustomVideosFromSupabase(): Promise<VideoItem[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

  if (!url || !key || url.includes('placeholder') || key.includes('placeholder')) {
    return [];
  }

  try {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(url, key);
    const { data, error } = await supabase
      .from('lacrosse_videos')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(100);

    if (error || !data) return [];

    return data.map((item: any) => ({
      id: String(item.id),
      title: item.title,
      youtubeUrl: item.youtube_url,
      embedUrl: createYouTubeEmbedUrl(item.youtube_url),
      thumbnailUrl: item.thumbnail_url || createYouTubeThumbnailUrl(item.youtube_url),
      channelName: item.channel_name || 'Custom channel',
      league: item.league || 'CUSTOM',
      source: 'custom',
      publishedAt: item.published_at,
      description: item.description || '',
      featured: Boolean(item.featured),
    }));
  } catch {
    return [];
  }
}

export async function getVideoLibrary(): Promise<VideoItem[]> {
  const [officialFeeds, customVideos] = await Promise.all([
    Promise.all(OFFICIAL_CHANNELS.map((channel) => fetchOfficialFeedVideos(channel))),
    fetchCustomVideosFromSupabase(),
  ]);

  const officialVideos = officialFeeds.flat();
  const merged = [...customVideos, ...officialVideos];

  if (merged.length === 0) {
    return FALLBACK_VIDEOS;
  }

  const unique = new Map<string, VideoItem>();
  for (const item of merged) {
    unique.set(item.youtubeUrl, item);
  }

  return Array.from(unique.values()).sort((a, b) => {
    const aDate = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const bDate = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return bDate - aDate;
  });
}
