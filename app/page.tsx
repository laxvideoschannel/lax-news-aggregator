'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CHAOS_SPOTLIGHTS, getTeam } from '@/lib/teams';

export default function HomePage() {
  const [teamId, setTeamId] = useState('chaos');
  const [spotlight, setSpotlight] = useState(CHAOS_SPOTLIGHTS[0]);
  const [news, setNews] = useState<any[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('lax_team') || 'chaos';
    setTeamId(saved);
    // Daily rotating spotlight based on day of year
    const day = Math.floor(Date.now() / 86400000);
    setSpotlight(CHAOS_SPOTLIGHTS[day % CHAOS_SPOTLIGHTS.length]);
  }, []);

  useEffect(() => {
    fetch('/api/news')
      .then(r => r.json())
      .then(d => { setNews(d.slice(0, 6)); setLoadingNews(false); })
      .catch(() => setLoadingNews(false));
  }, []);

  const team = getTeam(teamId);

  return (
    <div>
      {/* ── HERO ── */}
      <section style={{
        position: 'relative', minHeight: '92vh',
        background: 'linear-gradient(135deg, #000 0%, #0d0d0d 50%, #1a0000 100%)',
        display: 'flex', alignItems: 'center', overflow: 'hidden',
      }}>
        {/* BG grid lines */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(204,0,0,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(204,0,0,0.07) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        {/* Red diagonal slash */}
        <div style={{
          position: 'absolute', right: 0, top: 0, bottom: 0, width: '45%',
          background: 'var(--primary)',
          clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0% 100%)',
          opacity: 0.08,
        }} />
        {/* Large background number */}
        <div style={{
          position: 'absolute', right: '5%', top: '50%', transform: 'translateY(-50%)',
          fontFamily: 'var(--font-display)', fontSize: 'clamp(200px, 25vw, 380px)',
          fontWeight: 900, color: 'rgba(204,0,0,0.06)', lineHeight: 1, userSelect: 'none',
          letterSpacing: '-0.05em',
        }}>30</div>

        <div className="container" style={{ position: 'relative', zIndex: 2, paddingTop: '40px', paddingBottom: '40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
            {/* Left: hero text */}
            <div>
              <div className="section-tag fade-up fade-up-1" style={{ marginBottom: '20px' }}>
                2026 PLL CHAMPIONS
              </div>
              <h1 className="fade-up fade-up-2" style={{
                fontFamily: 'var(--font-display)', fontWeight: 900,
                fontSize: 'clamp(56px, 8vw, 110px)', lineHeight: 0.9,
                letterSpacing: '-0.01em', marginBottom: '24px',
              }}>
                <span style={{ display: 'block', color: '#fff' }}>CAROLINA</span>
                <span style={{ display: 'block', color: 'var(--primary)', WebkitTextStroke: '2px var(--primary)', WebkitTextFillColor: 'transparent' }}>CHAOS</span>
                <span style={{ display: 'block', color: '#fff', fontSize: '55%' }}>LACROSSE HUB</span>
              </h1>
              <p className="fade-up fade-up-3" style={{ color: '#999', fontSize: '15px', lineHeight: 1.7, marginBottom: '36px', maxWidth: '420px' }}>
                Your home for PLL lacrosse — live news, player spotlights, team stats, and schedules. Select your team above to customize your experience.
              </p>
              <div className="fade-up fade-up-4" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <Link href="/news" className="btn-primary">Latest News <span>→</span></Link>
                <Link href="/team" className="btn-outline">View Roster</Link>
              </div>
            </div>

            {/* Right: hero stat cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {[
                { label: 'PLL Championships', value: '2', sub: '2021 & 2026' },
                { label: 'Goalie Save %', value: '59%', sub: 'Blaze Riorden 2025' },
                { label: 'Record Saves', value: '25', sub: 'Single game PLL record' },
                { label: 'Goalie of the Year', value: '5×', sub: 'Oren Lyons Award' },
              ].map((stat, i) => (
                <div key={i} className={`card fade-up fade-up-${i + 1}`} style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '3px', height: '100%', background: 'var(--primary)' }} />
                  <div className="stat-num" style={{ marginBottom: '6px' }}>{stat.value}</div>
                  <div style={{ fontFamily: 'var(--font-accent)', fontSize: '11px', letterSpacing: '0.1em', color: '#fff', marginBottom: '4px' }}>{stat.label.toUpperCase()}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{stat.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <div style={{ fontFamily: 'var(--font-accent)', fontSize: '9px', letterSpacing: '0.25em', color: 'var(--text-muted)' }}>SCROLL</div>
          <div style={{ width: '1px', height: '40px', background: 'linear-gradient(var(--primary), transparent)' }} />
        </div>
      </section>

      {/* ── STATS TICKER ── */}
      <div style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '20px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: 'var(--border)' }}>
            {[
              { icon: '🏆', label: 'Conference', value: 'Western' },
              { icon: '🥅', label: 'Saves / Game', value: '14.2' },
              { icon: '⚡', label: 'Goals Allowed', value: '11.0' },
              { icon: '🎯', label: '2025 Record', value: '6-4' },
            ].map((item, i) => (
              <div key={i} style={{ background: 'var(--bg-card)', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
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

      {/* ── PLAYER SPOTLIGHT ── */}
      <section style={{
        position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(180deg, var(--bg) 0%, #0d0000 50%, var(--bg) 100%)',
        padding: '100px 0',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 60% 60% at 30% 50%, rgba(204,0,0,0.08) 0%, transparent 70%)',
        }} />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="section-tag" style={{ marginBottom: '16px' }}>PLAYER SPOTLIGHT</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
            {/* Left: typography-based player visual */}
            <div style={{ position: 'relative' }}>
              {/* Giant name in background */}
              <div style={{
                position: 'absolute', top: '-20px', left: '-20px', right: '-20px',
                fontFamily: 'var(--font-display)', fontWeight: 900,
                fontSize: 'clamp(60px, 9vw, 130px)', lineHeight: 0.85,
                color: 'rgba(204,0,0,0.06)', letterSpacing: '-0.03em',
                textTransform: 'uppercase', userSelect: 'none',
                wordBreak: 'break-word',
              }}>
                {spotlight.name.split(' ').map((w, i) => <div key={i}>{w}</div>)}
              </div>
              {/* Player card */}
              <div style={{
                position: 'relative', zIndex: 1,
                border: '1px solid rgba(204,0,0,0.3)',
                background: 'rgba(0,0,0,0.8)',
                backdropFilter: 'blur(10px)',
                padding: '40px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-accent)', fontSize: '11px', letterSpacing: '0.2em', color: 'var(--primary)', marginBottom: '8px' }}>{spotlight.position.toUpperCase()}</div>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(36px, 5vw, 56px)', lineHeight: 1 }}>{spotlight.name}</h2>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-muted)', marginTop: '6px' }}>
                      {spotlight.hometown} · {spotlight.college}
                    </div>
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-display)', fontWeight: 900,
                    fontSize: '72px', color: 'var(--primary)', lineHeight: 1,
                    opacity: 0.8,
                  }}>#{spotlight.number}</div>
                </div>

                {/* Stats grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: 'var(--border)', marginBottom: '32px' }}>
                  {spotlight.stats.map((s, i) => (
                    <div key={i} style={{ background: 'rgba(0,0,0,0.6)', padding: '16px' }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '32px', color: 'var(--primary)', lineHeight: 1 }}>{s.value}</div>
                      <div style={{ fontFamily: 'var(--font-accent)', fontSize: '10px', letterSpacing: '0.12em', color: 'var(--text-muted)', marginTop: '4px' }}>{s.label.toUpperCase()}</div>
                    </div>
                  ))}
                </div>

                {/* Quote */}
                <blockquote style={{
                  borderLeft: '3px solid var(--primary)', paddingLeft: '20px',
                  fontStyle: 'italic', color: '#ccc', fontSize: '14px', lineHeight: 1.6,
                }}>
                  "{spotlight.quote}"
                </blockquote>
              </div>
            </div>

            {/* Right: accolades & description */}
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(28px, 4vw, 48px)', marginBottom: '20px' }}>
                THE GREATEST IN<br /><span style={{ color: 'var(--primary)' }}>HIS GENERATION</span>
              </h3>
              <p style={{ color: '#999', fontSize: '15px', lineHeight: 1.8, marginBottom: '36px' }}>
                {spotlight.description}
              </p>

              <div style={{ marginBottom: '36px' }}>
                <div style={{ fontFamily: 'var(--font-accent)', fontSize: '11px', letterSpacing: '0.2em', color: 'var(--primary)', marginBottom: '16px' }}>CAREER HIGHLIGHTS</div>
                {spotlight.accolades.map((a, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '12px 0',
                    borderBottom: '1px solid var(--border)',
                  }}>
                    <div style={{ width: '6px', height: '6px', background: 'var(--primary)', borderRadius: '50%', flexShrink: 0 }} />
                    <span style={{ fontSize: '13px', color: '#ccc' }}>{a}</span>
                  </div>
                ))}
              </div>

              <Link href="/team" className="btn-primary">Full Roster →</Link>
            </div>
          </div>

          {/* Rotation indicator */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '48px', justifyContent: 'center' }}>
            {CHAOS_SPOTLIGHTS.map((_, i) => {
              const day = Math.floor(Date.now() / 86400000);
              const active = i === day % CHAOS_SPOTLIGHTS.length;
              return (
                <button key={i} onClick={() => setSpotlight(CHAOS_SPOTLIGHTS[i])} style={{
                  width: active ? '32px' : '8px', height: '4px',
                  background: active ? 'var(--primary)' : 'rgba(255,255,255,0.15)',
                  border: 'none', cursor: 'pointer', transition: 'all 0.3s',
                }} />
              );
            })}
          </div>
        </div>
      </section>

      {/* ── NEWS ── */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px' }}>
            <div>
              <div className="section-tag" style={{ marginBottom: '12px' }}>LATEST NEWS</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(32px, 5vw, 56px)' }}>
                STAY IN THE<br /><span style={{ color: 'var(--primary)' }}>GAME</span>
              </h2>
            </div>
            <Link href="/news" className="btn-outline">All News →</Link>
          </div>

          {loadingNews ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} style={{ background: 'var(--bg-card)', height: '220px', animation: 'pulse 1.5s infinite' }} />
              ))}
            </div>
          ) : news.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              {news.map((item, i) => (
                <a key={i} href={item.link} target="_blank" rel="noopener noreferrer" className="card" style={{ padding: '0', overflow: 'hidden', display: 'block' }}>
                  <div style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span className="news-pill">{item.category || 'General'}</span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>
                        {item.published_at ? new Date(item.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
                      </span>
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '20px', lineHeight: 1.2, marginBottom: '12px', color: '#fff' }}>
                      {item.title}
                    </h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {item.summary}
                    </p>
                  </div>
                  <div style={{ padding: '12px 24px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>{item.source}</span>
                    <span style={{ color: 'var(--primary)', fontSize: '13px' }}>→</span>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '40px', marginBottom: '16px' }}>🥍</div>
              <p>News loading — make sure your database is set up and the fetch-news cron has run.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── TEAM BANNER ── */}
      <section style={{
        background: 'var(--primary)',
        padding: '70px 0',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 2px, transparent 2px, transparent 20px)',
        }} />
        <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-accent)', fontSize: '11px', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.6)', marginBottom: '16px' }}>PICK YOUR TEAM</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(32px, 6vw, 72px)', color: '#fff', marginBottom: '32px' }}>
            REPRESENTING {team.full.toUpperCase()}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '15px', marginBottom: '36px' }}>
            Use the team selector in the nav to switch teams. The site will re-theme to your team's colors.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Link href="/team" style={{ background: '#000', color: '#fff', padding: '14px 36px', fontFamily: 'var(--font-accent)', fontSize: '12px', letterSpacing: '0.15em', display: 'inline-block' }}>VIEW ROSTER</Link>
            <Link href="/schedule" style={{ border: '2px solid rgba(255,255,255,0.5)', color: '#fff', padding: '12px 34px', fontFamily: 'var(--font-accent)', fontSize: '12px', letterSpacing: '0.15em', display: 'inline-block' }}>SCHEDULE</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
