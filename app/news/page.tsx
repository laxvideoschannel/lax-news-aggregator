'use client';
import { useState, useEffect } from 'react';

type ArticleData = {
  title?: string;
  author?: string;
  paragraphs?: string[];
  image?: string;
  description?: string;
  sourceUrl?: string;
  canEmbed?: boolean;
};

function ArticleModal({ item, onClose }: { item: any; onClose: () => void }) {
  const [article, setArticle] = useState<ArticleData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/news-article?url=${encodeURIComponent(item.link)}`)
      .then(r => r.json())
      .then(d => { setArticle(d); setLoading(false); })
      .catch(() => { setArticle({ canEmbed: false }); setLoading(false); });
  }, [item.link]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', handler); document.body.style.overflow = ''; };
  }, [onClose]);

  const displayImage = article?.image || item.image_url;
  const paragraphs = article?.paragraphs || [];
  const hasContent = !loading && paragraphs.length > 0;

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', width: '100%', maxWidth: '760px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 10, background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border)', color: '#fff', width: '36px', height: '36px', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>&#x2715;</button>

        {displayImage && (
          <div style={{ aspectRatio: '16/9', overflow: 'hidden' }}>
            <img src={displayImage} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} onError={e => { (e.currentTarget.parentElement as HTMLElement).style.display = 'none'; }} />
          </div>
        )}

        <div style={{ padding: '28px 32px 32px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
            <span className="news-pill">{item.category || 'General'}</span>
            {item.source && <span style={{ fontFamily: 'var(--font-accent)', fontSize: '12px', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>{item.source.toUpperCase()}</span>}
            {item.published_at && <span style={{ fontFamily: 'var(--font-accent)', fontSize: '12px', color: 'var(--text-muted)' }}>{new Date(item.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>}
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(24px, 4vw, 38px)', lineHeight: 1.05, color: 'var(--text)', marginBottom: '8px' }}>{article?.title || item.title}</h2>
          {article?.author && <div style={{ fontFamily: 'var(--font-accent)', fontSize: '13px', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '24px' }}>BY {article.author.toUpperCase()}</div>}
          <div style={{ width: '48px', height: '3px', background: 'var(--primary)', marginBottom: '24px' }} />
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[100, 85, 92, 78].map((w, i) => <div key={i} style={{ height: '14px', background: 'var(--bg)', opacity: 0.6, width: `${w}%` }} />)}
            </div>
          ) : hasContent ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {paragraphs.map((p: string, i: number) => <p key={i} style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.8, margin: 0 }}>{p}</p>)}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.8 }}>{item.summary || article?.description || 'Content unavailable.'}</p>
          )}
          <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Source: {item.source}</span>
            <a href={item.link} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ fontSize: '13px' }}>Read Full Article &rarr;</a>
          </div>
        </div>
      </div>
      {selectedNewsItem && <ArticleModal item={selectedNewsItem} onClose={() => setSelectedNewsItem(null)} />}
    </div>
  );
}

const CATEGORIES = ['All', 'Pro', 'College', 'HS', 'General'];

export default function NewsPage() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedNewsItem, setSelectedNewsItem] = useState<any | null>(null);

  useEffect(() => {
    fetch('/api/news')
      .then(r => r.json())
      .then(d => { setNews(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = news.filter(n => {
    const matchCat = activeCategory === 'All' || n.category === activeCategory;
    const matchSearch = !search || n.title?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div>
      {/* Page header */}
      <div style={{
        background: 'linear-gradient(180deg, #0d0000 0%, var(--bg) 100%)',
        padding: '80px 0 60px',
        borderBottom: '1px solid var(--border)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-100px', right: '-100px',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(204,0,0,0.12) 0%, transparent 70%)',
        }} />
        <div className="container">
          <div className="section-tag" style={{ marginBottom: '16px' }}>PLL LACROSSE</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(48px, 8vw, 96px)', lineHeight: 0.9, marginBottom: '24px' }}>
            LATEST<br /><span style={{ color: 'var(--primary)' }}>NEWS</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', maxWidth: '500px' }}>
            Auto-updated lacrosse news from across the PLL, college game, and high school scene.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', position: 'sticky', top: '70px', zIndex: 100 }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '0 24px', height: '56px', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '4px' }}>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                fontFamily: 'var(--font-accent)', fontSize: '14px', letterSpacing: '0.15em',
                padding: '6px 16px', border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                background: activeCategory === cat ? 'var(--primary)' : 'transparent',
                color: activeCategory === cat ? '#fff' : 'var(--text-muted)',
              }}>{cat.toUpperCase()}</button>
            ))}
          </div>
          <input
            placeholder="Search news..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)',
              color: '#fff', padding: '8px 16px', fontSize: '14px', width: '240px',
              fontFamily: 'var(--font-body)', outline: 'none',
            }}
          />
        </div>
      </div>

      {/* News grid */}
      <div className="container" style={{ padding: '48px 24px' }}>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {[...Array(9)].map((_, i) => (
              <div key={i} style={{ background: 'var(--bg-card)', height: '240px', animation: 'pulse 1.5s infinite' }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>🥍</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', marginBottom: '12px' }}>NO RESULTS</h3>
            <p>Try a different category or search term.</p>
          </div>
        ) : (
          <>
            <div style={{ fontFamily: 'var(--font-accent)', fontSize: '14px', letterSpacing: '0.2em', color: 'var(--text-muted)', marginBottom: '24px' }}>
              {filtered.length} STORIES
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
              {filtered.map((item, i) => (
                <div key={i} className="card" onClick={() => setSelectedNewsItem(item)} style={{ display: 'block', overflow: 'hidden', cursor: 'pointer' }}>
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      style={{
                        width: '100%',
                        aspectRatio: '16 / 9',
                        objectFit: 'cover',
                        display: 'block',
                        borderBottom: '1px solid var(--border)',
                      }}
                      onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                    />
                  ) : null}
                  <div style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
                      <span className="news-pill">{item.category}</span>
                      <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                        {item.published_at ? new Date(item.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                      </span>
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '22px', lineHeight: 1.15, marginBottom: '12px', color: 'var(--text)' }}>
                      {item.title}
                    </h3>
                    <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.65, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {item.summary}
                    </p>
                  </div>
                  <div style={{ borderTop: '1px solid var(--border)', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{item.source}</span>
                    <span style={{ color: 'var(--primary)', fontFamily: 'var(--font-accent)', fontSize: '14px', letterSpacing: '0.1em' }}>READ STORY →</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
