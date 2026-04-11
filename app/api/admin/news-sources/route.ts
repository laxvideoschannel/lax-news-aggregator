export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { isAuthorizedAdminRequest } from '@/lib/admin-auth';

function unauthorized() {
  return Response.json({ error: 'Unauthorized' }, { status: 401 });
}

async function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';
  if (!url || !key) throw new Error('Supabase credentials missing');
  const { createClient } = await import('@supabase/supabase-js');
  return createClient(url, key);
}

export async function GET(request: Request) {
  if (!isAuthorizedAdminRequest(request)) return unauthorized();
  try {
    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('news_sources')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return Response.json({ sources: data ?? [] });
  } catch {
    // Return empty — the news route falls back to its hardcoded defaults
    return Response.json({ sources: [] });
  }
}

export async function POST(request: Request) {
  if (!isAuthorizedAdminRequest(request)) return unauthorized();
  try {
    const body = await request.json();
    const { label, feedUrl, category } = body;
    if (!feedUrl || !label) {
      return Response.json({ error: 'label and feedUrl are required' }, { status: 400 });
    }

    const supabase = await getSupabaseClient();
    const { data, error } = await supabase
      .from('news_sources')
      .insert([{ label, feed_url: feedUrl, category: category || 'General', active: true }])
      .select()
      .single();
    if (error) throw error;
    return Response.json({ source: data });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!isAuthorizedAdminRequest(request)) return unauthorized();
  try {
    const body = await request.json();
    const { id, active } = body;
    if (!id) return Response.json({ error: 'Missing id' }, { status: 400 });
    const supabase = await getSupabaseClient();
    const { error } = await supabase.from('news_sources').update({ active }).eq('id', id);
    if (error) throw error;
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!isAuthorizedAdminRequest(request)) return unauthorized();
  try {
    const body = await request.json();
    const { id } = body;
    if (!id) return Response.json({ error: 'Missing id' }, { status: 400 });
    const supabase = await getSupabaseClient();
    const { error } = await supabase.from('news_sources').delete().eq('id', id);
    if (error) throw error;
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}
