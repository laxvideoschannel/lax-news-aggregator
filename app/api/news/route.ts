export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

  if (!url || !key || url.includes('placeholder') || key.includes('placeholder')) {
    return Response.json([]);
  }

  try {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(url, key);

    const { data, error } = await supabase
      .from('lacrosse_news')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(50);

    if (error) return Response.json([]);
    return Response.json(data ?? []);
  } catch {
    return Response.json([]);
  }
}
