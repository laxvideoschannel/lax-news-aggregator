export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { cookies } from 'next/headers';

// ─── Supabase helper ───────────────────────────────────────────────────────────
async function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
  if (!url || !key || url.includes('placeholder')) return null;
  const { createClient } = await import('@supabase/supabase-js');
  return createClient(url, key);
}

function isAuthed(): boolean {
  try {
    const cookieStore = cookies();
    return cookieStore.get('lax_admin')?.value === 'true';
  } catch {
    return false;
  }
}

// ─── GET: read settings ────────────────────────────────────────────────────────
export async function GET() {
  if (!isAuthed()) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = await getSupabase();
  if (!supabase) {
    // No DB — return defaults
    return Response.json({ showFilmCta: false, filmCtaEmail: '', filmCtaHeadline: 'WANT YOUR TEAM ON FILM?' });
  }

  try {
    const { data } = await supabase.from('site_settings').select('key, value');
    const map: Record<string, string> = {};
    for (const row of data ?? []) map[row.key] = row.value;

    return Response.json({
      showFilmCta: map['showFilmCta'] === 'true',
      filmCtaEmail: map['filmCtaEmail'] ?? '',
      filmCtaHeadline: map['filmCtaHeadline'] ?? 'WANT YOUR TEAM ON FILM?',
    });
  } catch {
    return Response.json({ showFilmCta: false, filmCtaEmail: '', filmCtaHeadline: 'WANT YOUR TEAM ON FILM?' });
  }
}

// ─── POST: write settings ──────────────────────────────────────────────────────
export async function POST(request: Request) {
  if (!isAuthed()) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const supabase = await getSupabase();

  if (!supabase) {
    // No DB — silently accept (changes won't persist but won't error)
    return Response.json({ ok: true });
  }

  try {
    const entries = [
      { key: 'showFilmCta', value: String(Boolean(body.showFilmCta)) },
      { key: 'filmCtaEmail', value: String(body.filmCtaEmail ?? '') },
      { key: 'filmCtaHeadline', value: String(body.filmCtaHeadline ?? '') },
    ];

    for (const entry of entries) {
      await supabase.from('site_settings').upsert(entry, { onConflict: 'key' });
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error('Settings save error:', err);
    return Response.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
