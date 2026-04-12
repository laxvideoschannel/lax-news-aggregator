'use client';
import './globals.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ALL_TEAMS, getTeam } from '../lib/teams';
import { TeamLogo } from '../lib/team-logo';

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function hexToRgb(hex: string) {
  const normalized = hex.replace('#', '');
  const value = normalized.length === 3
    ? normalized.split('').map((part) => part + part).join('')
    : normalized;

  const parsed = Number.parseInt(value, 16);
  return {
    r: (parsed >> 16) & 255,
    g: (parsed >> 8) & 255,
    b: parsed & 255,
  };
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b].map((value) => clamp(Math.round(value), 0, 255).toString(16).padStart(2, '0')).join('')}`;
}

function mixHex(base: string, target: string, amount: number) {
  const a = hexToRgb(base);
  const b = hexToRgb(target);
  return rgbToHex(
    a.r + (b.r - a.r) * amount,
    a.g + (b.g - a.g) * amount,
    a.b + (b.b - a.b) * amount,
  );
}

function getLuminance(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  const [rr, gg, bb] = [r, g, b].map((value) => {
    const channel = value / 255;
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * rr + 0.7152 * gg + 0.0722 * bb;
}

function applyTeamTheme(teamId: string, theme: 'dark' | 'light') {
  const selected = getTeam(teamId);
  const darkTeam = getLuminance(selected.primary) < 0.08;
  const surfaceBase = theme === 'dark'
    ? mixHex(selected.primary, '#101214', darkTeam ? 0.62 : 0.74)
    : mixHex(selected.primary, '#f1f1f1', 0.9);
  const surfaceStrong = theme === 'dark'
    ? mixHex(selected.primary, '#181b1f', darkTeam ? 0.48 : 0.62)
    : mixHex(selected.primary, '#e7e7e7', 0.82);
  const glow = theme === 'dark'
    ? mixHex(selected.primary, '#ffffff', 0.18)
    : mixHex(selected.primary, '#ffffff', 0.38);

  document.documentElement.style.setProperty('--primary', selected.primary);
  document.documentElement.style.setProperty('--secondary', selected.secondary);
  document.documentElement.style.setProperty('--team-surface', surfaceBase);
  document.documentElement.style.setProperty('--team-surface-strong', surfaceStrong);
  document.documentElement.style.setProperty('--team-glow', glow);
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <circle cx="12" cy="12" r="4.5" fill="currentColor" />
      <path d="M12 1.5V4.5M12 19.5V22.5M4.57 4.57L6.7 6.7M17.3 17.3L19.43 19.43M1.5 12H4.5M19.5 12H22.5M4.57 19.43L6.7 17.3M17.3 6.7L19.43 4.57" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path d="M19 15.2A8.7 8.7 0 0 1 8.8 5a8.9 8.9 0 1 0 10.2 10.2Z" fill="currentColor" />
    </svg>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [teamId, setTeamId] = useState('chaos');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [teamPickerOpen, setTeamPickerOpen] = useState(false);
  const [collegeMenuOpen, setCollegeMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [tickerItems, setTickerItems] = useState([
    'CAROLINA CHAOS WIN THE 2026 PLL CHAMPIONSHIP SERIES 24-16',
    'BLAZE RIORDEN - PLL ALL-TIME SAVE RECORD HOLDER (25 SAVES)',
    '2026 CHAMPIONSHIP SERIES RETURNS TO D.C. - FEB 27 TO MAR 8',
    'SHANE KNOBLOCH WINS GOLDEN STICK AWARD - 30 POINTS',
  ]);
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
    window.dispatchEvent(new Event('lax-team-change'));
  };

  useEffect(() => {
    applyTeamTheme(teamId, theme);
  }, [teamId, theme]);

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(d => {
        if (d.tickerItems) {
          const items = d.tickerItems.split('|').map((s: string) => s.trim()).filter(Boolean);
          if (items.length > 0) setTickerItems(items);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('lax_theme', theme);
  }, [theme]);

  useEffect(() => {
    const syncFromStorage = () => {
      const savedTeam = localStorage.getItem('lax_team');
      if (savedTeam) setTeamId(savedTeam);
    };

    window.addEventListener('storage', syncFromStorage);
    window.addEventListener('lax-team-change', syncFromStorage);
    return () => {
      window.removeEventListener('storage', syncFromStorage);
      window.removeEventListener('lax-team-change', syncFromStorage);
    };
  }, []);

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
    { href: '/videos', label: 'Videos' },
    {
      href: '/college',
      label: 'College',
      children: [
        { href: '/college', label: 'Overview' },
        { href: '/college/scoreboard', label: 'Scoreboard' },
        { href: '/college/standings', label: 'Standings' },
        { href: '/college/rankings', label: 'Rankings' },
      ],
    },
    { href: '/team', label: 'Team' },
    { href: '/schedule', label: 'Schedule' },
  ];
  const teamGroups = Array.from(new Set(ALL_TEAMS.map((option) => option.group)));

  return (
    <html lang="en">
      <head>
        <title>LaxHub - PLL and WLL Lacrosse Fan Site</title>
        <meta name="description" content="Your PLL and WLL lacrosse hub - news, rosters, schedules and more." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <div className="cursor-dot" ref={cursorDot} />
        <div className="cursor-ring" ref={cursorRing} />

        <div style={{ background: 'var(--primary)', overflow: 'hidden', height: '36px', display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 16px', flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.2)', marginRight: '16px' }}>
            <span style={{ fontFamily: 'var(--font-accent)', fontSize: '14px', letterSpacing: '0.2em', color: '#fff', whiteSpace: 'nowrap' }}>LIVE UPDATES</span>
          </div>
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <div className="ticker-track" style={{ gap: '60px' }}>
              {[...Array(2)].map((_, i) => (
                <span key={i} style={{ display: 'flex', gap: '60px', fontFamily: 'var(--font-accent)', fontSize: '14px', color: 'rgba(255,255,255,0.9)', letterSpacing: '0.1em' }}>
                  {tickerItems.map((item, j) => <span key={j}>{item}</span>)}
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
                <div style={{ fontFamily: 'var(--font-accent)', fontSize: '14px', letterSpacing: '0.3em', color: 'var(--primary)', lineHeight: 1 }}>PLL + WLL HUB</div>
              </div>
            </Link>

            <nav style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
              {navLinks.map((link) => {
                const isCollege = link.href === '/college';
                const isActive = pathname === link.href || (isCollege && pathname.startsWith('/college'));

                if (link.children) {
                  return (
                    <div
                      key={link.href}
                      style={{ position: 'relative' }}
                      onMouseEnter={() => setCollegeMenuOpen(true)}
                      onMouseLeave={() => setCollegeMenuOpen(false)}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setCollegeMenuOpen((open) => !open)}
                        style={{
                          fontFamily: 'var(--font-accent)',
                          fontSize: '14px',
                          letterSpacing: '0.15em',
                          textTransform: 'uppercase',
                          padding: '8px 18px',
                          color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                          borderBottom: isActive ? '2px solid var(--primary)' : '2px solid transparent',
                          transition: 'all 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        {link.label}
                      </Link>

                      {collegeMenuOpen && (
                        <div
                          style={{
                            position: 'absolute',
                            top: 'calc(100%)',
                            left: 0,
                            minWidth: '220px',
                            zIndex: 700,
                            paddingTop: '10px',
                          }}
                        >
                          <div
                            style={{
                              background: 'var(--team-surface)',
                              border: '1px solid var(--border)',
                              boxShadow: '0 20px 60px rgba(0,0,0,0.28)',
                              padding: '8px',
                            }}
                          >
                          {link.children.map((child) => {
                            const childActive = pathname === child.href;
                            return (
                              <Link
                                key={child.href}
                                href={child.href}
                                onClick={() => setCollegeMenuOpen(false)}
                                style={{
                                  display: 'block',
                                  padding: '10px 12px',
                                  fontFamily: 'var(--font-accent)',
                                  fontSize: '14px',
                                  letterSpacing: '0.12em',
                                  color: childActive ? 'var(--primary)' : 'var(--text)',
                                  background: childActive ? 'color-mix(in srgb, var(--primary) 14%, transparent)' : 'transparent',
                                  transition: 'background 0.15s, color 0.15s',
                                }}
                                onMouseEnter={(e) => { if (!childActive) { (e.currentTarget as HTMLElement).style.background = 'color-mix(in srgb, var(--primary) 10%, transparent)'; (e.currentTarget as HTMLElement).style.color = 'var(--primary)'; } }}
                                onMouseLeave={(e) => { if (!childActive) { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'var(--text)'; } }}
                              >
                                {child.label.toUpperCase()}
                              </Link>
                            );
                          })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    style={{
                      fontFamily: 'var(--font-accent)',
                      fontSize: '14px',
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      padding: '8px 18px',
                      color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                      borderBottom: isActive ? '2px solid var(--primary)' : '2px solid transparent',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => { (e.target as HTMLElement).style.color = 'var(--primary)'; }}
                    onMouseLeave={(e) => { (e.target as HTMLElement).style.color = isActive ? 'var(--primary)' : 'var(--text-muted)'; }}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                className="theme-toggle"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
              </button>

              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setTeamPickerOpen(!teamPickerOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: 'var(--team-surface)',
                    border: '1px solid var(--primary)',
                    color: 'var(--text)',
                    padding: '8px 16px',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-accent)',
                    fontSize: '14px',
                    letterSpacing: '0.1em',
                    transition: 'background 0.2s',
                  }}
                >
                  <TeamLogo teamId={team.id} size={38} />
                  {team.full.toUpperCase()}
                  <span style={{ fontSize: '14px', opacity: 0.6 }}>v</span>
                </button>

                {teamPickerOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 'calc(100% + 8px)',
                      background: 'var(--team-surface)',
                      border: '1px solid var(--border)',
                      width: 'min(560px, calc(100vw - 32px))',
                      maxHeight: '70vh',
                      overflowY: 'auto',
                      zIndex: 600,
                      boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
                    }}
                  >
                    {teamGroups.map((group) => (
                      <div key={group}>
                        <div style={{ fontFamily: 'var(--font-accent)', fontSize: '14px', letterSpacing: '0.2em', color: 'var(--primary)', padding: '10px 16px 6px', borderBottom: '1px solid var(--border)' }}>
                          {group.toUpperCase()}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 0', padding: '8px' }}>
                          {ALL_TEAMS.filter((t) => t.group === group).map((t) => (
                            <button
                              key={t.id}
                              onClick={() => selectTeam(t.id)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                width: '100%',
                                padding: '10px 12px',
                                background: 'none',
                                border: 'none',
                                color: teamId === t.id ? 'var(--primary)' : 'var(--text-muted)',
                                cursor: 'pointer',
                                fontFamily: 'var(--font-body)',
                                fontSize: '14px',
                                textAlign: 'left',
                                transition: 'background 0.15s',
                              }}
                              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'color-mix(in srgb, var(--team-surface-strong) 82%, transparent)'; }}
                              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'none'; }}
                            >
                              <TeamLogo teamId={t.id} size={40} style={{ flexShrink: 0 }} />
                              <span style={{ lineHeight: 1.25 }}>{t.full}</span>
                              {teamId === t.id && <span style={{ marginLeft: 'auto', fontSize: '14px' }}>OK</span>}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main>{children}</main>

        <footer style={{ background: 'var(--bg-footer)', borderTop: '1px solid var(--border)', paddingTop: '60px', marginTop: 0 }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '40px', marginBottom: '60px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <div style={{ width: '32px', height: '32px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', fontSize: '14px', color: '#fff' }}>LX</div>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 900 }}>LAXHUB</span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.7, maxWidth: '280px' }}>
                  Your ultimate source for PLL and WLL lacrosse news, stats, and team coverage. Fan-powered. Game-obsessed.
                </p>
              </div>

              {[
                { title: 'Navigate', links: ['Home', 'News', 'Videos', 'College', 'Team', 'Schedule'] },
                { title: 'Teams', links: ['Carolina Chaos', 'Utah Archers', 'Denver Outlaws', 'Boston Cannons'] },
                { title: 'More', links: ['PLL Official', 'Stats', 'Player Bios', 'About'] },
              ].map((col) => (
                <div key={col.title}>
                  <div style={{ fontFamily: 'var(--font-accent)', fontSize: '14px', letterSpacing: '0.2em', color: 'var(--primary)', marginBottom: '20px' }}>{col.title.toUpperCase()}</div>
                  {col.links.map((label) => (
                    <a key={label} href="#" style={{ display: 'block', color: 'var(--text-muted)', fontSize: '14px', marginBottom: '12px' }}>
                      {label}
                    </a>
                  ))}
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--border)', padding: '24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--text-muted)' }}>
                Copyright 2026 LaxHub. Fan site - not affiliated with the PLL.
              </span>
              <span style={{ fontFamily: 'var(--font-accent)', fontSize: '14px', letterSpacing: '0.2em', color: 'var(--primary)' }}>BUILT FOR THE FANS</span>
            </div>
          </div>
        </footer>

        {teamPickerOpen && <div onClick={() => setTeamPickerOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 499 }} />}
      </body>
    </html>
  );
}


