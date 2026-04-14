export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const fetchCache = 'force-no-store';

type FeedStory = {
  title: string;
  link: string;
  article_url: string;  // real article URL (not Google News redirect)
  summary: string;
  source: string;
  category: string;
  published_at: string;
  image_url?: string;
};

// Lacrosse fallback images — confirmed Unsplash sport/action photo IDs
// Rotated deterministically by hashing the article title
const LAX_FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200&q=80&auto=format&fit=crop', // sport crowd stadium
  'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1200&q=80&auto=format&fit=crop', // basketball sport action
  'https://images.unsplash.com/photo-1594470117722-de4b9a02ebed?w=1200&q=80&auto=format&fit=crop', // sport action field
  'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1200&q=80&auto=format&fit=crop', // athlete running
  'https://images.unsplash.com/photo-1626248801379-51a0748a5f96?w=1200&q=80&auto=format&fit=crop', // sport athlete field
  'https://images.unsplash.com/photo-1547347298-4074fc3086f0?w=1200&q=80&auto=format&fit=crop', // sport field game
  'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&q=80&auto=format&fit=crop', // sport team
  'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=1200&q=80&auto=format&fit=crop', // athlete sport
  'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6?w=1200&q=80&auto=format&fit=crop', // basketball game
  'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=1200&q=80&auto=format&fit=crop', // green sport field
];

function getLaxFallbackImage(title: string): string {
  let hash = 0;
  for (let i = 0; i < title.length; i++) hash = (hash * 31 + title.charCodeAt(i)) & 0xfffffff;
  return LAX_FALLBACK_IMAGES[Math.abs(hash) % LAX_FALLBACK_IMAGES.length];
}

/**
 * Extract the real article URL from a Google News RSS item.
 * Google News RSS embeds the real URL as an <a href> inside the description HTML.
 */
function extractRealUrlFromDescription(description: string): string | null {
  if (!description) return null;
  const decoded = description
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"');
  const match = decoded.match(/href=["']([^"']+)["']/i);
  if (match?.[1] && match[1].startsWith('http') && !match[1].includes('news.google.com')) {
    return match[1];
  }
  return null;
}

async function fetchArticleImage(articleUrl: string): Promise<string | undefined> {
  if (!articleUrl || articleUrl.includes('news.google.com')) return undefined;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const response = await fetch(articleUrl, {
      headers: {
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'accept-language': 'en-US,en;q=0.5',
        'referer': 'https://www.google.com/',
      },
      redirect: 'follow',
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!response.ok) return undefined;

    const finalUrl = response.url || articleUrl;
    const html = await response.text();

    const BAD = ['favicon', '1x1', 'pixel', 'gstatic.com', 'googleusercontent.com', 'news.google.com'];
    const isGood = (u: string) => u.startsWith('http') && !BAD.some((p) => u.toLowerCase().includes(p));

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
        try {
          const imgUrl = new URL(match[1], finalUrl).toString();
          if (isGood(imgUrl)) return imgUrl;
        } catch { /* ignore */ }
      }
    }

    // JSON-LD fallback
    const jldBlocks = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) || [];
    for (const block of jldBlocks) {
      try {
        const json = JSON.parse(block.replace(/<\/?script[^>]*>/gi, ''));
        const schemas = Array.isArray(json) ? json : [json];
        for (const schema of schemas) {
          const img = schema?.image?.url
            || (Array.isArray(schema?.image) && schema.image[0]?.url)
            || (typeof schema?.image === 'string' && schema.image)
            || schema?.thumbnailUrl;
          if (typeof img === 'string' && img.startsWith('http') && isGood(img)) return img;
        }
      } catch { /* ignore */ }
    }

    return undefined;
  } catch {
    return undefined;
  }
}

function extractMediaImage(item: any): string | undefined {
  const mc = item?.['media:content'];
  if (Array.isArray(mc) && mc[0]?.$?.url) return mc[0].$.url;
  if (mc?.$?.url) return mc.$.url;
  const enc = item?.enclosure;
  if (enc?.url && `${enc.type || ''}`.startsWith('image/')) return enc.url;
  return undefined;
}

function categorizeStory(title: string, summary: string) {
  const c = `${title} ${summary}`.toLowerCase();
  if (c.includes('pll') || c.includes('wll') || c.includes('premier lacrosse') || c.includes("women's lacrosse league") || c.includes('chaos') || c.includes('archers') || c.includes('cannons') || c.includes('outlaws')) return 'Pro';
  if (c.includes('ncaa') || c.includes('college') || c.includes('division i') || c.includes('d1')) return 'College';
  if (c.includes('high school') || c.includes('commit') || c.includes('recruit')) return 'HS';
  return 'General';
}

async function getFallbackFeedStories(): Promise<FeedStory[]> {
  const { default: Parser } = await import('rss-parser');
  const parser = new Parser({
    customFields: { item: ['description', 'content:encoded'] },
  });

  const feeds = [
    'https://www.laxallstars.com/feed/',
    'https://premierlacrosseleague.com/feed/',
    'https://www.insidelacrosse.com/rss/articles',
    'https://news.google.com/rss/search?q=PLL+lacrosse+OR+WLL+lacrosse+OR+premier+lacrosse+league&hl=en-US&gl=US&ceid=US:en',
    'https://news.google.com/rss/search?q=college+lacrosse&hl=en-US&gl=US&ceid=US:en',
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

      const isGoogleNews = item.link.includes('news.google.com');
      const rawDescription = (item as any).description || (item as any)['content:encoded'] || '';
      const article_url = isGoogleNews
        ? (extractRealUrlFromDescription(rawDescription) || item.link)
        : item.link;

      const mediaImage = extractMediaImage(item);

      stories.set(item.link, {
        title,
        link: item.link,
        article_url,
        summary,
        source: titleParts.slice(1).join(' - ').trim() || result.value.title || 'Lax News',
        category: categorizeStory(title, summary),
        published_at: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
        image_url: mediaImage,
      });
    }
  }

  const sortedStories = Array.from(stories.values())
    .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
    .slice(0, 50);

  // Resolve images with concurrency limit (6 at a time)
  const BATCH = 6;
  const withImages: FeedStory[] = [];
  for (let i = 0; i < sortedStories.length; i += BATCH) {
    const batch = sortedStories.slice(i, i + BATCH);
    const resolved = await Promise.all(
      batch.map(async (story) => {
        const articleImg = story.image_url || await fetchArticleImage(story.article_url);
        return {
          ...story,
          // Use article image if found, otherwise deterministic lacrosse fallback
          image_url: articleImg || getLaxFallbackImage(story.title),
        };
      }),
    );
    withImages.push(...resolved);
  }

  return withImages;
}

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

  if (!url || !key || url.includes('placeholder') || key.includes('placeholder')) {
    try { return Response.json(await getFallbackFeedStories()); }
    catch { return Response.json([]); }
  }

  try {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(url, key);
    const { data, error } = await supabase.from('lacrosse_news').select('*').order('published_at', { ascending: false }).limit(50);
    if (error || !data?.length) return Response.json(await getFallbackFeedStories());
    return Response.json(data);
  } catch {
    try { return Response.json(await getFallbackFeedStories()); }
    catch { return Response.json([]); }
  }
}
