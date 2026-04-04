'use client';
// TEST EDITED EMAIL
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getTeam } from '@/lib/teams';

export default function HomePage() {
  const [teamId, setTeamId] = useState('chaos');
  const [spotlight, setSpotlight] = useState<any>(null);
  const [spotlightLoading, setSpotlightLoading] = useState(true);
  const [spotlightIndex, setSpotlightIndex] = useState(0);
  const [news, setNews] = useState<any[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('lax_team') || 'chaos';
    setTeamId(saved);
    // Listen for team changes from nav
    const handler = () => {
      const t = localStorage.getItem('lax_team') || 'chaos';
      setTeamId(t);
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const loadSpotlight = (team: string, idx?: number) => {
    setSpotlightLoading(true);
    const url = `/api/player-spotlight?team=${team}${idx !== undefined ? `&player=${idx}` : ''}`;
    fetch(url)
      .then(r => r.json())
      .then(d => { setSpotlight(d); setSpotlightIndex(d.playerIndex ?? 0); setSpotlightLoading(false); })
      .catch(() => setSpotlightLoading(false));
  };

  useEffect(() => { if (teamId) loadSpotlight(teamId); }, [teamId]);

  useEffect(() => {
    fetch('/api/news')
      .then(r => r.json())
      .then(d => { setNews(d.slice(0, 6)); setLoadingNews(false); })
      .catch(() => setLoadingNews(false));
  }, []);

  const team = getTeam(teamId);

  return (
    <div>
      {/* HERO */}
      <section style={{
        position: 'relative', minHeight: '92vh',
        background: 'linear-gradient(135deg, #000 0%, #0d0d0d 50%, #1a0000 100%)',
        display: 'flex', alignItems: 'center', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(204,0,0,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(204,0,0,0.07) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '45%', background: 'var(--primary)', clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0% 100%)', opacity: 0.06 }} />
        <div style={{ position: 'absolute', right: '8%', top: '50%', transform: 'translateY(-50%)', fontFamily: 'var(--font-display)', fontSize: 'clamp(160px, 22vw, 340px)', fontWeight: 900, color: 'rgba(204,0,0,0.05)', lineHeight: 1, userSelect: 'none', letterSpacing: '-0.05em' }}>LAX</div>

        <div className="container" style={{ position: 'relative', zIndex: 2, paddingTop: '60px', paddingBottom: '60px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
            <div>
              <div className="section-tag fade-up fade-up-1" style={{ marginBottom: '20px' }}>2026 PLL CHAMPIONS</div>
              <h1 className="fade-up fade-up-2" style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(56px, 8vw, 110px)', lineHeight: 0.9, letterSpacing: '-0.01em', marginBottom: '24px' }}>
                <span style={{ display: 'block' }}>CAROLINA</span>
                <span style={{ display: 'block', color: 'var(--primary)', WebkitTextStroke: '2px var(--primary)', WebkitTextFillColor: 'transparent' }}>CHAOS</span>
                <span style={{ display: 'block', fontSize: '55%' }}>LACROSSE HUB</span>
              </h1>
              <p className="fade-up fade-up-3" style={{ color: '#999', fontSize: '15px', lineHeight: 1.7, marginBottom: '36px', maxWidth: '420px' }}>
                Your home for PLL lacrosse — AI-powered player spotlights, live news, team stats, and schedules. Select your team to personalize.
              </p>
              <div className="fade-up fade-up-4" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <Link href="/news" className="btn-primary">Latest News →</Link>
                <Link href="/team" className="btn-outline">View Roster</Link>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {[
                { label: 'PLL Championships', value: '2', sub: '2021 & 2026' },
                { label: 'Record Saves / Game', value: '25', sub: 'Riorden vs Denver 2025' },
                { label: 'Goals Allowed / Game', value: '11.0', sub: 'Best in PLL 2025' },
                { label: 'Goalie of the Year', value: '5×', sub: 'Oren Lyons Award' },
              ].map((stat, i) => (
                <div key={i} className={`card fade-up fade-up-${(i % 4) + 1}`} style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '3px', height: '100%', background: 'var(--primary)' }} />
                  <div className="stat-num">{stat.value}</div>
                  <div style={{ fontFamily: 'var(--font-accent)', fontSize: '11px', letterSpacing: '0.1em', marginTop: '6px', marginBottom: '4px' }}>{stat.label.toUpperCase()}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{stat.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <div style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: 'var(--border)' }}>
            {[
              { icon: '🏆', label: 'Conference', value: 'Western' },
              { icon: '🥅', label: 'Saves / Game', value: '14.2' },
              { icon: '⚡', label: 'Goals Allowed', value: '11.0' },
              { icon: '🎯', label: '2025 Record', value: '6–4' },
            ].map((item, i) => (
              <div key={i} style={{ background: 'var(--bg-card)', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '28px' }}>{item.icon}</span>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '28px', color: 'var(--primary)', lineHeight: 1 }}>{item.value}</div>
                  <div style={{ fontFamily: 'var(--font-accent)', fontSize: '10px', letterSpacing: '0.15em', color: 'var(--text-muted)', marginTop: '2px' }}>{item.label.toUpperCase()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI PLAYER SPOTLIGHT */}
      <section style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(180deg, var(--bg) 0%, #0d0000 50%, var(--bg) 100%)', padding: '100px 0' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 60% at 30% 50%, rgba(204,0,0,0.07) 0%, transparent 70%)' }} />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <div className="section-tag" style={{ marginBottom: '12px' }}>AI-POWERED · UPDATES DAILY</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(32px, 5vw, 60px)' }}>
                PLAYER<br /><span style={{ color: 'var(--primary)' }}>SPOTLIGHT</span>
              </h2>
            </div>
            {spotlight && (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-accent)', fontSize: '10px', letterSpacing: '0.15em', color: 'var(--text-muted)', marginRight: '4px' }}>SWITCH</span>
                {Array.from({ length: spotlight.totalPlayers || 3 }, (_, i) => (
                  <button key={i} onClick={() => loadSpotlight(teamId, i)} style={{
                    width: i === spotlightIndex ? '32px' : '10px', height: '4px',
                    background: i === spotlightIndex ? 'var(--primary)' : 'rgba(255,255,255,0.2)',
                    border: 'none', cursor: 'pointer', transition: 'all 0.3s', padding: 0,
                  }} />
                ))}
              </div>
            )}
          </div>

          {spotlightLoading ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px' }}>
              <div style={{ background: 'var(--bg-card)', height: '420px', opacity: 0.5 }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[80, 60, 200, 120].map((h, i) => <div key={i} style={{ background: 'var(--bg-card)', height: h, opacity: 0.4 }} />)}
              </div>
            </div>
          ) : spotlight ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(50px, 8vw, 110px)', lineHeight: 0.85, color: 'rgba(204,0,0,0.05)', textTransform: 'uppercase', userSelect: 'none', wordBreak: 'break-word' }}>
                  {spotlight.name?.split(' ').map((w: string, i: number) => <div key={i}>{w}</div>)}
                </div>
                <div style={{ position: 'relative', zIndex: 1, border: '1px solid rgba(204,0,0,0.25)', background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(10px)', padding: '36px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-accent)', fontSize: '10px', letterSpacing: '0.2em', color: 'var(--primary)', marginBottom: '8px' }}>{spotlight.position?.toUpperCase()}</div>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(28px, 4vw, 48px)', lineHeight: 1 }}>{spotlight.name}</h3>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>{spotlight.hometown} · {spotlight.college}</div>
                    </div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '64px', color: 'var(--primary)', lineHeight: 1, opacity: 0.7 }}>#{spotlight.number}</div>
                  </div>
                  {spotlight.stats && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: 'rgba(255,255,255,0.06)', marginBottom: '24px' }}>
                      {spotlight.stats.slice(0, 4).map((s: any, i: number) => (
                        <div key={i} style={{ background: 'rgba(0,0,0,0.6)', padding: '14px 16px' }}>
                          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '28px', color: 'var(--primary)', lineHeight: 1 }}>{s.value}</div>
                          <div style={{ fontFamily: 'var(--font-accent)', fontSize: '9px', letterSpacing: '0.1em', color: 'var(--text-muted)', marginTop: '4px' }}>{s.label?.toUpperCase()}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  {spotlight.quote && (
                    <blockquote style={{ borderLeft: '3px solid var(--primary)', paddingLeft: '16px', fontStyle: 'italic', color: '#bbb', fontSize: '13px', lineHeight: 1.65 }}>
                      "{spotlight.quote}"
                    </blockquote>
                  )}
                </div>
              </div>

              <div>
                {spotlight.headline && <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(28px, 4vw, 52px)', lineHeight: 0.95, marginBottom: '16px' }}>{spotlight.headline.toUpperCase()}</h3>}
                {spotlight.tagline && <p style={{ fontFamily: 'var(--font-accent)', fontSize: '12px', letterSpacing: '0.12em', color: 'var(--primary)', marginBottom: '24px', textTransform: 'uppercase' }}>{spotlight.tagline}</p>}
                {spotlight.description && <p style={{ color: '#999', fontSize: '15px', lineHeight: 1.8, marginBottom: '36px' }}>{spotlight.description}</p>}
                {spotlight.accolades?.length > 0 && (
                  <div style={{ marginBottom: '36px' }}>
                    <div style={{ fontFamily: 'var(--font-accent)', fontSize: '10px', letterSpacing: '0.2em', color: 'var(--primary)', marginBottom: '16px' }}>CAREER HIGHLIGHTS</div>
                    {spotlight.accolades.map((a: string, i: number) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                        <div style={{ width: '6px', height: '6px', background: 'var(--primary)', borderRadius: '50%', flexShrink: 0 }} />
                        <span style={{ fontSize: '13px', color: '#ccc' }}>{a}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <Link href="/team" className="btn-primary">Full Roster →</Link>
                  <button onClick={() => loadSpotlight(teamId, (spotlightIndex + 1) % (spotlight.totalPlayers || 3))} className="btn-outline" style={{ cursor: 'pointer' }}>Next Player →</button>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🥍</div>
              <p>Player spotlight unavailable.</p>
            </div>
          )}
        </div>
      </section>

      {/* NEWS */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px' }}>
            <div>
              <div className="section-tag" style={{ marginBottom: '12px' }}>LATEST NEWS</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(32px, 5vw, 56px)' }}>STAY IN THE<br /><span style={{ color: 'var(--primary)' }}>GAME</span></h2>
            </div>
            <Link href="/news" className="btn-outline">All News →</Link>
          </div>
          {loadingNews ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              {[...Array(6)].map((_, i) => <div key={i} style={{ background: 'var(--bg-card)', height: '220px', opacity: 0.5 }} />)}
            </div>
          ) : news.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              {news.map((item, i) => (
                <a key={i} href={item.link} target="_blank" rel="noopener noreferrer" className="card" style={{ padding: 0, overflow: 'hidden', display: 'block' }}>
                  <div style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span className="news-pill">{item.category || 'General'}</span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.published_at ? new Date(item.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}</span>
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '20px', lineHeight: 1.2, marginBottom: '12px' }}>{item.title}</h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.summary}</p>
                  </div>
                  <div style={{ padding: '12px 24px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.source}</span>
                    <span style={{ color: 'var(--primary)' }}>→</span>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🥍</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', marginBottom: '12px' }}>NEWS COMING SOON</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Stories will appear here once your Supabase DB is set up and the cron has run.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--primary)', padding: '70px 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 2px, transparent 2px, transparent 20px)' }} />
        <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-accent)', fontSize: '11px', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.6)', marginBottom: '16px' }}>PICK YOUR TEAM</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(32px, 6vw, 72px)', color: '#fff', marginBottom: '32px' }}>REPRESENTING {team.full.toUpperCase()}</h2>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Link href="/team" style={{ background: '#000', color: '#fff', padding: '14px 36px', fontFamily: 'var(--font-accent)', fontSize: '12px', letterSpacing: '0.15em', display: 'inline-block' }}>VIEW ROSTER</Link>
            <Link href="/schedule" style={{ border: '2px solid rgba(255,255,255,0.5)', color: '#fff', padding: '12px 34px', fontFamily: 'var(--font-accent)', fontSize: '12px', letterSpacing: '0.15em', display: 'inline-block' }}>SCHEDULE</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
