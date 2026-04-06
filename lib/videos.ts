import Parser from 'rss-parser';

export type VideoLeague = 'PLL' | 'WLL' | 'CUSTOM';
export type PullMode = 'all' | 'select';

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
  teamId?: string | null;
}

export interface VideoSource {
  id: string;
  title: string;
  handleUrl: string;
  league: VideoLeague;
  channelName: string;
  channelId?: string | null;
  pullMode: PullMode;
  active: boolean;
  teamId?: string | null;
  official?: boolean;
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

type VideoSourceRow = {
  id: string | number;
  title?: string | null;
  handle_url?: string | null;
  channel_name?: string | null;
  channel_id?: string | null;
  league?: VideoLeague | null;
  pull_mode?: PullMode | null;
  active?: boolean | null;
  team_id?: string | null;
};

const parser = new Parser<Record<string, never>, YouTubeFeedEntry>();

export const DEFAULT_VIDEO_SOURCES: VideoSource[] = [
  {
    id: 'official-pll',
    title: 'Official PLL Feed',
    handleUrl: 'https://www.youtube.com/@pll',
    league: 'PLL',
    channelName: 'Premier Lacrosse League',
    channelId: 'UCNUOJo_m8-w2yPSIC5DLK1g',
    pullMode: 'all',
    active: true,
    official: true,
  },
  {
    id: 'official-wll',
    title: 'Official WLL Feed',
    handleUrl: 'https://www.youtube.com/@WomensLacrosseLeague',
    league: 'WLL',
    channelName: "Women's Lacrosse League",
    pullMode: 'all',
    active: true,
    official: true,
  },
];

const FALLBACK_VIDEOS: VideoItem[] = [
  {
    id: 'wll-launch-9XEmE2BVuNQ',
    title: "Why We Launched the Women's Lacrosse League",
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
    id: 'pll-official-feed',
    title: 'Official PLL YouTube Channel',
    youtubeUrl: 'https://www.youtube.com/@pll/videos',
    embedUrl: '',
    thumbnailUrl: 'https://i.ytimg.com/vi/9XEmE2BVuNQ/hqdefault.jpg',
    channelName: 'Premier Lacrosse League',
    league: 'PLL',
    source: 'official',
    description: 'Browse the official PLL video feed.',
  },
];

function getSupabasePublicCredentials() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

  if (!url || !key || url.includes('placeholder') || key.includes('placeholder')) {
    return null;
  }

  return { url, key };
}

async function getPublicSupabaseClient() {
  const credentials = getSupabasePublicCredentials();
  if (!credentials) return null;

  const { createClient } = await import('@supabase/supabase-js');
  return createClient(credentials.url, credentials.key);
}

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
  return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
}

export function createYouTubeThumbnailUrl(url: string) {
  const videoId = getYouTubeVideoId(url);
  return videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : '';
}

export async function resolveChannelId(handleUrl: string) {
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

function normalizeVideoSource(row: VideoSourceRow): VideoSource | null {
  if (!row.handle_url) return null;

  return {
    id: String(row.id),
    title: row.title || row.channel_name || 'Custom feed',
    handleUrl: row.handle_url,
    channelName: row.channel_name || row.title || 'Custom channel',
    channelId: row.channel_id || null,
    league: row.league || 'CUSTOM',
    pullMode: row.pull_mode || 'select',
    active: row.active !== false,
    teamId: row.team_id || null,
    official: false,
  };
}

export async function getAdminManagedVideoSources(): Promise<VideoSource[]> {
  const supabase = await getPublicSupabaseClient();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('lacrosse_video_sources')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error || !data) return [];
    return (data as VideoSourceRow[]).map(normalizeVideoSource).filter(Boolean) as VideoSource[];
  } catch {
    return [];
  }
}

export async function getConfiguredVideoSources() {
  const customSources = await getAdminManagedVideoSources();
  return [...DEFAULT_VIDEO_SOURCES, ...customSources];
}

export async function fetchVideosForSource(source: VideoSource, limit = 12): Promise<VideoItem[]> {
  try {
    const channelId = source.channelId || await resolveChannelId(source.handleUrl);
    if (!channelId) return [];

    const feed = await parser.parseURL(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`);

    return (feed.items ?? []).slice(0, limit).map((item) => {
      const youtubeUrl = item.link ?? '';
      const videoId = getYouTubeVideoId(youtubeUrl) ?? item.id?.split(':').pop() ?? crypto.randomUUID();

      return {
        id: `${source.id}-${videoId}`,
        title: item.title ?? 'Untitled video',
        youtubeUrl,
        embedUrl: `https://www.youtube.com/embed/${videoId}`,
        thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
        channelName: item.creator ?? source.channelName,
        league: source.league,
        source: source.official ? 'official' : 'custom',
        publishedAt: item.pubDate,
        description: item.contentSnippet ?? item.content ?? '',
        teamId: source.teamId || null,
      };
    });
  } catch {
    return [];
  }
}

async function fetchImportedVideosFromSupabase(): Promise<VideoItem[]> {
  const supabase = await getPublicSupabaseClient();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase
      .from('lacrosse_videos')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(200);

    if (error || !data) return [];

    return data.map((item: any) => ({
      id: String(item.id),
      title: item.title,
      youtubeUrl: item.youtube_url,
      embedUrl: createYouTubeEmbedUrl(item.youtube_url),
      thumbnailUrl: item.thumbnail_url || createYouTubeThumbnailUrl(item.youtube_url),
      channelName: item.channel_name || 'Playlist channel',
      league: item.league || 'CUSTOM',
      source: 'custom',
      publishedAt: item.published_at,
      description: item.description || '',
      featured: Boolean(item.featured),
      teamId: item.team_id || null,
    }));
  } catch {
    return [];
  }
}

export async function getVideoLibrary(): Promise<VideoItem[]> {
  const [sources, importedVideos] = await Promise.all([
    getConfiguredVideoSources(),
    fetchImportedVideosFromSupabase(),
  ]);

  const activeFeedSources = sources.filter((source) => source.active && source.pullMode === 'all');
  const feedResults = await Promise.all(activeFeedSources.map((source) => fetchVideosForSource(source, 12)));
  const feedVideos = feedResults.flat();
  const merged = [...importedVideos, ...feedVideos];

  if (merged.length === 0) {
    return FALLBACK_VIDEOS;
  }

  const unique = new Map<string, VideoItem>();
  for (const item of merged) {
    if (!unique.has(item.youtubeUrl)) {
      unique.set(item.youtubeUrl, item);
    }
  }

  return Array.from(unique.values()).sort((a, b) => {
    const aDate = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const bDate = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return bDate - aDate;
  });
}
