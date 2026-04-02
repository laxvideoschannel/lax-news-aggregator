// This code goes in your Next.js project at: /app/api/fetch-news/route.ts
import { createClient } from '@supabase/supabase-js'
import Parser from 'rss-parser'

const parser = new Parser();
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

// The list of Lacrosse News Sources
const FEEDS = [
  { name: 'Inside Lacrosse', url: 'https://www.insidelacrosse.com/rss/news' },
  { name: 'USA Lacrosse', url: 'https://www.usalacrosse.com/rss.xml' },
  // We can add more specific PLL/WLL/College feeds here
];

export async function GET() {
  try {
    for (const feed of FEEDS) {
      const data = await parser.parseURL(feed.url);
      
      for (const item of data.items) {
        // AI Logic: Determine the category based on keywords
        let category = 'General';
        const content = (item.title + " " + item.contentSnippet).toLowerCase();
        
        if (content.includes('pll') || content.includes('wll') || content.includes('pro')) category = 'Pro';
        else if (content.includes('ncaa') || content.includes('d1') || content.includes('college')) category = 'College';
        else if (content.includes('commit') || content.includes('high school') || content.includes('prospect')) category = 'HS';

        // Insert into your Supabase table
        const { error } = await supabase
          .from('lacrosse_news')
          .upsert({
            title: item.title,
            link: item.link,
            summary: item.contentSnippet,
            source: feed.name,
            category: category,
            published_at: item.pubDate,
          }, { onConflict: 'link' }); // This prevent duplicates!
      }
    }
    
    return new Response('News Updated Successfully!', { status: 200 });
  } catch (error) {
    return new Response('Error updating news', { status: 500 });
  }
}
