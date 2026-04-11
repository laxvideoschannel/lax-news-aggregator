export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawUrl = searchParams.get('url');
  if (!rawUrl) return Response.json({ image: null });

  try {
    let articleUrl = rawUrl;
    if (rawUrl.includes('news.google.com')) {
      const articleId = rawUrl.split('/articles/')[1]?.split('?')[0];
      if (articleId) {
        const b64 = articleId.replace(/-/g, '+').replace(/_/g, '/');
        const pad = b64.length % 4;
        const decoded = Buffer.from(pad ? b64 + '='.repeat(4 - pad) : b64, 'base64').toString('latin1');
        const match = decoded.match(/https?:\/\/[^\x00-\x1f\s"'<>]+/);
        if (match?.[0] && !match[0].includes('news.google.com')) articleUrl = match[0];
      }
    }

    const ctrl = new AbortController();
    setTimeout(() => ctrl.abort(), 6000);
    const res = await fetch(articleUrl, {
      headers: {
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'accept': 'text/html,application/xhtml+xml,*/*;q=0.8',
        'accept-language': 'en-US,en;q=0.9',
        'referer': 'https://www.google.com/',
      },
      redirect: 'follow',
      signal: ctrl.signal,
    });
    if (!res.ok) return Response.json({ image: null });

    const finalUrl = res.url || articleUrl;
    const html = await res.text();

    const patterns = [
      /<meta[^>]+property=[\"']og:image[\"'][^>]+content=[\"']([^\"']+)[\"']/i,
      /<meta[^>]+content=[\"']([^\"']+)[\"'][^>]+property=[\"']og:image[\"']/i,
      /<meta[^>]+property=[\"']og:image:secure_url[\"'][^>]+content=[\"']([^\"']+)[\"']/i,
      /<meta[^>]+name=[\"']twitter:image[\"'][^>]+content=[\"']([^\"']+)[\"']/i,
      /<meta[^>]+content=[\"']([^\"']+)[\"'][^>]+name=[\"']twitter:image[\"']/i,
    ];
    for (const pattern of patterns) {
      const m = html.match(pattern);
      if (m?.[1] && !m[1].startsWith('data:')) {
        const img = new URL(m[1], finalUrl).toString();
        if (!img.includes('favicon') && !img.includes('1x1') && !img.includes('pixel') && img.startsWith('http')) {
          return Response.json({ image: img });
        }
      }
    }

    const jldBlocks = html.match(/<script[^>]+type=[\"']application\/ld\+json[\"'][^>]*>([\s\S]*?)<\/script>/gi) || [];
    for (const block of jldBlocks) {
      try {
        const s = JSON.parse(block.replace(/<\/?script[^>]*>/gi, ''));
        const schemas = Array.isArray(s) ? s : [s];
        for (const sc of schemas) {
          const img = sc?.image?.url || (Array.isArray(sc?.image) && sc.image[0]?.url) || (typeof sc?.image === 'string' && sc.image);
          if (typeof img === 'string' && img.startsWith('http')) return Response.json({ image: img });
        }
      } catch { /* ignore */ }
    }

    return Response.json({ image: null });
  } catch {
    return Response.json({ image: null });
  }
}
