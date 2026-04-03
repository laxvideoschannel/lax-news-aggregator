import { createClient } from '@supabase/supabase-js'
import Parser from 'rss-parser'

const parser = new Parser();

export async function GET() {
  // Initialize Supabase inside the function to ensure Env Vars are loaded
  const supabase = createClient(
    process.env.SUPABASE_URL || '', 
    process.env.SUPABASE_ANON_KEY || ''
  );

  const FEEDS = [
    { name: 'Inside Lacrosse', url: 'https://www.insidelacrosse.com/rss/news' },
    { name: 'USA Lacrosse', url: 'https://www.usalacrosse.com/rss.xml' },
  ];

  try {
    let count = 0;

    for (const feed of FEEDS) {
      const data = await parser.parseURL(feed.url);
      
      for (const item of data.items) {
        if (!item.link || !item.title) continue; // Skip if data is missing

        // Automatically categorize
        let category = 'General';
        const content = (item.title + " " + (item.contentSnippet || "")).toLowerCase();
        if (content.includes('pll') || content.includes('wll') || content.includes('pro')) category = 'Pro';
        else if (content.includes('ncaa') || content.includes('d1') || content.includes('college')) category = 'College';
        else if (content.includes('commit') || content.includes('high school') || content.includes('prospect')) category = 'HS';

        // Attempt to save to Supabase
        const { error } = await supabase
          .from('lacrosse_news')
          .upsert({
            title: item.title,
            link: item.link,
            summary: item.contentSnippet?.slice(0, 500) || "", // Limit text length
            source: feed.name,
            category: category,
            published_at: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
          }, { onConflict: 'link' });

        if (error) {
           console.error("Supabase Error:", error.message);
           return new Response(`Supabase Error: ${error.message}`, { status: 500 });
        }
        count++;
      }
    }
    
    return new Response(`Successfully updated ${count} stories!`, { status: 200 });

  } catch (error: any) {
    console.error("General Error:", error);
    return new Response(`Fetch Error: ${error.message}`, { status: 500 });
  }
}
