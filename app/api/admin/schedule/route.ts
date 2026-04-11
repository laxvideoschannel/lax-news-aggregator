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
      .from('games')
      .select('*')
      .order('sort_date', { ascending: true });
    if (error) throw error;
    return Response.json({ games: data ?? [] });
  } catch {
    return Response.json({ games: [] });
  }
}

export async function POST(request: Request) {
  if (!isAuthorizedAdminRequest(request)) return unauthorized();
  try {
    const body = await request.json();
    const {
      slug, dateLabel, sortDate, venue, event,
      homeId, awayId, time, broadcast, status,
      score, ticketUrl, recapTitle, recapSummary,
    } = body;

    if (!homeId || !awayId || !dateLabel || !event) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = await getSupabaseClient();
    const gameSlug = slug || `${sortDate || dateLabel.toLowerCase().replace(/\s/g, '-')}-${homeId}-vs-${awayId}`;

    const { data, error } = await supabase.from('games').insert([{
      slug: gameSlug,
      date_label: dateLabel,
      sort_date: sortDate || null,
      venue: venue || '',
      event,
      home_id: homeId,
      away_id: awayId,
      time: time || 'TBD',
      broadcast: broadcast || 'TBD',
      status: status || 'upcoming',
      score: score || null,
      ticket_url: ticketUrl || null,
      recap_title: recapTitle || null,
      recap_summary: recapSummary || null,
    }]).select().single();

    if (error) throw error;
    return Response.json({ game: data });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!isAuthorizedAdminRequest(request)) return unauthorized();
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    if (!id) return Response.json({ error: 'Missing id' }, { status: 400 });

    const supabase = await getSupabaseClient();

    // Map camelCase to snake_case for the db columns
    const dbUpdates: Record<string, unknown> = {};
    if (updates.score !== undefined) dbUpdates.score = updates.score;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.recapTitle !== undefined) dbUpdates.recap_title = updates.recapTitle;
    if (updates.recapSummary !== undefined) dbUpdates.recap_summary = updates.recapSummary;
    if (updates.broadcast !== undefined) dbUpdates.broadcast = updates.broadcast;
    if (updates.ticketUrl !== undefined) dbUpdates.ticket_url = updates.ticketUrl;
    if (updates.time !== undefined) dbUpdates.time = updates.time;
    if (updates.venue !== undefined) dbUpdates.venue = updates.venue;

    const { error } = await supabase.from('games').update(dbUpdates).eq('id', id);
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
    const { error } = await supabase.from('games').delete().eq('id', id);
    if (error) throw error;
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}
