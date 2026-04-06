export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { isAuthorizedAdminRequest } from '@/lib/admin-auth';
import { DEFAULT_VIDEO_SOURCES, fetchVideosForSource, resolveChannelId, VideoSource } from '@/lib/videos';

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

export async function GET(request: Request) {
  if (!isAuthorizedAdminRequest(request)) {
    return unauthorized();
  }

  const { searchParams } = new URL(request.url);
  const sourceId = searchParams.get('sourceId');
  const handleUrl = searchParams.get('handleUrl');
  const channelName = searchParams.get('channelName') || 'Custom channel';
  const league = (searchParams.get('league') || 'CUSTOM') as 'PLL' | 'WLL' | 'CUSTOM';
  const teamId = searchParams.get('teamId');

  try {
    let source: VideoSource | null = null;

    if (sourceId) {
      const defaultSource = DEFAULT_VIDEO_SOURCES.find((item) => item.id === sourceId);
      if (defaultSource) {
        source = defaultSource;
      } else {
        const supabase = await getSupabaseClient();
        const { data, error } = await supabase
          .from('lacrosse_video_sources')
          .select('*')
          .eq('id', sourceId)
          .single();

        if (error || !data) {
          return Response.json({ error: 'Source not found.' }, { status: 404 });
        }

        source = {
          id: String(data.id),
          title: data.title || data.channel_name || 'Custom feed',
          handleUrl: data.handle_url,
          channelName: data.channel_name || data.title || 'Custom channel',
          channelId: data.channel_id || null,
          league: data.league || 'CUSTOM',
          pullMode: data.pull_mode || 'select',
          active: data.active !== false,
          teamId: data.team_id || null,
        };
      }
    } else if (handleUrl) {
      source = {
        id: 'preview',
        title: channelName,
        handleUrl,
        channelName,
        channelId: await resolveChannelId(handleUrl),
        league,
        pullMode: 'select',
        active: true,
        teamId,
      };
    }

    if (!source) {
      return Response.json({ error: 'No source provided.' }, { status: 400 });
    }

    const videos = await fetchVideosForSource(source, 16);
    return Response.json({ source, videos });
  } catch (error: any) {
    return Response.json({ error: error.message || 'Unexpected server error.' }, { status: 500 });
  }
}
