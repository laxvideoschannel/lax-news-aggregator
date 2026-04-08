'use client';

import { useState, useEffect, useMemo, type CSSProperties } from 'react';
import Link from 'next/link';
import { getTeam } from '@/lib/teams';
import { getTeamPageContent } from '@/lib/team-content';
import { getNextUpcomingGameForTeam, getTeamSeasonRecord } from '@/lib/schedule';

const PLL_TICKETS_URL = 'https://premierlacrosseleague.com/schedule';
const WLL_TICKETS_URL = 'https://thewll.com/schedule';

function SpotlightPlayerPhoto({
  imagePage,
  name,
  number,
  fullHeight = false,
}: {
  imagePage?: string | null;
  name: string;
  number?: string;
  fullHeight?: boolean;
}) {
  const [broken, setBroken] = useState(false);
  const src =
    imagePage && !broken
      ? `/api/player-image?url=${encodeURIComponent(imagePage)}`
      : '';

  const sharedImg: CSSProperties = {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    maxWidth: '100%',
    objectFit: 'cover',
    objectPosition: 'center top',
    userSelect: 'none',
  };

  if (!src) {
    return (
      <div
        style={{
          position: 'relative',
          minHeight: fullHeight ? '100%' : 420,
          height: fullHeight ? '100%' : undefined,
          borderRadius: 12,
          overflow: 'hidden',
          background: 'linear-gradient(135deg, color-mix(in srgb, var(--primary) 32%, #111), #080808)',
          display: 'flex',
          alignItems: 'flex-end',
          padding: 32,
          border: '1px solid color-mix(in srgb, var(--primary) 28%, transparent)',
        }}
      >
        <div>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 900,
              fontSize: 'clamp(48px, 10vw, 80px)',
              color: 'var(--primary)',
              lineHeight: 1,
            }}
          >
            #{number || '-'}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 900,
              fontSize: 'clamp(22px, 4vw, 32px)',
              marginTop: 8,
            }}
          >
            {name}
          </div>
          <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 10 }}>
            Photo loads from the player's official league article when available.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'relative',
        minHeight: fullHeight ? '100%' : 460,
        height: fullHeight ? '100%' : undefined,
        borderRadius: 12,
        overflow: 'hidden',
        background: '#070707',
        border: '1px solid color-mix(in srgb, var(--primary) 22%, transparent)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '58%',
          background:
            'linear-gradient(168deg, color-mix(in srgb, var(--primary) 40%, transparent), transparent)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />
      <img
        src={src}
        alt=""
        onError={() => setBroken(true)}
        style={{ ...sharedImg, zIndex: 2 }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(90deg, rgba(8,8,8,0.06) 0%, rgba(8,8,8,0.12) 46%, rgba(8,8,8,0.4) 72%, rgba(8,8,8,0.58) 100%)',
          zIndex: 3,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

export default function HomePage() {
  const [teamId, setTeamId] = useState('chaos');
  const [spotlight, setSpotlight] = useState<any>(null);
  const [spotlightLoading, setSpotlightLoading] = useState(true);
  const [spotlightIndex, setSpotlightIndex] = useState(0);
  const [news, setNews] = useState<any[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);

  useEffect(() => {
    const syncTeam = () => {
      setTeamId(localStorage.getItem('lax_team') || 'chaos');
    };

    syncTeam();
    window.addEventListener('storage', syncTeam);
    window.addEventListener('lax-team-change', syncTeam);
    return () => {
      window.removeEventListener('storage', syncTeam);
      window.removeEventListener('lax-team-change', syncTeam);
    };
  }, []);

  const loadSpotlight = (team: string, idx?: number) => {
    setSpotlightLoading(true);
    const url = `/api/player-spotlight?team=${team}${idx !== undefined ? `&player=${idx}` : ''}`;
    fetch(url)
      .then((r) => r.json())
      .then((d) => {
        setSpotlight(d);
        setSpotlightIndex(d.playerIndex ?? 0);
        setSpotlightLoading(false);
      })
      .catch(() => setSpotlightLoading(false));
  };

  useEffect(() => {
    if (teamId) loadSpotlight(teamId);
  }, [teamId]);

  useEffect(() => {
    fetch('/api/news')
      .then((r) => r.json())
      .then((d) => {
        setNews(d.slice(0, 6));
        setLoadingNews(false);
      })
      .catch(() => setLoadingNews(false));
  }, []);

  const team = getTeam(teamId);
  const pageContent = useMemo(() => getTeamPageContent(teamId), [teamId]);
  const seasonRecord = useMemo(() => getTeamSeasonRecord(teamId), [teamId]);
  const nextGame = useMemo(() => getNextUpcomingGameForTeam(teamId), [teamId]);

  const titleCount = useMemo(() => {
    const n = parseInt(pageContent.championships.replace(/\D/g, '') || '0', 10);
    return Number.isFinite(n) ? n : 0;
  }, [pageContent.championships]);

  const starNames = useMemo(
    () => pageContent.roster.slice(0, 4).map((p) => p.name),
    [pageContent.roster],
  );

  const opponentTeam = useMemo(() => {
    if (!nextGame) return null;
    const oppId = nextGame.homeId === teamId ? nextGame.awayId : nextGame.homeId;
    return getTeam(oppId);
  }, [nextGame, teamId]);

  const ticketHref = useMemo(() => {
    if (nextGame?.ticketUrl) return nextGame.ticketUrl;
    return team.league === 'WLL' ? WLL_TICKETS_URL : PLL_TICKETS_URL;
  }, [nextGame, team.league]);

  const spotlightBgSrc = spotlight?.imagePage
    ? `/api/player-image?url=${encodeURIComponent(spotlight.imagePage)}`
    : null;
  const heroBgSrc = pageContent.heroImagePage
    ? `/api/player-image?url=${encodeURIComponent(pageContent.heroImagePage)}`
    : spotlightBgSrc;

  const visibleAccolades = (spotlight?.accolades || []).filter(
    (item: string) => item !== 'PLL Professional' && item !== 'PLL Professional Player',
  );

  return (
    <div>
      <section
        style={{
          position: 'relative',
          minHeight: '92vh',
          background: 'linear-gradient(135deg, #000 0%, #0d0d0d 50%, #1a0000 100%)',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
        }}
      >
        {heroBgSrc ? (
          <>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url("${heroBgSrc}")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center center',
                filter: 'grayscale(1)',
                opacity: 0.22,
                transform: 'scale(1.04)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(90deg, rgba(5,5,5,0.9) 0%, rgba(10,10,10,0.82) 36%, rgba(10,10,10,0.52) 62%, rgba(10,10,10,0.78) 100%)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(135deg, color-mix(in srgb, var(--primary) 26%, transparent) 0%, transparent 45%, color-mix(in srgb, var(--primary) 18%, transparent) 100%)',
              }}
            />
          </>
        ) : null}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(204,0,0,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(204,0,0,0.07) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: '45%',
            background: 'var(--primary)',
            clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0% 100%)',
            opacity: 0.06,
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: '8%',
            top: '50%',
            transform: 'translateY(-50%)',
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(160px, 22vw, 340px)',
            fontWeight: 900,
            color: 'rgba(204,0,0,0.05)',
            lineHeight: 1,
            userSelect: 'none',
            letterSpacing: '-0.05em',
          }}
        >
          LAX
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 2, paddingTop: '60px', paddingBottom: '60px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
            <div>
              <div className="section-tag fade-up fade-up-1" style={{ marginBottom: '20px' }}>
                {team.league} · FAN HUB
              </div>
              <h1
                className="fade-up fade-up-2"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 900,
                  fontSize: 'clamp(56px, 8vw, 110px)',
                  lineHeight: 0.9,
                  letterSpacing: '-0.01em',
                  marginBottom: '24px',
                }}
              >
                <span style={{ display: 'block' }}>{team.city.toUpperCase()}</span>
                <span
                  style={{
                    display: 'block',
                    color: 'var(--primary)',
                    WebkitTextStroke: '2px var(--primary)',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {team.name.toUpperCase()}
                </span>
              </h1>
              <p
                className="fade-up fade-up-3"
                style={{ color: '#999', fontSize: '15px', lineHeight: 1.7, marginBottom: '36px', maxWidth: '420px' }}
              >
                Your home for {team.full} and the wider {team.league} world - spotlights, news, rosters, and schedules.
                Pick any club from the header to re-theme the site.
              </p>
              <div className="fade-up fade-up-4" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <Link href="/news" className="btn-primary">Latest News →</Link>
                <Link href="/team" className="btn-outline">View Roster</Link>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="card fade-up fade-up-1" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '3px', height: '100%', background: 'var(--primary)' }} />
                <div className="stat-num">{titleCount === 0 ? '0' : pageContent.championships}</div>
                <div style={{ fontFamily: 'var(--font-accent)', fontSize: '14px', letterSpacing: '0.1em', marginTop: '6px', marginBottom: '4px' }}>CHAMPIONSHIPS</div>
                <div style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>
                  {titleCount === 0 ? `No ${team.league} titles yet` : `${team.league} championship wins`}
                </div>
              </div>

              <div className="card fade-up fade-up-2" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '3px', height: '100%', background: 'var(--primary)' }} />
                <div style={{ fontFamily: 'var(--font-accent)', fontSize: '14px', letterSpacing: '0.1em', marginBottom: '12px' }}>STAR PLAYERS</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {starNames.length > 0 ? (
                    starNames.map((n) => (
                      <div key={n} style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(17px, 2.2vw, 22px)', lineHeight: 1.2 }}>{n}</div>
                    ))
                  ) : (
                    <div style={{ color: 'var(--text-muted)', fontSize: '15px' }}>Roster highlights coming soon.</div>
                  )}
                </div>
              </div>

              <div className="card fade-up fade-up-3" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '3px', height: '100%', background: 'var(--primary)' }} />
                <div className="stat-num">
                  {team.league === 'WLL' && seasonRecord.played === 0 ? '-' : `${seasonRecord.wins}-${seasonRecord.losses}`}
                </div>
                <div style={{ fontFamily: 'var(--font-accent)', fontSize: '14px', letterSpacing: '0.1em', marginTop: '6px', marginBottom: '4px' }}>2026 RECORD</div>
                <div style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>
                  {team.league === 'WLL' && seasonRecord.played === 0
                    ? 'PLL-style scores in this hub; follow WLL for league results'
                    : `${seasonRecord.played} games in loaded ${team.league} schedule`}
                </div>
              </div>

              <div className="card fade-up fade-up-4" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '3px', height: '100%', background: 'var(--primary)' }} />
                <div style={{ fontFamily: 'var(--font-accent)', fontSize: '14px', letterSpacing: '0.1em', marginBottom: '10px' }}>NEXT UP</div>
                {nextGame && opponentTeam ? (
                  <>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(20px, 2.8vw, 28px)', lineHeight: 1.15, marginBottom: '8px' }}>
                      vs {opponentTeam.full}
                    </div>
                    <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '14px' }}>
                      {nextGame.dateLabel} · {nextGame.time}
                      <br />
                      {nextGame.venue}
                    </div>
                    <a href={ticketHref} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ display: 'inline-block', textAlign: 'center' }}>
                      Get tickets →
                    </a>
                  </>
                ) : (
                  <>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '20px', marginBottom: '10px', color: 'var(--text-muted)' }}>
                      {team.league === 'WLL' ? 'WLL schedule' : 'Schedule & tickets'}
                    </div>
                    <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '14px' }}>
                      {team.league === 'WLL'
                        ? "Pro women's slate lives on the WLL site."
                        : 'No upcoming match loaded for this club in the current dataset.'}
                    </div>
                    <a href={ticketHref} target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ display: 'inline-block', textAlign: 'center' }}>
                      {team.league === 'WLL' ? 'WLL tickets & schedule →' : 'PLL tickets & schedule →'}
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        style={{
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(180deg, var(--bg) 0%, #0d0000 50%, var(--bg) 100%)',
          padding: '100px 0',
        }}
      >
        {spotlightBgSrc ? (
          <>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url("${spotlightBgSrc}")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center top',
                filter: 'grayscale(1)',
                opacity: 0.1,
                transform: 'scale(1.04)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(90deg, rgba(10,10,10,0.94) 0%, rgba(10,10,10,0.9) 34%, rgba(10,10,10,0.72) 60%, rgba(10,10,10,0.86) 100%)',
              }}
            />
          </>
        ) : null}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 60% at 30% 50%, rgba(204,0,0,0.07) 0%, transparent 70%)' }} />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(32px, 5vw, 60px)' }}>
                PLAYER
                <br />
                <span style={{ color: 'var(--primary)' }}>SPOTLIGHT</span>
              </h2>
            </div>
            {spotlight && (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {Array.from({ length: spotlight.totalPlayers || 3 }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => loadSpotlight(teamId, i)}
                    style={{
                      width: i === spotlightIndex ? '32px' : '10px',
                      height: '4px',
                      background: i === spotlightIndex ? 'var(--primary)' : 'rgba(255,255,255,0.2)',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      padding: 0,
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {spotlightLoading ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px' }}>
              <div style={{ background: 'var(--bg-card)', height: '420px', opacity: 0.5 }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[80, 60, 200, 120].map((h, i) => (
                  <div key={i} style={{ background: 'var(--bg-card)', height: h, opacity: 0.4 }} />
                ))}
              </div>
            </div>
          ) : spotlight ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'stretch' }}>
              <div style={{ display: 'flex' }}>
                <SpotlightPlayerPhoto
                  key={`${teamId}-${spotlightIndex}-${spotlight.name}`}
                  imagePage={spotlight.imagePage}
                  name={spotlight.name}
                  number={spotlight.number}
                  fullHeight
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px', marginBottom: '18px' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-accent)', fontSize: '14px', letterSpacing: '0.2em', color: 'var(--primary)', marginBottom: '8px' }}>
                      {spotlight.position?.toUpperCase()}
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(28px, 4.6vw, 56px)', lineHeight: 0.95, marginBottom: '8px' }}>
                      {spotlight.name.toUpperCase()}
                    </h3>
                    <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                      {[spotlight.hometown, spotlight.college].filter(Boolean).join(' - ')}
                    </div>
                  </div>
                  {spotlight.number ? (
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '76px', color: 'var(--primary)', lineHeight: 0.88, opacity: 0.85 }}>
                      #{spotlight.number}
                    </div>
                  ) : null}
                </div>

                {spotlight.headline && (
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(28px, 4vw, 52px)', lineHeight: 0.95, marginBottom: '16px' }}>
                    {spotlight.headline.toUpperCase()}
                  </h3>
                )}
                {spotlight.tagline && (
                  <p style={{ fontFamily: 'var(--font-accent)', fontSize: '14px', letterSpacing: '0.12em', color: 'var(--primary)', marginBottom: '24px', textTransform: 'uppercase' }}>
                    {spotlight.tagline}
                  </p>
                )}
                {spotlight.description && (
                  <p style={{ color: '#999', fontSize: '15px', lineHeight: 1.8, marginBottom: '24px' }}>
                    {spotlight.description}
                  </p>
                )}

                {spotlight.stats && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: 'rgba(255,255,255,0.06)', marginBottom: '24px' }}>
                    {spotlight.stats.slice(0, 4).map((s: any, i: number) => (
                      <div key={i} style={{ background: 'rgba(0,0,0,0.38)', padding: '14px 16px' }}>
                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '24px', color: 'var(--primary)', lineHeight: 1 }}>
                          {s.value}
                        </div>
                        <div style={{ fontFamily: 'var(--font-accent)', fontSize: '14px', letterSpacing: '0.1em', color: 'var(--text-muted)', marginTop: '4px' }}>
                          {s.label?.toUpperCase()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {spotlight.quote && (
                  <blockquote style={{ borderLeft: '3px solid var(--primary)', paddingLeft: '16px', fontStyle: 'italic', color: '#bbb', fontSize: '14px', lineHeight: 1.65, marginBottom: '28px' }}>
                    "{spotlight.quote}"
                  </blockquote>
                )}

                {visibleAccolades.length > 0 && (
                  <div style={{ marginBottom: '36px' }}>
                    <div style={{ fontFamily: 'var(--font-accent)', fontSize: '14px', letterSpacing: '0.2em', color: 'var(--primary)', marginBottom: '16px' }}>
                      CAREER HIGHLIGHTS
                    </div>
                    {visibleAccolades.map((a: string, i: number) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                        <div style={{ width: '6px', height: '6px', background: 'var(--primary)', borderRadius: '50%', flexShrink: 0 }} />
                        <span style={{ fontSize: '14px', color: '#ccc' }}>{a}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <Link href="/team" className="btn-primary">Full Roster →</Link>
                  <button
                    onClick={() => loadSpotlight(teamId, (spotlightIndex + 1) % (spotlight.totalPlayers || 3))}
                    className="btn-outline"
                    style={{ cursor: 'pointer' }}
                  >
                    Next Player →
                  </button>
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

      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px' }}>
            <div>
              <div className="section-tag" style={{ marginBottom: '12px' }}>LATEST NEWS</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(32px, 5vw, 56px)' }}>
                STAY IN THE
                <br />
                <span style={{ color: 'var(--primary)' }}>GAME</span>
              </h2>
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
                  {item.image_url ? (
                    <div style={{ aspectRatio: '16 / 9', overflow: 'hidden', background: 'var(--bg-card)' }}>
                      <img
                        src={item.image_url}
                        alt={item.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block',
                        }}
                      />
                    </div>
                  ) : null}
                  <div style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span className="news-pill">{item.category || 'General'}</span>
                      <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                        {item.published_at ? new Date(item.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
                      </span>
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '20px', lineHeight: 1.2, marginBottom: '12px' }}>{item.title}</h3>
                    <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {item.summary}
                    </p>
                  </div>
                  <div style={{ padding: '12px 24px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{item.source}</span>
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

      <section style={{ background: 'var(--primary)', padding: '70px 0', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 2px, transparent 2px, transparent 20px)' }} />
        <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-accent)', fontSize: '14px', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.6)', marginBottom: '16px' }}>PICK YOUR TEAM</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(32px, 6vw, 72px)', color: '#fff', marginBottom: '32px' }}>
            REPRESENTING {team.full.toUpperCase()}
          </h2>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Link href="/team" style={{ background: '#000', color: '#fff', padding: '14px 36px', fontFamily: 'var(--font-accent)', fontSize: '14px', letterSpacing: '0.15em', display: 'inline-block' }}>
              VIEW ROSTER
            </Link>
            <Link href="/schedule" style={{ border: '2px solid rgba(255,255,255,0.5)', color: '#fff', padding: '12px 34px', fontFamily: 'var(--font-accent)', fontSize: '14px', letterSpacing: '0.15em', display: 'inline-block' }}>
              SCHEDULE
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
