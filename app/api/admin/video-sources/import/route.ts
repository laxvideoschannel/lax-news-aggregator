export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { isAuthorizedAdminRequest } from '@/lib/admin-auth';
import { DEFAULT_VIDEO_SOURCES, fetchVideosForSource, resolveChannelId, VideoItem, VideoSource, createYouTubeThumbnailUrl } from '@/lib/videos';

type ImportPayload = {
  sourceId?: string;
  handleUrl?: string;
  channelName?: string;
  league?: 'PLL' | 'WLL' | 'CUSTOM';
  teamId?: string;
  mode?: 'all' | 'selected';
  selectedUrls?: string[];
};

function unauthorized() {
  return Response.json({ error: 'Unauthorized' }, { status: 401 });
}

async function getSupabaseClient() {
  const serviceUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

  if (!serviceUrl || !serviceKey) {
    throw new Error('Supabase service role credentials are missing.');
  }

  const { createClient } = await import('@supabase/supabase-js');
  return createClient(serviceUrl, serviceKey);
}

async function resolveSource(payload: ImportPayload) {
  if (payload.sourceId) {
    const defaultSource = DEFAULT_VIDEO_SOURCES.find((item) => item.id === payload.sourceId);
    if (defaultSource) {
      return defaultSource;
    }

    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('lacrosse_video_sources')
      .select('*')
      .eq('id', payload.sourceId)
      .single();

    if (error || !data) {
      throw new Error('Source not found.');
    }

    return {
      id: String(data.id),
      title: data.title || data.channel_name || 'Custom feed',
      handleUrl: data.handle_url,
      channelName: data.channel_name || data.title || 'Custom channel',
      channelId: data.channel_id || null,
      league: data.league || 'CUSTOM',
      pullMode: data.pull_mode || 'select',
      active: data.active !== false,
      teamId: data.team_id || null,
    } as VideoSource;
  }

  if (!payload.handleUrl) {
    throw new Error('No source provided.');
  }

  return {
    id: 'preview-import',
    title: payload.channelName || 'Custom source',
    handleUrl: payload.handleUrl,
    channelName: payload.channelName || 'Custom source',
    channelId: await resolveChannelId(payload.handleUrl),
    league: payload.league || 'CUSTOM',
    pullMode: 'select',
    active: true,
    teamId: payload.teamId || null,
  } as VideoSource;
}

function toInsertRows(videos: VideoItem[]) {
  return videos.map((video) => ({
    title: video.title,
    youtube_url: video.youtubeUrl,
    channel_name: video.channelName,
    league: video.league,
    description: video.description || '',
    featured: false,
    thumbnail_url: video.thumbnailUrl || createYouTubeThumbnailUrl(video.youtubeUrl),
    published_at: video.publishedAt || new Date().toISOString(),
    team_id: video.teamId || null,
  }));
}

export async function POST(request: Request) {
  if (!isAuthorizedAdminRequest(request)) {
    return unauthorized();
  }

  let payload: ImportPayload;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  try {
    const source = await resolveSource(payload);
    const feedVideos = await fetchVideosForSource(source, 16);
    const selectedSet = new Set(payload.selectedUrls || []);
    const chosenVideos = payload.mode === 'selected'
      ? feedVideos.filter((video) => selectedSet.has(video.youtubeUrl))
      : feedVideos;

    if (!chosenVideos.length) {
      return Response.json({ error: 'No videos selected.' }, { status: 400 });
    }

    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('lacrosse_videos')
      .upsert(toInsertRows(chosenVideos), { onConflict: 'youtube_url' })
      .select('*');

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ ok: true, imported: data?.length || chosenVideos.length });
  } catch (error: any) {
    return Response.json({ error: error.message || 'Unexpected server error.' }, { status: 500 });
  }
}
