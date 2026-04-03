export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function GET(request: Request) {
  // Skip during build/prerender — no env vars available then
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

  if (!url || !key) {
    return new Response('OK', { status: 200 });
  }

  try {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(url, key);

    const GOOGLE_NEWS_RSS =
      'https://news.google.com/rss/search?q=lacrosse+news+when:24h&hl=en-US&gl=US&ceid=US:en';

    const res = await fetch(GOOGLE_NEWS_RSS);
    const xml = await res.text();

    // Parse RSS manually (rss-parser doesn't work in edge runtime)
    const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(m => {
      const block = m[1];
      const get = (tag: string) =>
        block.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`))?.[1] ??
        block.match(new RegExp(`<${tag}[^>]*>([^<]*)<\\/${tag}>`))?.[1] ?? '';
      return {
        title: get('title'),
        link: get('link') || block.match(/<link\/>([^<]+)/)?.[1] ?? '',
        summary: get('description').slice(0, 500),
        pubDate: get('pubDate'),
        source: get('source'),
      };
    });

    let count = 0;
    for (const item of items) {
      if (!item.link || !item.title) continue;

      let category = 'General';
      const content = (item.title + ' ' + item.summary).toLowerCase();
      if (content.includes('pll') || content.includes('wll') || content.includes('pro') || content.includes('chaos'))
        category = 'Pro';
      else if (content.includes('ncaa') || content.includes('d1') || content.includes('college') || content.includes('tusculum'))
        category = 'College';
      else if (content.includes('commit') || content.includes('high school'))
        category = 'HS';

      const titleParts = item.title.split(' - ');

      const { error } = await supabase.from('lacrosse_news').upsert({
        title: titleParts[0],
        link: item.link,
        summary: item.summary,
        source: item.source || titleParts[1] || 'Lax News',
        category,
        published_at: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
      }, { onConflict: 'link' });

      if (!error) count++;
    }

    return new Response(`Successfully updated ${count} stories!`, { status: 200 });
  } catch (err: any) {
    return new Response(`Update failed: ${err.message}`, { status: 500 });
  }
}
