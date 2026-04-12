export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export interface RosterPlayer {
  name: string;
  number: string;
  position: string;
  classYear: string;
  hometown: string;
  height?: string;
  weight?: string;
  imageUrl?: string;
}

// Sidearm Sports roster pages all share the same HTML patterns.
// We try several selectors to handle minor variations across schools.
function parseSidearmRoster(html: string, baseUrl: string): RosterPlayer[] {
  const players: RosterPlayer[] = [];

  // Each player is in a <li> or <div> with class "s-person-card" or "roster__item" or similar
  // Try matching the JSON-LD structured data first (most reliable)
  const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi);
  if (jsonLdMatch) {
    for (const block of jsonLdMatch) {
      try {
        const json = JSON.parse(block.replace(/<script[^>]*>|<\/script>/gi, ''));
        if (Array.isArray(json) || json['@type'] === 'Person') {
          const items = Array.isArray(json) ? json : [json];
          for (const item of items) {
            if (item['@type'] === 'Person' && item.name) {
              players.push({
                name: item.name,
                number: item.identifier || '',
                position: item.jobTitle || '',
                classYear: item.alumniOf?.name || '',
                hometown: item.birthPlace?.name || '',
                imageUrl: item.image || undefined,
              });
            }
          }
          if (players.length > 0) return players;
        }
      } catch { /* continue */ }
    }
  }

  // Sidearm HTML pattern: each player block contains data-* attributes or structured divs
  // Pattern 1: <li class="s-person-card ...">
  const cardPattern = /<li[^>]+class="[^"]*s-person-card[^"]*"[^>]*>([\s\S]*?)<\/li>/gi;
  // Pattern 2: <div class="roster__item ..."> or <div class="s-person-details ...">
  const divPattern = /<div[^>]+class="[^"]*(?:roster__item|s-person-details)[^"]*"[^>]*>([\s\S]*?)<\/div>/gi;

  const blocks: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = cardPattern.exec(html)) !== null) blocks.push(m[1]);
  if (blocks.length === 0) {
    while ((m = divPattern.exec(html)) !== null) blocks.push(m[1]);
  }

  for (const block of blocks) {
    const name = extractText(block, [
      /class="[^"]*s-person-details__personal-single-line[^"]*"[^>]*>([^<]+)/i,
      /class="[^"]*roster-card__name[^"]*"[^>]*>([^<]+)/i,
      /<h2[^>]*>([^<]+)<\/h2>/i,
      /<h3[^>]*>([^<]+)<\/h3>/i,
    ]);
    if (!name) continue;

    const number = extractText(block, [
      /class="[^"]*s-person-card__content__jersey[^"]*"[^>]*>([^<]+)/i,
      /class="[^"]*roster__number[^"]*"[^>]*>([^<]+)/i,
      /data-jersey="([^"]+)"/i,
    ]);

    const position = extractText(block, [
      /class="[^"]*s-person-card__content__position[^"]*"[^>]*>([^<]+)/i,
      /class="[^"]*roster__position[^"]*"[^>]*>([^<]+)/i,
      /Position<\/[^>]+>\s*<[^>]+>([^<]+)/i,
    ]);

    const classYear = extractText(block, [
      /class="[^"]*s-person-card__content__class[^"]*"[^>]*>([^<]+)/i,
      /class="[^"]*roster__year[^"]*"[^>]*>([^<]+)/i,
      /Year<\/[^>]+>\s*<[^>]+>([^<]+)/i,
    ]);

    const hometown = extractText(block, [
      /class="[^"]*s-person-card__content__hometown[^"]*"[^>]*>([^<]+)/i,
      /class="[^"]*roster__hometown[^"]*"[^>]*>([^<]+)/i,
      /Hometown<\/[^>]+>\s*<[^>]+>([^<]+)/i,
    ]);

    const height = extractText(block, [
      /class="[^"]*roster__height[^"]*"[^>]*>([^<]+)/i,
      /Height<\/[^>]+>\s*<[^>]+>([^<]+)/i,
    ]);

    const weight = extractText(block, [
      /class="[^"]*roster__weight[^"]*"[^>]*>([^<]+)/i,
      /Weight<\/[^>]+>\s*<[^>]+>([^<]+)/i,
    ]);

    const imgMatch = block.match(/<img[^>]+src="([^"]+)"/i);
    let imageUrl: string | undefined;
    if (imgMatch?.[1]) {
      const src = imgMatch[1];
      imageUrl = src.startsWith('http') ? src : new URL(src, baseUrl).toString();
      // Skip generic placeholder images
      if (imageUrl.includes('placeholder') || imageUrl.includes('silhouette') || imageUrl.includes('default')) {
        imageUrl = undefined;
      }
    }

    players.push({
      name: name.trim(),
      number: (number || '').trim(),
      position: (position || '').trim(),
      classYear: (classYear || '').trim(),
      hometown: (hometown || '').trim(),
      height: height?.trim(),
      weight: weight?.trim(),
      imageUrl,
    });
  }

  return players;
}

function extractText(html: string, patterns: RegExp[]): string | undefined {
  for (const pattern of patterns) {
    const m = html.match(pattern);
    if (m?.[1]) {
      // Strip any remaining HTML tags and decode entities
      return m[1]
        .replace(/<[^>]+>/g, '')
        .replace(/&amp;/g, '&')
        .replace(/&nbsp;/g, ' ')
        .replace(/&#39;/g, "'")
        .replace(/&quot;/g, '"')
        .trim();
    }
  }
  return undefined;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return Response.json({ error: 'Missing url param' }, { status: 400 });
  }

  // Only allow known college athletics domains
  const allowedDomains = [
    'goduke.com', 'cuse.com', 'fightingirish.com', 'virginiasports.com',
    'umterps.com', 'goprincetontigers.com', 'athletics.harvard.edu',
    'yalebulldogs.com', 'cornellbigred.com', 'hopkinssports.com',
    'pennathletics.com', 'dartmouthsports.com', 'columbiasports.com',
    'brownbears.com', 'bearcats.com', 'denverpioneers.com',
    'clemsontigers.com', 'bceagles.com', 'nusports.com', 'goheels.com',
  ];
  const hostname = new URL(url).hostname.replace('www.', '');
  if (!allowedDomains.some((d) => hostname.endsWith(d))) {
    return Response.json({ error: 'Domain not allowed' }, { status: 403 });
  }

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LaxHubBot/1.0; +https://laxhub.com)',
        'Accept': 'text/html,application/xhtml+xml',
      },
      next: { revalidate: 60 * 60 * 6 }, // cache 6 hours
    });

    if (!res.ok) {
      return Response.json({ error: `Upstream ${res.status}` }, { status: 502 });
    }

    const html = await res.text();
    const players = parseSidearmRoster(html, url);

    return Response.json({ players, source: url, count: players.length });
  } catch (err) {
    return Response.json({ error: 'Fetch failed', detail: String(err) }, { status: 500 });
  }
}
