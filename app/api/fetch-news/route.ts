export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const fetchCache = 'force-no-store';

// This stops Next.js from ever trying to prerender this route
export function generateStaticParams() {
  return [];
}

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key || url.includes('placeholder') || url === 'undefined') {
    return new Response('OK', { status: 200 });
  }

  try {
    const { createClient } = await import('@supabase/supabase-js');
    const { default: Parser } = await import('rss-parser');
    const supabase = createClient(url, key);
    const parser = new Parser();

    const data = await parser.parseURL(
      'https://news.google.com/rss/search?q=lacrosse+news+when:24h&hl=en-US&gl=US&ceid=US:en'
    );
    let count = 0;

    for (const item of data.items) {
      if (!item.link || !item.title) continue;

      let category = 'General';
      const content = (item.title + ' ' + (item.contentSnippet || '')).toLowerCase();
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
        summary: item.contentSnippet?.slice(0, 500) || '',
        source: titleParts[1] || 'Lax News',
        category,
        published_at: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
      }, { onConflict: 'link' });

      if (!error) count++;
    }

    return new Response(`Updated ${count} stories`, { status: 200 });
  } catch (err: any) {
    return new Response(`Error: ${err.message}`, { status: 500 });
  }
}
