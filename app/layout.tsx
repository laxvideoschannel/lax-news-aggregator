'use client';
import './globals.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { PLL_TEAMS, getTeam } from '@/lib/teams';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [teamId, setTeamId] = useState('chaos');
  const [menuOpen, setMenuOpen] = useState(false);
  const [teamPickerOpen, setTeamPickerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const cursorDot = useRef<HTMLDivElement>(null);
  const cursorRing = useRef<HTMLDivElement>(null);
  const team = getTeam(teamId);

  // Persist team choice
  useEffect(() => {
    const saved = localStorage.getItem('lax_team');
    if (saved) setTeamId(saved);
  }, []);

  const selectTeam = (id: string) => {
    setTeamId(id);
    localStorage.setItem('lax_team', id);
    setTeamPickerOpen(false);
    // Update CSS variables
    const t = getTeam(id);
    document.documentElement.style.setProperty('--primary', t.primary);
    document.documentElement.style.setProperty('--secondary', t.secondary);
  };

  // Apply team colors on load
  useEffect(() => {
    document.documentElement.style.setProperty('--primary', team.primary);
    document.documentElement.style.setProperty('--secondary', team.secondary);
  }, [teamId]);

  // Custom cursor
  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (cursorDot.current) {
        cursorDot.current.style.left = e.clientX + 'px';
        cursorDot.current.style.top = e.clientY + 'px';
      }
      if (cursorRing.current) {
        cursorRing.current.style.left = e.clientX + 'px';
        cursorRing.current.style.top = e.clientY + 'px';
      }
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/news', label: 'News' },
    { href: '/team', label: 'Team' },
    { href: '/schedule', label: 'Schedule' },
  ];

  return (
    <html lang="en">
      <head>
        <title>LaxHub — PLL Lacrosse Fan Site</title>
        <meta name="description" content="Your PLL lacrosse hub — news, rosters, schedules and more." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        {/* Custom cursor */}
        <div className="cursor-dot" ref={cursorDot} />
        <div className="cursor-ring" ref={cursorRing} />

        {/* Top ticker bar */}
        <div style={{ background: 'var(--primary)', overflow: 'hidden', height: '36px', display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 16px', flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.2)', marginRight: '16px' }}>
            <span style={{ fontFamily: 'var(--font-accent)', fontSize: '10px', letterSpacing: '0.2em', color: '#fff', whiteSpace: 'nowrap' }}>LIVE UPDATES</span>
          </div>
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <div className="ticker-track" style={{ gap: '60px' }}>
              {[...Array(2)].map((_, i) => (
                <span key={i} style={{ display: 'flex', gap: '60px', fontFamily: 'var(--font-accent)', fontSize: '11px', color: 'rgba(255,255,255,0.9)', letterSpacing: '0.1em' }}>
                  <span>🏆 CAROLINA CHAOS WIN THE 2026 PLL CHAMPIONSHIP SERIES 24-16</span>
                  <span>⭐ BLAZE RIORDEN — PLL ALL-TIME SAVE RECORD HOLDER (25 SAVES)</span>
                  <span>📅 2026 CHAMPIONSHIP SERIES RETURNS TO D.C. — FEB 27–MAR 8</span>
                  <span>🥍 SHANE KNOBLOCH WINS GOLDEN STICK AWARD — 30 POINTS</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <header style={{
          position: 'sticky', top: 0, zIndex: 500,
          background: scrolled ? 'rgba(0,0,0,0.97)' : 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: scrolled ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.05)',
          transition: 'all 0.3s',
        }}>
          <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px' }}>
            {/* Logo */}
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '38px', height: '38px',
                background: 'var(--primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                fontSize: '18px', fontWeight: 900
              }}>🥍</div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 900, letterSpacing: '0.05em', lineHeight: 1 }}>LAXHUB</div>
                <div style={{ fontFamily: 'var(--font-accent)', fontSize: '9px', letterSpacing: '0.3em', color: 'var(--primary)', lineHeight: 1 }}>PLL FAN HUB</div>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
              {navLinks.map(link => (
                <Link key={link.href} href={link.href} style={{
                  fontFamily: 'var(--font-accent)',
                  fontSize: '12px',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  padding: '8px 18px',
                  color: pathname === link.href ? 'var(--primary)' : '#ccc',
                  borderBottom: pathname === link.href ? '2px solid var(--primary)' : '2px solid transparent',
                  transition: 'all 0.2s',
                }}
                  onMouseEnter={e => { (e.target as HTMLElement).style.color = 'var(--primary)'; }}
                  onMouseLeave={e => { (e.target as HTMLElement).style.color = pathname === link.href ? 'var(--primary)' : '#ccc'; }}
                >{link.label}</Link>
              ))}
            </nav>

            {/* Team selector */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setTeamPickerOpen(!teamPickerOpen)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--primary)',
                  color: '#fff', padding: '8px 16px', cursor: 'pointer',
                  fontFamily: 'var(--font-accent)', fontSize: '11px', letterSpacing: '0.1em',
                  transition: 'background 0.2s',
                }}
              >
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: team.primary, border: '1px solid rgba(255,255,255,0.3)' }} />
                {team.full.toUpperCase()}
                <span style={{ fontSize: '8px', opacity: 0.6 }}>▼</span>
              </button>

              {teamPickerOpen && (
                <div style={{
                  position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                  background: '#111', border: '1px solid var(--border)',
                  minWidth: '220px', zIndex: 600,
                  boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
                }}>
                  {['Eastern', 'Western'].map(conf => (
                    <div key={conf}>
                      <div style={{ fontFamily: 'var(--font-accent)', fontSize: '9px', letterSpacing: '0.2em', color: 'var(--primary)', padding: '10px 16px 6px', borderBottom: '1px solid var(--border)' }}>{conf.toUpperCase()} CONFERENCE</div>
                      {PLL_TEAMS.filter(t => t.conference === conf).map(t => (
                        <button key={t.id} onClick={() => selectTeam(t.id)} style={{
                          display: 'flex', alignItems: 'center', gap: '12px',
                          width: '100%', padding: '10px 16px', background: 'none',
                          border: 'none', color: teamId === t.id ? 'var(--primary)' : '#ccc',
                          cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '13px',
                          textAlign: 'left', transition: 'background 0.15s',
                        }}
                          onMouseEnter={e => { (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.05)'; }}
                          onMouseLeave={e => { (e.target as HTMLElement).style.background = 'none'; }}
                        >
                          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: t.primary, flexShrink: 0 }} />
                          {t.full}
                          {teamId === t.id && <span style={{ marginLeft: 'auto', fontSize: '10px' }}>✓</span>}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        <main>{children}</main>

        {/* Footer */}
        <footer style={{ background: '#050505', borderTop: '1px solid var(--border)', paddingTop: '60px', marginTop: '80px' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '40px', marginBottom: '60px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <div style={{ width: '32px', height: '32px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', fontSize: '16px' }}>🥍</div>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 900 }}>LAXHUB</span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: 1.7, maxWidth: '280px' }}>
                  Your ultimate source for PLL lacrosse news, stats, and team coverage. Fan-powered. Game-obsessed.
                </p>
                <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                  {['𝕏', 'f', 'in', '▶'].map(icon => (
                    <a key={icon} href="#" style={{ width: '36px', height: '36px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '13px', transition: 'all 0.2s' }}
                      onMouseEnter={e => { (e.target as HTMLElement).style.borderColor = 'var(--primary)'; (e.target as HTMLElement).style.color = 'var(--primary)'; }}
                      onMouseLeave={e => { (e.target as HTMLElement).style.borderColor = 'var(--border)'; (e.target as HTMLElement).style.color = 'var(--text-muted)'; }}
                    >{icon}</a>
                  ))}
                </div>
              </div>
              {[
                { title: 'Navigate', links: ['Home', 'News', 'Team', 'Schedule'] },
                { title: 'Teams', links: ['Carolina Chaos', 'Utah Archers', 'Denver Outlaws', 'Boston Cannons'] },
                { title: 'More', links: ['PLL Official', 'Stats', 'Player Bios', 'About'] },
              ].map(col => (
                <div key={col.title}>
                  <div style={{ fontFamily: 'var(--font-accent)', fontSize: '11px', letterSpacing: '0.2em', color: 'var(--primary)', marginBottom: '20px' }}>{col.title.toUpperCase()}</div>
                  {col.links.map(link => (
                    <a key={link} href="#" style={{ display: 'block', color: 'var(--text-muted)', fontSize: '13px', marginBottom: '12px', transition: 'color 0.2s' }}
                      onMouseEnter={e => { (e.target as HTMLElement).style.color = '#fff'; }}
                      onMouseLeave={e => { (e.target as HTMLElement).style.color = 'var(--text-muted)'; }}
                    >{link}</a>
                  ))}
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid var(--border)', padding: '24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--text-muted)' }}>
                © 2026 LaxHub. Fan site — not affiliated with the PLL.
              </span>
              <span style={{ fontFamily: 'var(--font-accent)', fontSize: '10px', letterSpacing: '0.2em', color: 'var(--primary)' }}>
                BUILT FOR THE FANS
              </span>
            </div>
          </div>
        </footer>

        {/* Click outside team picker */}
        {teamPickerOpen && (
          <div onClick={() => setTeamPickerOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 499 }} />
        )}
      </body>
    </html>
  );
}
