'use client';
import { useState, useEffect } from 'react';

const CATEGORIES = ['All', 'Pro', 'College', 'HS', 'General'];

export default function NewsPage() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/news')
      .then(r => r.json())
      .then(d => { setNews(Array.isArray(d) ? d : []); setLoading(false); })
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
        background: 'linear-gradient(180deg, color-mix(in srgb, var(--primary) 12%, var(--bg)) 0%, var(--bg) 100%)',
        padding: '80px 0 60px',
        borderBottom: '1px solid var(--border)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-100px', right: '-100px',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, color-mix(in srgb, var(--primary) 14%, transparent) 0%, transparent 70%)',
        }} />
        <div className="container">
          <div className="section-tag" style={{ marginBottom: '16px' }}>PLL + WLL + COLLEGE</div>
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
              background: 'color-mix(in srgb, var(--border) 60%, transparent)',
              border: '1px solid var(--border)',
              color: 'var(--text)', padding: '8px 16px', fontSize: '14px', width: '240px',
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
              <div key={i} style={{ background: 'var(--bg-card)', height: '220px', border: '1px solid var(--border)' }} />
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
              {filtered.map((item, i) => {
                const readUrl = item.article_url || item.link;
                return (
                  <a
                    key={i}
                    href={readUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card"
                    style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}
                  >
                    {/* Only show image if the feed or scraper actually found one */}
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt={item.title}
                        style={{ width: '100%', aspectRatio: '16 / 9', objectFit: 'cover', display: 'block', borderBottom: '1px solid var(--border)', flexShrink: 0 }}
                        onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                      />
                    )}

                    <div style={{ padding: '20px 24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="news-pill">{item.category}</span>
                        <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                          {item.published_at ? new Date(item.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                        </span>
                      </div>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '20px', lineHeight: 1.2, color: 'var(--text)', margin: 0 }}>
                        {item.title}
                      </h3>
                      <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.65, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', margin: 0 }}>
                        {item.summary}
                      </p>
                    </div>

                    <div style={{ borderTop: '1px solid var(--border)', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{item.source}</span>
                      <span style={{ color: 'var(--primary)', fontFamily: 'var(--font-accent)', fontSize: '13px', letterSpacing: '0.1em' }}>READ STORY →</span>
                    </div>
                  </a>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
