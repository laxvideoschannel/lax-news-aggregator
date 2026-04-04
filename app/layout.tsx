'use client';
import './globals.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ALL_TEAMS, getTeam } from '../lib/teams';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [teamId, setTeamId] = useState('chaos');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [teamPickerOpen, setTeamPickerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const cursorDot = useRef<HTMLDivElement>(null);
  const cursorRing = useRef<HTMLDivElement>(null);
  const team = getTeam(teamId);

  useEffect(() => {
    const savedTeam = localStorage.getItem('lax_team');
    if (savedTeam) setTeamId(savedTeam);

    const savedTheme = localStorage.getItem('lax_theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const selectTeam = (id: string) => {
    setTeamId(id);
    localStorage.setItem('lax_team', id);
    setTeamPickerOpen(false);
    const selected = getTeam(id);
    document.documentElement.style.setProperty('--primary', selected.primary);
    document.documentElement.style.setProperty('--secondary', selected.secondary);
  };

  useEffect(() => {
    document.documentElement.style.setProperty('--primary', team.primary);
    document.documentElement.style.setProperty('--secondary', team.secondary);
  }, [teamId, team.primary, team.secondary]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('lax_theme', theme);
  }, [theme]);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (cursorDot.current) {
        cursorDot.current.style.left = `${e.clientX}px`;
        cursorDot.current.style.top = `${e.clientY}px`;
      }
      if (cursorRing.current) {
        cursorRing.current.style.left = `${e.clientX}px`;
        cursorRing.current.style.top = `${e.clientY}px`;
      }
    };

    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

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
        <title>LaxHub - PLL Lacrosse Fan Site</title>
        <meta name="description" content="Your PLL lacrosse hub - news, rosters, schedules and more." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <div className="cursor-dot" ref={cursorDot} />
        <div className="cursor-ring" ref={cursorRing} />

        <div style={{ background: 'var(--primary)', overflow: 'hidden', height: '36px', display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 16px', flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.2)', marginRight: '16px' }}>
            <span style={{ fontFamily: 'var(--font-accent)', fontSize: '10px', letterSpacing: '0.2em', color: '#fff', whiteSpace: 'nowrap' }}>LIVE UPDATES</span>
          </div>
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <div className="ticker-track" style={{ gap: '60px' }}>
              {[...Array(2)].map((_, i) => (
                <span key={i} style={{ display: 'flex', gap: '60px', fontFamily: 'var(--font-accent)', fontSize: '11px', color: 'rgba(255,255,255,0.9)', letterSpacing: '0.1em' }}>
                  <span>CAROLINA CHAOS WIN THE 2026 PLL CHAMPIONSHIP SERIES 24-16</span>
                  <span>BLAZE RIORDEN - PLL ALL-TIME SAVE RECORD HOLDER (25 SAVES)</span>
                  <span>2026 CHAMPIONSHIP SERIES RETURNS TO D.C. - FEB 27 TO MAR 8</span>
                  <span>SHANE KNOBLOCH WINS GOLDEN STICK AWARD - 30 POINTS</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        <header
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 500,
            background: scrolled ? 'var(--bg-header)' : 'var(--bg-header-soft)',
            backdropFilter: 'blur(12px)',
            borderBottom: scrolled ? '1px solid var(--primary)' : '1px solid var(--border)',
            transition: 'all 0.3s',
          }}
        >
          <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  background: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                  fontSize: '15px',
                  fontWeight: 900,
                  color: '#fff',
                }}
              >
                LX
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 900, letterSpacing: '0.05em', lineHeight: 1 }}>LAXHUB</div>
                <div style={{ fontFamily: 'var(--font-accent)', fontSize: '9px', letterSpacing: '0.3em', color: 'var(--primary)', lineHeight: 1 }}>PLL FAN HUB</div>
              </div>
            </Link>

            <nav style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    fontFamily: 'var(--font-accent)',
                    fontSize: '12px',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    padding: '8px 18px',
                    color: pathname === link.href ? 'var(--primary)' : 'var(--text-muted)',
                    borderBottom: pathname === link.href ? '2px solid var(--primary)' : '2px solid transparent',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => { (e.target as HTMLElement).style.color = 'var(--primary)'; }}
                  onMouseLeave={(e) => { (e.target as HTMLElement).style.color = pathname === link.href ? 'var(--primary)' : 'var(--text-muted)'; }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                className="theme-toggle"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </button>

              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setTeamPickerOpen(!teamPickerOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--primary)',
                    color: 'var(--text)',
                    padding: '8px 16px',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-accent)',
                    fontSize: '11px',
                    letterSpacing: '0.1em',
                    transition: 'background 0.2s',
                  }}
                >
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: team.primary, border: '1px solid rgba(255,255,255,0.3)' }} />
                  {team.full.toUpperCase()}
                  <span style={{ fontSize: '8px', opacity: 0.6 }}>v</span>
                </button>

                {teamPickerOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 'calc(100% + 8px)',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      minWidth: '220px',
                      zIndex: 600,
                      boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
                    }}
                  >
                    {['Eastern', 'Western'].map((conf) => (
                      <div key={conf}>
                        <div style={{ fontFamily: 'var(--font-accent)', fontSize: '9px', letterSpacing: '0.2em', color: 'var(--primary)', padding: '10px 16px 6px', borderBottom: '1px solid var(--border)' }}>
                          {conf.toUpperCase()} CONFERENCE
                        </div>
                        {ALL_TEAMS.filter((t) => t.conference === conf).map((t) => (
                          <button
                            key={t.id}
                            onClick={() => selectTeam(t.id)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              width: '100%',
                              padding: '10px 16px',
                              background: 'none',
                              border: 'none',
                              color: teamId === t.id ? 'var(--primary)' : 'var(--text-muted)',
                              cursor: 'pointer',
                              fontFamily: 'var(--font-body)',
                              fontSize: '13px',
                              textAlign: 'left',
                              transition: 'background 0.15s',
                            }}
                            onMouseEnter={(e) => { (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.05)'; }}
                            onMouseLeave={(e) => { (e.target as HTMLElement).style.background = 'none'; }}
                          >
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: t.primary, flexShrink: 0 }} />
                            {t.full}
                            {teamId === t.id && <span style={{ marginLeft: 'auto', fontSize: '10px' }}>OK</span>}
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main>{children}</main>

        <footer style={{ background: 'var(--bg-footer)', borderTop: '1px solid var(--border)', paddingTop: '60px', marginTop: '80px' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '40px', marginBottom: '60px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <div style={{ width: '32px', height: '32px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', fontSize: '13px', color: '#fff' }}>LX</div>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 900 }}>LAXHUB</span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: 1.7, maxWidth: '280px' }}>
                  Your ultimate source for PLL lacrosse news, stats, and team coverage. Fan-powered. Game-obsessed.
                </p>
              </div>

              {[
                { title: 'Navigate', links: ['Home', 'News', 'Team', 'Schedule'] },
                { title: 'Teams', links: ['Carolina Chaos', 'Utah Archers', 'Denver Outlaws', 'Boston Cannons'] },
                { title: 'More', links: ['PLL Official', 'Stats', 'Player Bios', 'About'] },
              ].map((col) => (
                <div key={col.title}>
                  <div style={{ fontFamily: 'var(--font-accent)', fontSize: '11px', letterSpacing: '0.2em', color: 'var(--primary)', marginBottom: '20px' }}>{col.title.toUpperCase()}</div>
                  {col.links.map((label) => (
                    <a key={label} href="#" style={{ display: 'block', color: 'var(--text-muted)', fontSize: '13px', marginBottom: '12px' }}>
                      {label}
                    </a>
                  ))}
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--border)', padding: '24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--text-muted)' }}>
                Copyright 2026 LaxHub. Fan site - not affiliated with the PLL.
              </span>
              <span style={{ fontFamily: 'var(--font-accent)', fontSize: '10px', letterSpacing: '0.2em', color: 'var(--primary)' }}>BUILT FOR THE FANS</span>
            </div>
          </div>
        </footer>

        {teamPickerOpen && <div onClick={() => setTeamPickerOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 499 }} />}
      </body>
    </html>
  );
}
