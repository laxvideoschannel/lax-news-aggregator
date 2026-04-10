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

// Decode Google News redirect URLs to get the real article URL
async function decodeGoogleNewsUrl(gnUrl: string): Promise<string> {
  if (!gnUrl.includes('news.google.com')) return gnUrl;
  try {
    // Google News RSS items link to news.google.com/rss/articles/CB...
    // The actual URL can sometimes be extracted from the feed item's <guid> or by
    // hitting the Google News redirect endpoint with a HEAD request
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 5000);
    const res = await fetch(gnUrl, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'user-agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      },
    });
    const finalUrl = res.url;
    // If redirect landed on a non-google URL, use it
    if (finalUrl && !finalUrl.includes('news.google.com') && !finalUrl.includes('google.com/search')) {
      return finalUrl;
    }
    // Fallback: try extracting from HTML canonical link
    const html = await res.text();
    const canonical = html.match(/<link[^>]+rel=[\"']canonical[\"'][^>]+href=[\"']([^\"']+)[\"']/i)?.[1];
    if (canonical && !canonical.includes('news.google.com')) return canonical;
  } catch { /* ignore */ }
  return gnUrl;
}

async function resolveArticleImage(url: string): Promise<string | undefined> {
  try {
    // Decode Google News redirect first
    const resolvedUrl = await decodeGoogleNewsUrl(url);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const response = await fetch(resolvedUrl, {
      headers: {
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'accept-language': 'en-US,en;q=0.5',
        'referer': 'https://www.google.com/',
      },
      redirect: 'follow',
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!response.ok) return undefined;

    const finalUrl = response.url || url;
    const html = await response.text();

    // Try og:image and twitter:image meta tags (both attribute orderings)
    const metaPatterns = [
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
      /<meta[^>]+property=["']og:image:secure_url["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i,
    ];
    for (const pattern of metaPatterns) {
      const match = html.match(pattern);
      if (match?.[1] && !match[1].startsWith('data:')) {
        const imgUrl = new URL(match[1], finalUrl).toString();
        if (!imgUrl.includes('favicon') && !imgUrl.includes('1x1') && !imgUrl.includes('pixel')) {
          return imgUrl;
        }
      }
    }

    // Try JSON-LD schema for article image
    const jsonLdMatch = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i);
    if (jsonLdMatch?.[1]) {
      try {
        const schema = JSON.parse(jsonLdMatch[1]);
        const img = schema?.image?.url || (Array.isArray(schema?.image) && schema.image[0]?.url) || (typeof schema?.image === 'string' && schema.image);
        if (typeof img === 'string' && img.startsWith('http')) return img;
      } catch { /* ignore */ }
    }

    return undefined;
  } catch {
    return undefined;
  }
}

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

  const sortedStories = Array.from(stories.values())
    .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
    .slice(0, 50);

  const withImages = await Promise.all(
    sortedStories.map(async (story) => ({
      ...story,
      image_url: story.image_url || await resolveArticleImage(story.link),
    })),
  );

  return withImages;
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
