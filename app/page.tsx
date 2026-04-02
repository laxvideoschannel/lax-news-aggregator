import { createClient } from '@supabase/supabase-js'

export const revalidate = 0; // Ensures it shows latest data

export default async function Home() {
  const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);
  const { data: news } = await supabase.from('lacrosse_news').select('*').order('published_at', { ascending: false });

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1>🥍 Lacrosse News Hub</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {news?.map((item) => (
          <div key={item.id} style={{ borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'blue', fontWeight: 'bold' }}>{item.category}</span>
            <h2 style={{ margin: '0.5rem 0' }}><a href={item.link} target="_blank">{item.title}</a></h2>
            <p style={{ color: '#666' }}>{item.summary}</p>
            <small>Source: {item.source} | {new Date(item.published_at).toLocaleDateString()}</small>
          </div>
        ))}
      </div>
    </main>
  );
}
