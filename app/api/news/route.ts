export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const fetchCache = 'force-no-store';

type FeedStory = {
  title: string;
  link: string;
  summary: string;
  source: string;
  category: string;
  published_at: string;
  image_url?: string;
};

function extractImageUrl(item: any) {
  const mediaContent = item?.['media:content'];
  if (Array.isArray(mediaContent) && mediaContent[0]?.$?.url) return mediaContent[0].$.url;
  if (mediaContent?.$?.url) return mediaContent.$.url;

  const enclosure = item?.enclosure;
  if (enclosure?.url && `${enclosure.type || ''}`.startsWith('image/')) return enclosure.url;

  const content = `${item?.content || ''} ${item?.contentSnippet || ''}`;
  const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (imgMatch?.[1]) return imgMatch[1];

  return undefined;
}

function categorizeStory(title: string, summary: string) {
  const content = `${title} ${summary}`.toLowerCase();

  if (
    content.includes('pll') ||
    content.includes('wll') ||
    content.includes('premier lacrosse league') ||
    content.includes('women\'s lacrosse league') ||
    content.includes('chaos') ||
    content.includes('archers') ||
    content.includes('cannons') ||
    content.includes('outlaws')
  ) {
    return 'Pro';
  }

  if (
    content.includes('ncaa') ||
    content.includes('college') ||
    content.includes('division i') ||
    content.includes('d1')
  ) {
    return 'College';
  }

  if (content.includes('high school') || content.includes('commit') || content.includes('recruit')) {
    return 'HS';
  }

  return 'General';
}

async function getFallbackFeedStories(): Promise<FeedStory[]> {
  const { default: Parser } = await import('rss-parser');
  const parser = new Parser();
  const feeds = [
    'https://news.google.com/rss/search?q=PLL+lacrosse+OR+WLL+lacrosse+OR+premier+lacrosse+league&hl=en-US&gl=US&ceid=US:en',
    'https://news.google.com/rss/search?q=lacrosse+news&hl=en-US&gl=US&ceid=US:en',
  ];

  const results = await Promise.allSettled(feeds.map((feed) => parser.parseURL(feed)));
  const stories = new Map<string, FeedStory>();

  for (const result of results) {
    if (result.status !== 'fulfilled') continue;

    for (const item of result.value.items) {
      if (!item.link || !item.title) continue;

      const titleParts = item.title.split(' - ');
      const title = titleParts[0]?.trim() || item.title.trim();
      const summary = item.contentSnippet?.slice(0, 500) || '';

      stories.set(item.link, {
        title,
        link: item.link,
        summary,
        source: titleParts.slice(1).join(' - ').trim() || 'Lax News',
        category: categorizeStory(title, summary),
        published_at: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
        image_url: extractImageUrl(item),
      });
    }
  }

  return Array.from(stories.values())
    .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
    .slice(0, 50);
}

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

  if (!url || !key || url.includes('placeholder') || key.includes('placeholder')) {
    try {
      return Response.json(await getFallbackFeedStories());
    } catch {
      return Response.json([]);
    }
  }

  try {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(url, key);

    const { data, error } = await supabase
      .from('lacrosse_news')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(50);

    if (error || !data?.length) {
      return Response.json(await getFallbackFeedStories());
    }

    return Response.json(data);
  } catch {
    try {
      return Response.json(await getFallbackFeedStories());
    } catch {
      return Response.json([]);
    }
  }
}
