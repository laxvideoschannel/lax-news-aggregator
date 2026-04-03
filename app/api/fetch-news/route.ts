import { createClient } from '@supabase/supabase-js'
import Parser from 'rss-parser'

const parser = new Parser();

export async function GET() {
  const supabase = createClient(
    process.env.SUPABASE_URL || '', 
    process.env.SUPABASE_ANON_KEY || ''
  );

  // We are asking Google News for Lacrosse stories from the last 24 hours
  const GOOGLE_NEWS_RSS = "https://news.google.com/rss/search?q=lacrosse+news+when:24h&hl=en-US&gl=US&ceid=US:en";

  try {
    const data = await parser.parseURL(GOOGLE_NEWS_RSS);
    let count = 0;

    for (const item of data.items) {
      if (!item.link || !item.title) continue;

      // Smart Categorization Logic
      let category = 'General';
      const content = (item.title + " " + (item.contentSnippet || "")).toLowerCase();
      
      if (content.includes('pll') || content.includes('wll') || content.includes('pro')) category = 'Pro';
      else if (content.includes('ncaa') || content.includes('d1') || content.includes('college')) category = 'College';
      else if (content.includes('commit') || content.includes('high school') || content.includes('prospect') || content.includes('varsity')) category = 'HS';

      // Source cleanup (Google News adds the source to the title like "Title - Source")
      const titleParts = item.title.split(' - ');
      const cleanTitle = titleParts[0];
      const sourceName = titleParts[1] || "Lax News";

      const { error } = await supabase
        .from('lacrosse_news')
        .upsert({
          title: cleanTitle,
          link: item.link,
          summary: item.contentSnippet?.slice(0, 500) || "",
          source: sourceName,
          category: category,
          published_at: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
        }, { onConflict: 'link' });

      if (error) {
        console.error("Supabase Error:", error.message);
        continue; // Keep going if one fails
      }
      count++;
    }
    
    return new Response(`Successfully updated ${count} stories from Google News!`, { status: 200 });

  } catch (error: any) {
    return new Response(`Fetch Error: ${error.message}`, { status: 500 });
  }
}
