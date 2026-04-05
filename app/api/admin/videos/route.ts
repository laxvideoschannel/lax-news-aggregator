export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { createYouTubeThumbnailUrl, getYouTubeVideoId } from '@/lib/videos';

type CreateVideoPayload = {
  title: string;
  youtubeUrl: string;
  league?: 'PLL' | 'WLL' | 'CUSTOM';
  channelName?: string;
  description?: string;
  featured?: boolean;
  publishedAt?: string;
};

function unauthorized() {
  return Response.json({ error: 'Unauthorized' }, { status: 401 });
}

export async function POST(request: Request) {
  const adminSecret = process.env.ADMIN_VIDEO_API_KEY;
  const incomingSecret = request.headers.get('x-admin-key');

  if (!adminSecret || incomingSecret !== adminSecret) {
    return unauthorized();
  }

  const serviceUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

  if (!serviceUrl || !serviceKey) {
    return Response.json(
      { error: 'Supabase service role credentials are missing.' },
      { status: 500 },
    );
  }

  let payload: CreateVideoPayload;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const videoId = getYouTubeVideoId(payload.youtubeUrl ?? '');
  if (!payload.title || !payload.youtubeUrl || !videoId) {
    return Response.json(
      { error: 'title and a valid youtubeUrl are required.' },
      { status: 400 },
    );
  }

  try {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(serviceUrl, serviceKey);

    const { data, error } = await supabase
      .from('lacrosse_videos')
      .insert({
        title: payload.title,
        youtube_url: payload.youtubeUrl,
        channel_name: payload.channelName || 'Custom channel',
        league: payload.league || 'CUSTOM',
        description: payload.description || '',
        featured: Boolean(payload.featured),
        thumbnail_url: createYouTubeThumbnailUrl(payload.youtubeUrl),
        published_at: payload.publishedAt || new Date().toISOString(),
      })
      .select('*')
      .single();

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ ok: true, video: data });
  } catch (error: any) {
    return Response.json({ error: error.message || 'Unexpected server error.' }, { status: 500 });
  }
}
