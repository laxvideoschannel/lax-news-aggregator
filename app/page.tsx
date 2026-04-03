export const dynamic = 'force-dynamic';
"use client";
import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

// THE ELITE TEAM DATABASE
const TEAMS: any = {
  'Carolina Chaos': {
    primary: '#000000', // Black
    secondary: '#E31837', // Chaos Red
    accent: '#ffffff',
    logo: 'https://images.squarespace-cdn.com/content/v1/5c1d110f85ede1df328d6978/1591122421356-9H8QZ2O8I3S1J6G9Y3W2/Chaos+Logo.png',
    spotlight: {
      player: "Blaze Riorden",
      number: "10",
      position: "Goalie",
      stat: "3x PLL Goalie of the Year",
      quote: "The ball doesn't care who you are. You just have to stop it.",
      image: "https://images.unsplash.com/photo-1551773188-0801da13ddae?q=80&w=2000&auto=format&fit=crop" // We will style this to look like your Golf shot
    }
  },
  'Tusculum': {
    primary: '#000000',
    secondary: '#FF8200', // Tusculum Orange
    accent: '#ffffff',
    logo: 'https://tusculumpioneers.com/images/logos/site/site.png',
    spotlight: {
      player: "Pioneer Pride",
      number: "D2",
      position: "SAC Conference",
      stat: "National Contenders",
      quote: "Humble Hearts, Hungry Minds.",
      image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=2000&auto=format&fit=crop"
    }
  }
};

export default function Home() {
  const [news, setNews] = useState<any[]>([]);
  const [selectedTeam, setSelectedTeam] = useState('Carolina Chaos');
  const theme = TEAMS[selectedTeam] || TEAMS['Carolina Chaos'];

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
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-red-500">
      
      {/* 1. TOP MATCH TICKER (Nitro Style) */}
      <div className="bg-white/5 border-b border-white/10 py-2 overflow-hidden whitespace-nowrap">
         <div className="flex gap-12 animate-pulse px-6 italic font-black text-[10px] tracking-widest uppercase">
            <span>Next Match: Chaos vs Archers • SAT 7:00 PM</span>
            <span>Transfer Portal: 3 D1 Midfielders Declare</span>
            <span>WLL: Player Signings Announced</span>
         </div>
      </div>

      {/* 2. MAIN NAVIGATION */}
      <nav className="p-6 border-b border-white/10 flex justify-between items-center bg-black sticky top-0 z-[100]">
        <div className="flex items-center gap-4">
           <img src={theme.logo} alt="Logo" className="h-10 w-auto filter brightness-0 invert" />
           <h1 className="text-3xl font-black italic tracking-tighter uppercase leading-none">LAX<span style={{color: theme.secondary}}>PULSE</span></h1>
        </div>
        <select 
          onChange={(e) => setSelectedTeam(e.target.value)}
          className="bg-transparent border border-white/30 p-2 rounded uppercase font-black text-xs tracking-widest"
        >
          {Object.keys(TEAMS).map(t => <option key={t} value={t} className="bg-black">{t}</option>)}
        </select>
      </nav>

      <main>
        {/* 3. HERO NEWS (Bold Nitro Style) */}
        <section className="p-4 md:p-12 max-w-7xl mx-auto">
           {news.length > 0 && (
             <div className="relative group overflow-hidden rounded-3xl aspect-[16/7]">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
                <div className="absolute bottom-0 p-8 md:p-12 z-20">
                   <span className="bg-white text-black px-4 py-1 font-black uppercase text-xs mb-4 inline-block tracking-widest" style={{backgroundColor: theme.secondary, color: 'white'}}>
                      Top Story / {news[0].category}
                   </span>
                   <h2 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter leading-none mb-6 group-hover:scale-[1.02] transition-transform duration-500">
                      <a href={news[0].link} target="_blank">{news[0].title}</a>
                   </h2>
                </div>
                <div className="h-full w-full bg-gray-800 transition-transform duration-700 group-hover:scale-110" />
             </div>
           )}
        </section>

        {/* 4. THE GOLF STYLE PLAYER BIO (Dark & Classy) */}
        <section className="bg-black relative py-32 overflow-hidden border-y border-white/10">
           {/* Background Image - Black and White Filter */}
           <div className="absolute inset-0 opacity-40 grayscale pointer-events-none">
              <img src={theme.spotlight.image} alt="Background" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
           </div>

           <div className="max-w-7xl mx-auto px-12 relative z-10 grid md:grid-cols-2 gap-20 items-center">
              <div>
                 <h4 className="text-sm font-bold tracking-[0.5em] uppercase text-gray-500 mb-4">Featured Athlete</h4>
                 <h2 className="text-8xl font-black italic uppercase tracking-tighter leading-none mb-4">{theme.spotlight.player}</h2>
                 <p className="text-2xl font-light italic text-gray-400 mb-8 max-w-md">"{theme.spotlight.quote}"</p>
                 
                 <div className="flex gap-10">
                    <div>
                       <span className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Position</span>
                       <span className="text-2xl font-bold uppercase" style={{color: theme.secondary}}>{theme.spotlight.position}</span>
                    </div>
                    <div>
                       <span className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Impact</span>
                       <span className="text-2xl font-bold uppercase">{theme.spotlight.stat}</span>
                    </div>
                 </div>
              </div>
              
              <div className="hidden md:flex justify-end">
                 <div className="border-[20px] border-white/5 p-4 rounded-full aspect-square flex items-center justify-center w-64 h-64">
                    <span className="text-[120px] font-black opacity-20 italic">#{theme.spotlight.number}</span>
                 </div>
              </div>
           </div>
        </section>

        {/* 5. NEWS FEED */}
        <section className="max-w-7xl mx-auto p-12">
           <h3 className="text-2xl font-black uppercase italic mb-12 flex items-center gap-6">
              The Feed <div className="h-[1px] bg-white/10 flex-grow" />
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-1px bg-white/10 border border-white/10">
              {news.slice(1, 10).map(item => (
                <div key={item.id} className="bg-[#0a0a0a] p-8 hover:bg-[#111] transition-colors cursor-pointer group">
                   <div className="flex justify-between items-start mb-6">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{item.source}</span>
                      <span className="h-2 w-2 rounded-full" style={{backgroundColor: theme.secondary}} />
                   </div>
                   <h4 className="text-xl font-bold leading-tight group-hover:underline">
                      <a href={item.link} target="_blank">{item.title}</a>
                   </h4>
                   <p className="text-sm text-gray-500 mt-4 line-clamp-3">{item.summary}</p>
                </div>
              ))}
           </div>
        </section>
      </main>

      <script src="https://cdn.tailwindcss.com"></script>
    </div>
  );
}
