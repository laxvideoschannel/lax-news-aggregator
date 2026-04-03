"use client"; // This allows the site to be interactive
import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

// 1. DATABASE FOR TEAMS (We will add all teams here)
const TEAMS = {
  Default: { primary: '#2563eb', secondary: '#1e40af', logo: '🥍' },
  Maryland: { primary: '#E03A3E', secondary: '#FFCD00', logo: '🐢' },
  Syracuse: { primary: '#F76900', secondary: '#000E54', logo: '🍊' },
  UNC: { primary: '#7BAFD4', secondary: '#13294B', logo: '🐏' },
  'Archers LC': { primary: '#FF6B00', secondary: '#004AAD', logo: '🏹' },
  'WLL NY': { primary: '#000000', secondary: '#00FF00', logo: '🗽' },
};

export default function Home() {
  const [news, setNews] = useState<any[]>([]);
  const [selectedTeam, setSelectedTeam] = useState('Default');
  const theme = TEAMS[selectedTeam as keyof typeof TEAMS];

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!, 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    async function getData() {
      const { data } = await supabase.from('lacrosse_news').select('*').order('published_at', { ascending: false });
      if (data) setNews(data);
    }
    getData();
  }, []);

  return (
    <div className="min-h-screen transition-colors duration-500" style={{ backgroundColor: '#f9fafb' }}>
      
      {/* 2. THE DYNAMIC HEADER */}
      <header className="sticky top-0 z-50 shadow-lg text-white transition-all duration-500" style={{ backgroundColor: theme.primary, borderBottom: `4px solid ${theme.secondary}` }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <span className="text-3xl">{theme.logo}</span>
             <h1 className="text-2xl font-black uppercase italic tracking-tighter">Lax Pulse</h1>
          </div>
          
          {/* TEAM PICKER */}
          <select 
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="bg-white/10 border border-white/20 rounded px-3 py-1 text-xs font-bold uppercase tracking-widest outline-none focus:bg-white/20 transition"
          >
            {Object.keys(TEAMS).map(team => <option key={team} value={team} className="text-black">{team}</option>)}
          </select>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-10">
        
        {/* 3. HERO SECTION (BIG NEWS) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {news.length > 0 && (
            <div className="lg:col-span-2 group cursor-pointer relative overflow-hidden rounded-2xl bg-white shadow-xl">
              <div className="h-[400px] bg-gray-200 animate-pulse bg-cover bg-center transition group-hover:scale-105" 
                   style={{backgroundImage: `url('https://images.unsplash.com/photo-1515523110800-9415d13b84a8?q=80&w=1000&auto=format&fit=crop')`}}>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-10 flex flex-col justify-end">
                  <span className="w-fit px-3 py-1 rounded text-[10px] font-black uppercase mb-4" style={{ backgroundColor: theme.primary, color: 'white' }}>
                    {news[0].category}
                  </span>
                  <h2 className="text-white text-4xl font-black leading-tight mb-4 group-hover:underline">
                    <a href={news[0].link} target="_blank">{news[0].title}</a>
                  </h2>
                  <p className="text-gray-300 line-clamp-2 text-lg">{news[0].summary}</p>
                </div>
              </div>
            </div>
          )}

          {/* SIDEBAR (TRENDING) */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
            <h3 className="font-black uppercase tracking-tighter text-xl mb-6 flex items-center gap-2">
              <span style={{ color: theme.primary }}>●</span> Trending Now
            </h3>
            <div className="space-y-6">
              {news.slice(1, 5).map((item, i) => (
                <div key={item.id} className="group flex gap-4">
                  <span className="text-3xl font-black text-gray-100 group-hover:text-gray-200 transition">0{i+1}</span>
                  <div>
                    <h4 className="font-bold text-sm leading-tight group-hover:text-blue-600">
                      <a href={item.link} target="_blank">{item.title}</a>
                    </h4>
                    <span className="text-[10px] text-gray-400 font-bold uppercase mt-1 block">{item.source}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4. THE NEWS FEED */}
        <h3 className="text-2xl font-black uppercase italic mb-8 flex items-center gap-4">
           Latest Coverage <div className="h-[2px] flex-grow bg-gray-200"></div>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {news.slice(5, 25).map((item) => (
            <div key={item.id} className="bg-white border border-gray-100 rounded-xl p-5 hover:shadow-2xl transition duration-300">
               <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{item.source}</span>
               <h4 className="font-bold text-md mt-2 mb-3 leading-snug line-clamp-3">
                 <a href={item.link} target="_blank" className="hover:text-blue-600">{item.title}</a>
               </h4>
               <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-50">
                  <span className="text-[10px] font-black uppercase text-gray-500">{item.category}</span>
                  <span className="text-[10px] text-gray-400">{new Date(item.published_at).toLocaleDateString()}</span>
               </div>
            </div>
          ))}
        </div>
      </main>

      <script src="https://cdn.tailwindcss.com"></script>
    </div>
  );
}
