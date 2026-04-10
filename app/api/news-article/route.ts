export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

async function decodeGoogleNewsUrl(gnUrl: string): Promise<string> {
  if (!gnUrl.includes('news.google.com')) return gnUrl;
  try {
    const articleId = gnUrl.split('/articles/')[1]?.split('?')[0];
    if (articleId) {
      const padded = articleId.replace(/-/g, '+').replace(/_/g, '/');
      const pad = padded.length % 4;
      const base64 = pad ? padded + '='.repeat(4 - pad) : padded;
      const decoded = Buffer.from(base64, 'base64').toString('latin1');
      const urlMatch = decoded.match(/https?:\/\/[^\x00-\x1f\s"'<>]+/);
      if (urlMatch?.[0] && !urlMatch[0].includes('news.google.com')) {
        return urlMatch[0];
      }
    }
  } catch { /* ignore */ }
  return gnUrl;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) return Response.json({ error: 'No URL provided' }, { status: 400 });

  try {
    // Decode Google News redirects first
    const resolvedUrl = await decodeGoogleNewsUrl(url);

    // Fetch the article HTML
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const response = await fetch(resolvedUrl, {
      headers: {
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'accept-language': 'en-US,en;q=0.5',
      },
      redirect: 'follow',
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!response.ok) {
      return Response.json({ error: 'Could not fetch article', canEmbed: false }, { status: 200 });
    }

    const finalUrl = response.url || url;
    const html = await response.text();

    // Extract og:image from the article
    const ogImageMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
    const image = ogImageMatch?.[1] ? new URL(ogImageMatch[1], finalUrl).toString() : null;

    // Extract og:description
    const ogDescMatch = html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:description["']/i)
      || html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i);
    const description = ogDescMatch?.[1] || null;

    // Use Claude to extract main article content from HTML
    const aiResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        system: `You extract the main article body from HTML. 
Return ONLY a JSON object (no markdown, no backticks) with these fields:
{
  "title": "article title",
  "author": "author name or null",
  "paragraphs": ["paragraph 1 text", "paragraph 2 text", ...],
  "wordCount": approximate word count as number
}
Extract only the actual article text paragraphs (not nav, ads, related articles, comments, or boilerplate). 
Keep all factual content. Return at least 3 paragraphs if available. Max 8 paragraphs.`,
        messages: [{
          role: 'user',
          content: `Extract the main article content from this HTML (from URL: ${finalUrl}):\n\n${html.slice(0, 60000)}`,
        }],
      }),
    });

    const aiData = await aiResponse.json();
    const aiText = aiData.content?.[0]?.text || '';

    let article: any = {};
    try {
      article = JSON.parse(aiText.replace(/```json|```/g, '').trim());
    } catch {
      // If AI parse fails, return minimal data
      return Response.json({
        title: null,
        author: null,
        paragraphs: [],
        image,
        description,
        sourceUrl: finalUrl,
        canEmbed: false,
      });
    }

    return Response.json({
      ...article,
      image,
      description,
      sourceUrl: finalUrl,
      canEmbed: true,
    });

  } catch {
    return Response.json({ error: 'Failed', canEmbed: false }, { status: 200 });
  }
}
