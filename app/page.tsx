import { createClient } from '@supabase/supabase-js'

export const revalidate = 0;

export default async function Home() {
  const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);
  const { data: news } = await supabase.from('lacrosse_news').select('*').order('published_at', { ascending: false });

  // Separate news by category
  const categories = ['Pro', 'College', 'HS', 'General'];

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-900">
      {/* Header */}
      <header className="bg-black text-white p-6 shadow-xl border-b-4 border-blue-600">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-black italic tracking-tighter uppercase">LAX PULSE</h1>
          <div className="flex gap-4 text-sm font-bold uppercase tracking-widest text-gray-400">
            <span>PLL/WLL</span>
            <span>NCAA</span>
            <span>RECRUITING</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 md:p-8">
        {/* Featured Story */}
        {news && news.length > 0 && (
          <div className="bg-white rounded-lg shadow-2xl overflow-hidden mb-12 border-l-8 border-blue-600">
            <div className="p-8">
              <span className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-bold uppercase">{news[0].category}</span>
              <h2 className="text-4xl font-black mt-2 leading-tight">
                <a href={news[0].link} target="_blank" className="hover:text-blue-600 transition">{news[0].title}</a>
              </h2>
              <p className="mt-4 text-gray-600 text-lg leading-relaxed line-clamp-3">{news[0].summary}</p>
              <div className="mt-6 flex items-center text-sm font-bold text-gray-400 uppercase tracking-widest">
                <span>{news[0].source}</span>
                <span className="mx-2">•</span>
                <span>{new Date(news[0].published_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news?.slice(1, 20).map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow hover:shadow-xl transition p-6 flex flex-col justify-between border-t border-gray-100">
              <div>
                <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${
                  item.category === 'Pro' ? 'bg-orange-100 text-orange-600' : 
                  item.category === 'College' ? 'bg-green-100 text-green-600' : 
                  'bg-gray-100 text-gray-600'
                }`}>
                  {item.category}
                </span>
                <h3 className="font-bold text-lg mt-3 leading-snug line-clamp-2 underline decoration-blue-500/20 hover:decoration-blue-500">
                  <a href={item.link} target="_blank">{item.title}</a>
                </h3>
              </div>
              <div className="mt-4 flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <span>{item.source}</span>
                <span>{new Date(item.published_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="bg-black text-white p-12 mt-20 text-center text-xs text-gray-600 uppercase tracking-widest">
        © {new Date().getFullYear()} Lax Pulse • Automated Lacrosse News Hub
      </footer>
      
      {/* Tailwind Link */}
      <script src="https://cdn.tailwindcss.com"></script>
    </div>
  );
}
