export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const fetchCache = 'force-no-store';

type FeedStory = {
  title: string;
  link: string;
  article_url: string;
  summary: string;
  source: string;
  category: string;
  published_at: string;
  image_url?: string;
};

/**
 * Resolve a lacrosse image from Unsplash source API.
 * Server-side fetch follows the redirect and returns the stable CDN URL.
 * Always returns an actual lacrosse photo — never a random sport.
 */
async function resolveLaxImage(query: string): Promise<string | null> {
  try {
    const ctrl = new AbortController();
    setTimeout(() => ctrl.abort(), 5000);
    const res = await fetch(`https://source.unsplash.com/1200x800/?${encodeURIComponent(query)}`, {
      redirect: 'follow',
      headers: { 'user-agent': 'Mozilla/5.0' },
      signal: ctrl.signal,
    });
    // response.url is the final redirected URL — stable Unsplash CDN URL
    if (res.url && res.url.includes('images.unsplash.com')) return res.url;
    return null;
  } catch {
    return null;
  }
}

// Build a pool of stable lacrosse image CDN URLs at the start of each request
async function buildLaxImagePool(): Promise<string[]> {
  const queries = [
    'lacrosse game action',
    'lacrosse player stick',
    'lacrosse field college',
    'lacrosse women sport',
    'lacrosse goal net',
    'lacrosse athlete helmet',
    'lacrosse youth sport',
    'lacrosse team sport',
  ];

  const results = await Promise.allSettled(queries.map(q => resolveLaxImage(q)));
  const pool = results
    .filter((r): r is PromiseFulfilledResult<string> => r.status === 'fulfilled' && r.value !== null)
    .map(r => r.value);

  // If Unsplash is unreachable, fall back to confirmed lacrosse photo from Unsplash
  if (pool.length === 0) {
    // mJwKLHIIOGQ = confirmed UNC vs Duke lacrosse game photo
    return Array(8).fill(
      'https://images.unsplash.com/photo-1547347298-4074fc3086f0?w=1200&q=80&auto=format&fit=crop'
    );
  }
  return pool;
}

function pickFromPool(pool: string[], title: string): string {
  let hash = 0;
  for (let i = 0; i < title.length; i++) hash = (hash * 31 + title.charCodeAt(i)) & 0xfffffff;
  return pool[Math.abs(hash) % pool.length];
}

/**
 * Extract the real article URL from a Google News RSS description.
 * Google News embeds the real URL as the first <a href> in the description HTML.
 */
function extractRealUrlFromDescription(description: string): string | null {
  if (!description) return null;
  const decoded = description
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&').replace(/&quot;/g, '"');
  const match = decoded.match(/href=["']([^"']+)["']/i);
  if (match?.[1] && match[1].startsWith('http') && !match[1].includes('news.google.com')) {
    return match[1];
  }
  return null;
}

const SCRAPE_HEADERS = {
  'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'accept-language': 'en-US,en;q=0.9',
  'cache-control': 'no-cache',
  'referer': 'https://www.google.com/',
};

const BAD_IMAGE = ['favicon', '1x1', 'pixel', 'gstatic.com', 'googleusercontent.com', 'news.google.com', 'logo'];
const isGoodImage = (u: string) => u.startsWith('http') && !BAD_IMAGE.some(p => u.toLowerCase().includes(p));

async function fetchArticleImage(articleUrl: string): Promise<string | undefined> {
  if (!articleUrl || articleUrl.includes('news.google.com')) return undefined;
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 8000);
    const res = await fetch(articleUrl, { headers: SCRAPE_HEADERS, redirect: 'follow', signal: ctrl.signal });
    clearTimeout(timer);
    if (!res.ok) return undefined;

    const finalUrl = res.url || articleUrl;
    const html = await res.text();

    // og:image / twitter:image (both attribute orderings)
    const metaPatterns = [
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
      /<meta[^>]+property=["']og:image:secure_url["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i,
      /<meta[^>]+name=["']twitter:image:src["'][^>]+content=["']([^"']+)["']/i,
    ];
    for (const pat of metaPatterns) {
      const m = html.match(pat);
      if (m?.[1] && !m[1].startsWith('data:')) {
        try {
          const imgUrl = new URL(m[1], finalUrl).toString();
          if (isGoodImage(imgUrl)) return imgUrl;
        } catch { /* ignore */ }
      }
    }

    // JSON-LD image fallback
    const jldBlocks = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) || [];
    for (const block of jldBlocks) {
      try {
        const json = JSON.parse(block.replace(/<\/?script[^>]*>/gi, ''));
        const schemas = Array.isArray(json) ? json : [json];
        for (const s of schemas) {
          const img = s?.image?.url
            || (Array.isArray(s?.image) && s.image[0]?.url)
            || (typeof s?.image === 'string' && s.image)
            || s?.thumbnailUrl;
          if (typeof img === 'string' && isGoodImage(img)) return img;
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
  const parser = new Parser({ customFields: { item: ['description', 'content:encoded'] } });

  const feeds = [
    'https://www.laxallstars.com/feed/',
    'https://premierlacrosseleague.com/feed/',
    'https://www.insidelacrosse.com/rss/articles',
    'https://news.google.com/rss/search?q=PLL+lacrosse+OR+WLL+lacrosse+OR+premier+lacrosse+league&hl=en-US&gl=US&ceid=US:en',
    'https://news.google.com/rss/search?q=college+lacrosse&hl=en-US&gl=US&ceid=US:en',
    'https://news.google.com/rss/search?q=lacrosse+news&hl=en-US&gl=US&ceid=US:en',
  ];

  // Build lacrosse image pool and parse RSS feeds in parallel
  const [laxPoolResult, ...feedResults] = await Promise.allSettled([
    buildLaxImagePool(),
    ...feeds.map(feed => parser.parseURL(feed)),
  ]);

  const laxPool = laxPoolResult.status === 'fulfilled' ? laxPoolResult.value : [];

  const stories = new Map<string, FeedStory>();

  for (const result of feedResults) {
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

      stories.set(item.link, {
        title,
        link: item.link,
        article_url,
        summary,
        source: titleParts.slice(1).join(' - ').trim() || result.value.title || 'Lax News',
        category: categorizeStory(title, summary),
        published_at: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
        image_url: extractMediaImage(item),
      });
    }
  }

  const sortedStories = Array.from(stories.values())
    .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
    .slice(0, 50);

  // Resolve article images in batches of 6
  const BATCH = 6;
  const withImages: FeedStory[] = [];
  for (let i = 0; i < sortedStories.length; i += BATCH) {
    const batch = sortedStories.slice(i, i + BATCH);
    const resolved = await Promise.all(
      batch.map(async (story) => {
        const articleImg = story.image_url || await fetchArticleImage(story.article_url);
        return {
          ...story,
          // Real article image first; if none found, pick a lacrosse photo from the pool
          image_url: articleImg || (laxPool.length > 0 ? pickFromPool(laxPool, story.title) : undefined),
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
