export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { cookies } from 'next/headers';
import { isAuthorizedAdminRequest } from '@/lib/admin-auth';

async function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
  if (!url || !key || url.includes('placeholder')) return null;
  const { createClient } = await import('@supabase/supabase-js');
  return createClient(url, key);
}

const DEFAULTS = {
  showFilmCta: false,
  filmCtaEmail: '',
  filmCtaHeadline: 'WANT YOUR TEAM ON FILM?',
  heroTag: 'PLL + WLL HUB',
  heroHeadline1: 'WATCH.',
  heroHeadline2: 'FOLLOW.',
  heroCta1Text: 'WATCH LATEST →',
  heroCta1Url: '/videos',
  heroCta2Text: 'ALL NEWS →',
  heroCta2Url: '/news',
  tickerItems: 'CAROLINA CHAOS WIN THE 2026 PLL CHAMPIONSHIP SERIES 24-16 | BLAZE RIORDEN - PLL ALL-TIME SAVE RECORD HOLDER (25 SAVES) | 2026 CHAMPIONSHIP SERIES RETURNS TO D.C. - FEB 27 TO MAR 8 | SHANE KNOBLOCH WINS GOLDEN STICK AWARD - 30 POINTS',
};

export async function GET(request: Request) {
  if (!isAuthorizedAdminRequest(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = await getSupabase();
  if (!supabase) return Response.json(DEFAULTS);

  try {
    const { data } = await supabase.from('site_settings').select('key, value');
    const map: Record<string, string> = {};
    for (const row of data ?? []) map[row.key] = row.value;

    return Response.json({
      showFilmCta: map['showFilmCta'] === 'true',
      filmCtaEmail: map['filmCtaEmail'] ?? DEFAULTS.filmCtaEmail,
      filmCtaHeadline: map['filmCtaHeadline'] ?? DEFAULTS.filmCtaHeadline,
      heroTag: map['heroTag'] ?? DEFAULTS.heroTag,
      heroHeadline1: map['heroHeadline1'] ?? DEFAULTS.heroHeadline1,
      heroHeadline2: map['heroHeadline2'] ?? DEFAULTS.heroHeadline2,
      heroCta1Text: map['heroCta1Text'] ?? DEFAULTS.heroCta1Text,
      heroCta1Url: map['heroCta1Url'] ?? DEFAULTS.heroCta1Url,
      heroCta2Text: map['heroCta2Text'] ?? DEFAULTS.heroCta2Text,
      heroCta2Url: map['heroCta2Url'] ?? DEFAULTS.heroCta2Url,
      tickerItems: map['tickerItems'] ?? DEFAULTS.tickerItems,
    });
  } catch {
    return Response.json(DEFAULTS);
  }
}

export async function POST(request: Request) {
  if (!isAuthorizedAdminRequest(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const supabase = await getSupabase();

  if (!supabase) return Response.json({ ok: true, note: 'No DB — changes not persisted' });

  try {
    const entries = Object.keys(DEFAULTS).map((key) => ({
      key,
      value: String(body[key] ?? (DEFAULTS as any)[key] ?? ''),
    }));

    for (const entry of entries) {
      await supabase.from('site_settings').upsert(entry, { onConflict: 'key' });
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error('Settings save error:', err);
    return Response.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
