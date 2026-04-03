import { createClient } from '@supabase/supabase-js'
import Parser from 'rss-parser'

// This line is CRITICAL. It tells Vercel not to "pre-render" this page.
export const dynamic = 'force-dynamic';

const parser = new Parser();

export async function GET() {
  // Use the NEW variable names we set in Vercel
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '', 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );

  const GOOGLE_NEWS_RSS = "https://news.google.com/rss/search?q=lacrosse+news+when:24h&hl=en-US&gl=US&ceid=US:en";

  try {
    const data = await parser.parseURL(GOOGLE_NEWS_RSS);
    let count = 0;

    for (const item of data.items) {
      if (!item.link || !item.title) continue;

      let category = 'General';
      const content = (item.title + " " + (item.contentSnippet || "")).toLowerCase();
      if (content.includes('pll') || content.includes('wll') || content.includes('pro')) category = 'Pro';
      else if (content.includes('ncaa') || content.includes('d1') || content.includes('college')) category = 'College';
      else if (content.includes('commit') || content.includes('high school')) category = 'HS';

      const titleParts = item.title.split(' - ');
      const { error } = await supabase
        .from('lacrosse_news')
        .upsert({
          title: titleParts[0],
          link: item.link,
          summary: item.contentSnippet?.slice(0, 500) || "",
          source: titleParts[1] || "Lax News",
          category: category,
          published_at: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
        }, { onConflict: 'link' });

      if (!error) count++;
    }
    
    return new Response(`Updated ${count} stories!`, { status: 200 });
  } catch (error: any) {
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
}
