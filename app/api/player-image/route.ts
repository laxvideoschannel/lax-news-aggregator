const CACHE_SECONDS = 60 * 60 * 24;

function extractImageUrl(html: string, pageUrl: string) {
  const patterns = [
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
    /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) {
      return new URL(match[1], pageUrl).toString();
    }
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
    const pageResponse = await fetch(pageUrl, {
      headers: {
        'user-agent': 'Mozilla/5.0 (compatible; LaxHubBot/1.0)',
      },
      next: { revalidate: CACHE_SECONDS },
    });

    if (!pageResponse.ok) {
      return new Response('Unable to fetch player page', { status: 502 });
    }

    const html = await pageResponse.text();
    const imageUrl = extractImageUrl(html, pageUrl);

    if (!imageUrl) {
      return new Response('No image found on player page', { status: 404 });
    }

    const imageResponse = await fetch(imageUrl, {
      headers: {
        referer: pageUrl,
        'user-agent': 'Mozilla/5.0 (compatible; LaxHubBot/1.0)',
      },
      next: { revalidate: CACHE_SECONDS },
    });

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
