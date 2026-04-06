export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { isAuthorizedAdminRequest } from '@/lib/admin-auth';
import { DEFAULT_VIDEO_SOURCES } from '@/lib/videos';

type CreateSourcePayload = {
  title: string;
  handleUrl: string;
  channelName?: string;
  channelId?: string;
  league?: 'PLL' | 'WLL' | 'CUSTOM';
  pullMode?: 'all' | 'select';
  teamId?: string;
  active?: boolean;
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

export async function GET(request: Request) {
  if (!isAuthorizedAdminRequest(request)) {
    return unauthorized();
  }

  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('lacrosse_video_sources')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ defaults: DEFAULT_VIDEO_SOURCES, sources: data ?? [] });
  } catch (error: any) {
    return Response.json({ error: error.message || 'Unexpected server error.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!isAuthorizedAdminRequest(request)) {
    return unauthorized();
  }

  let payload: CreateSourcePayload;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  if (!payload.title || !payload.handleUrl) {
    return Response.json({ error: 'title and handleUrl are required.' }, { status: 400 });
  }

  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('lacrosse_video_sources')
      .insert({
        title: payload.title,
        handle_url: payload.handleUrl,
        channel_name: payload.channelName || payload.title,
        channel_id: payload.channelId || null,
        league: payload.league || 'CUSTOM',
        pull_mode: payload.pullMode || 'select',
        team_id: payload.teamId || null,
        active: payload.active !== false,
      })
      .select('*')
      .single();

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ ok: true, source: data });
  } catch (error: any) {
    return Response.json({ error: error.message || 'Unexpected server error.' }, { status: 500 });
  }
}
