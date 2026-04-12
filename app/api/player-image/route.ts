const CACHE_SECONDS = 60 * 60 * 24;

function extractImageUrl(html: string, pageUrl: string): string | null {
  const patterns = [
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
    /<meta[^>]+property=["']og:image:secure_url["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i,
    /<meta[^>]+name=["']twitter:image:src["'][^>]+content=["']([^"']+)["']/i,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1] && !match[1].startsWith('data:') && match[1].startsWith('http')) {
      try {
        const resolved = new URL(match[1], pageUrl).toString();
        if (!resolved.includes('favicon') && !resolved.includes('1x1') && !resolved.includes('pixel')) {
          return resolved;
        }
      } catch { /* ignore */ }
    }
  }

  // Try JSON-LD schema
  const jldBlocks = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) || [];
  for (const block of jldBlocks) {
    try {
      const json = JSON.parse(block.replace(/<\/?script[^>]*>/gi, ''));
      const schemas = Array.isArray(json) ? json : [json];
      for (const schema of schemas) {
        const img =
          schema?.image?.url ||
          (Array.isArray(schema?.image) && schema.image[0]?.url) ||
          (typeof schema?.image === 'string' && schema.image) ||
          schema?.thumbnailUrl;
        if (typeof img === 'string' && img.startsWith('http')) return img;
      }
    } catch { /* ignore */ }
  }

  return null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pageUrl = searchParams.get('url');

  if (!pageUrl) {
    return new Response('Missing url parameter', { status: 400 });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const pageResponse = await fetch(pageUrl, {
      headers: {
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'accept-language': 'en-US,en;q=0.9',
        'referer': 'https://www.google.com/',
      },
      redirect: 'follow',
      signal: controller.signal,
      next: { revalidate: CACHE_SECONDS },
    });

    clearTimeout(timeout);

    if (!pageResponse.ok) {
      return new Response('Unable to fetch player page', { status: 502 });
    }

    const html = await pageResponse.text();
    const finalUrl = pageResponse.url || pageUrl;
    const imageUrl = extractImageUrl(html, finalUrl);

    if (!imageUrl) {
      return new Response('No image found on player page', { status: 404 });
    }

    const imgController = new AbortController();
    const imgTimeout = setTimeout(() => imgController.abort(), 8000);

    const imageResponse = await fetch(imageUrl, {
      headers: {
        referer: finalUrl,
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
      },
      next: { revalidate: CACHE_SECONDS },
      signal: imgController.signal,
    });

    clearTimeout(imgTimeout);

    if (!imageResponse.ok) {
      return new Response('Unable to fetch player image', { status: 502 });
    }

    const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';

    return new Response(imageResponse.body, {
      headers: {
        'content-type': contentType,
        'cache-control': `public, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=${CACHE_SECONDS}`,
      },
    });
  } catch {
    return new Response('Failed to load player image', { status: 500 });
  }
}
