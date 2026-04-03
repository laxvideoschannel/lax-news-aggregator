import Parser from 'rss-parser'

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const parser = new Parser();

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Safety check: during build phase, env vars won't be set
  if (!url || !key || url === 'undefined' || key === 'undefined') {
    return new Response('Syncing with database...', { status: 200 });
  }

  try {
    // Dynamically import to prevent any module-level initialization
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(url, key);

    const GOOGLE_NEWS_RSS =
      'https://news.google.com/rss/search?q=lacrosse+news+when:24h&hl=en-US&gl=US&ceid=US:en';

    const data = await parser.parseURL(GOOGLE_NEWS_RSS);
    let count = 0;

    for (const item of data.items) {
      if (!item.link || !item.title) continue;

      let category = 'General';
      const content = (item.title + ' ' + (item.contentSnippet || '')).toLowerCase();
      if (
        content.includes('pll') ||
        content.includes('wll') ||
        content.includes('pro') ||
        content.includes('chaos')
      )
        category = 'Pro';
      else if (
        content.includes('ncaa') ||
        content.includes('d1') ||
        content.includes('college') ||
        content.includes('tusculum')
      )
        category = 'College';
      else if (content.includes('commit') || content.includes('high school')) category = 'HS';

      const titleParts = item.title.split(' - ');

      const { error } = await supabase.from('lacrosse_news').upsert(
        {
          title: titleParts[0],
          link: item.link,
          summary: item.contentSnippet?.slice(0, 500) || '',
          source: titleParts[1] || 'Lax News',
          category: category,
          published_at: item.pubDate
            ? new Date(item.pubDate).toISOString()
            : new Date().toISOString(),
        },
        { onConflict: 'link' }
      );

      if (!error) count++;
    }

    return new Response(`Successfully updated ${count} stories!`, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return new Response(`Update failed: ${error.message}`, { status: 500 });
  }
}
