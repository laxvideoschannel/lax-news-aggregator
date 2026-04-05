'use client';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ALL_TEAMS, getTeam } from '@/lib/teams';
import { TeamLogo } from '@/lib/team-logo';
import { getTeamPageContent, TeamRosterPlayer, TeamSpotlight } from '@/lib/team-content';
import { ALL_PLAYERS, CHAOS_PLAYERS } from '@/lib/players';
import { getTeamMerch } from '@/lib/team-merch';

function getPlayerImageSrc(imagePage?: string) {
  return imagePage ? `/api/player-image?url=${encodeURIComponent(imagePage)}` : '';
}

function getPositionFilter(position: string) {
  return position === 'FO' ? 'M' : position;
}

export default function TeamPage() {
  const [teamId, setTeamId] = useState('chaos');
  const [filter, setFilter] = useState('All');
  const content = getTeamPageContent(teamId);
  const [activePlayer, setActivePlayer] = useState<TeamSpotlight>(content.spotlights[0]);
  const team = getTeam(teamId);
  const positionOrder = ['G', 'D', 'LSM', 'SSDM', 'M', 'FO', 'A'];
  const roster: TeamRosterPlayer[] = useMemo(() => {
    if (teamId === 'chaos') {
      return CHAOS_PLAYERS.map((player) => ({
        slug: player.slug,
        name: player.name,
        number: player.number,
        pos: player.pos,
        hometown: player.hometown,
        college: player.college,
        highlight: player.highlight,
        imagePage: player.imagePage,
      }));
    }

    return content.roster.map((player) => {
      const enriched = ALL_PLAYERS.find((candidate) => candidate.teamId === teamId && candidate.name === player.name);
      return enriched
        ? {
            ...player,
            slug: enriched.slug,
          }
        : player;
    });
  }, [content.roster, teamId]);
  const positions = useMemo(() => {
    const seen = new Set(roster.map((player) => player.pos));
    const sorted = positionOrder.filter((position) => seen.has(position));
    return ['All', ...sorted];
  }, [roster]);

  useEffect(() => {
    const saved = localStorage.getItem('lax_team') || 'chaos';
    setTeamId(saved);
  }, []);

  useEffect(() => {
    const nextContent = getTeamPageContent(teamId);
    setActivePlayer(nextContent.spotlights[0]);
    setFilter('All');
  }, [teamId]);

  useEffect(() => {
    const syncFromStorage = () => {
      const saved = localStorage.getItem('lax_team') || 'chaos';
      setTeamId(saved);
    };

    window.addEventListener('storage', syncFromStorage);
    window.addEventListener('lax-team-change', syncFromStorage);
    return () => {
      window.removeEventListener('storage', syncFromStorage);
      window.removeEventListener('lax-team-change', syncFromStorage);
    };
  }, []);

  const filteredRoster = useMemo(() => {
    if (filter === 'All') return roster;
    return roster.filter((player) => getPositionFilter(player.pos) === filter);
  }, [roster, filter]);

  const selectTeam = (id: string) => {
    setTeamId(id);
    localStorage.setItem('lax_team', id);
    window.dispatchEvent(new Event('lax-team-change'));
  };

  const heroBackground = 'linear-gradient(135deg, var(--team-surface-strong) 0%, var(--bg) 58%, color-mix(in srgb, var(--team-surface) 82%, var(--bg)) 100%)';
  const spotlightBackground = 'linear-gradient(180deg, color-mix(in srgb, var(--team-surface) 86%, var(--bg)) 0%, var(--bg) 100%)';
  const merch = getTeamMerch(teamId);
  const merchRail = [...merch.items, ...merch.items];
  const statItems = [
    { label: 'Championships', val: content.championships },
    { label: 'Roster Size', val: content.rosterSize },
    { label: team.league === 'PLL' ? 'Conference' : 'League', val: team.league === 'PLL' ? (team.conference === 'Eastern' ? 'East' : 'West') : 'WLL' },
    { label: 'Founded', val: content.founded },
  ];

  return (
    <div>
      <div
        style={{
          background: heroBackground,
          padding: '80px 0 0',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: '42%',
            background: 'var(--primary)',
            opacity: 0.08,
            clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0% 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '8%',
            top: '50%',
            transform: 'translateY(-50%)',
            fontFamily: 'var(--font-display)',
            fontWeight: 900,
            fontSize: '220px',
            color: 'color-mix(in srgb, var(--primary) 16%, transparent)',
            lineHeight: 1,
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        >
          {team.name.toUpperCase()}
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 2, paddingBottom: '60px' }}>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '28px' }}>
            {ALL_TEAMS.map((option) => (
              <button
                key={option.id}
                onClick={() => selectTeam(option.id)}
                aria-label={`Show ${option.full}`}
                className="team-selector-tile"
                style={{
                  width: '74px',
                  height: '74px',
                  borderRadius: '18px',
                  border: `${teamId === option.id ? 3 : 2}px solid ${teamId === option.id ? 'var(--primary)' : 'color-mix(in srgb, var(--border) 82%, transparent)'}`,
                  background: 'color-mix(in srgb, var(--bg-card) 90%, transparent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, opacity 0.2s, border-color 0.2s, box-shadow 0.2s',
                  boxShadow: teamId === option.id ? '0 0 0 1px color-mix(in srgb, var(--primary) 20%, transparent), 0 18px 40px color-mix(in srgb, var(--primary) 10%, transparent)' : 'none',
                  opacity: teamId === option.id ? 1 : 0.62,
                  padding: 0,
                }}
              >
                <TeamLogo
                  teamId={option.id}
                  size={100%}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    borderRadius: '16px',
                    transition: 'transform 0.2s, opacity 0.2s',
                  }}
                />
              </button>
            ))}
          </div>

          <div className="section-tag" style={{ marginBottom: '16px' }}>{content.titleTag}</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(48px, 8vw, 96px)', lineHeight: 0.9, marginBottom: '24px' }}>
            {team.city.toUpperCase()}<br /><span style={{ color: 'var(--primary)' }}>{team.name.toUpperCase()}</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>{content.seasonNote}</p>

          <div style={{ display: 'flex', gap: '40px', marginTop: '40px', flexWrap: 'wrap' }}>
            {statItems.map((stat) => (
              <div key={stat.label}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '40px', color: 'var(--primary)', lineHeight: 1 }}>{stat.val}</div>
                <div style={{ fontFamily: 'var(--font-accent)', fontSize: '10px', letterSpacing: '0.15em', color: 'var(--text-muted)', marginTop: '4px' }}>{stat.label.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section
        style={{
          background: spotlightBackground,
          padding: '80px 0',
          borderTop: '3px solid var(--primary)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            right: '-180px',
            top: '-180px',
            width: '540px',
            height: '540px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, color-mix(in srgb, var(--team-glow) 20%, transparent) 0%, transparent 65%)',
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  width: '380px',
                  height: '380px',
                  borderRadius: '50%',
                  background: 'color-mix(in srgb, var(--team-surface-strong) 70%, transparent)',
                  border: '1px solid color-mix(in srgb, var(--primary) 26%, var(--border))',
                  position: 'relative',
                  margin: '0 auto',
                  overflow: 'hidden',
                  boxShadow: '0 30px 80px rgba(0,0,0,0.35)',
                }}
              >
                {activePlayer.imagePage ? (
                  <img
                    src={getPlayerImageSrc(activePlayer.imagePage)}
                    alt={activePlayer.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center top',
                      filter: 'grayscale(1) contrast(1.08) brightness(0.82)',
                    }}
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <TeamLogo teamId={teamId} size={180} />
                  </div>
                )}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.16) 55%, rgba(0,0,0,0.82) 100%)',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: '-16px',
                    border: '1px dashed color-mix(in srgb, var(--primary) 36%, transparent)',
                    borderRadius: '50%',
                    animation: 'spin 20s linear infinite',
                  }}
                />
              </div>

              <div
                style={{
                  position: 'absolute',
                  top: '58%',
                  right: '-20px',
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '2px',
                  pointerEvents: 'none',
                }}
              >
                {activePlayer.number ? (
                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 900,
                      fontSize: '76px',
                      color: 'var(--primary)',
                      lineHeight: 0.9,
                      textShadow: '0 10px 30px rgba(0,0,0,0.45)',
                    }}
                  >
                    #{activePlayer.number}
                  </div>
                ) : null}
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 900,
                    fontSize: '20px',
                    color: 'var(--text)',
                    letterSpacing: '0.05em',
                    lineHeight: 1,
                    textShadow: '0 10px 30px rgba(0,0,0,0.45)',
                    maxWidth: '160px',
                  }}
                >
                  {activePlayer.position.toUpperCase()}
                </div>
              </div>

              <div style={{ textAlign: 'center', marginTop: '24px' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '48px', lineHeight: 0.95 }}>{activePlayer.name.toUpperCase()}</h2>
                {activePlayer.hometown || activePlayer.college ? (
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-muted)', marginTop: '8px' }}>
                    {[activePlayer.hometown, activePlayer.college].filter(Boolean).join(' - ')}
                  </div>
                ) : null}
              </div>
            </div>

            <div>
              <div className="section-tag" style={{ marginBottom: '20px' }}>FEATURED ATHLETE</div>
              <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.8, marginBottom: '36px' }}>{activePlayer.description}</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '36px' }}>
                {activePlayer.stats.map((stat) => (
                  <div
                    key={`${activePlayer.name}-${stat.label}`}
                    style={{
                      background: 'color-mix(in srgb, var(--team-surface) 72%, var(--bg-card))',
                      border: '1px solid var(--border)',
                      padding: '20px',
                      borderLeft: '3px solid var(--primary)',
                    }}
                  >
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '36px', color: 'var(--primary)', lineHeight: 1 }}>{stat.value}</div>
                    <div style={{ fontFamily: 'var(--font-accent)', fontSize: '10px', letterSpacing: '0.1em', color: 'var(--text-muted)', marginTop: '4px' }}>{stat.label.toUpperCase()}</div>
                  </div>
                ))}
              </div>

              <blockquote style={{ borderLeft: '3px solid var(--primary)', paddingLeft: '20px', fontStyle: 'italic', color: 'var(--text)', fontSize: '15px', lineHeight: 1.6, marginBottom: '32px' }}>
                "{activePlayer.quote}"
              </blockquote>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {content.spotlights.map((player) => (
                  <button
                    key={player.name}
                    onClick={() => setActivePlayer(player)}
                    style={{
                      padding: '8px 10px 8px 8px',
                      background: activePlayer.name === player.name ? 'var(--primary)' : 'transparent',
                      border: '1px solid',
                      borderColor: activePlayer.name === player.name ? 'var(--primary)' : 'var(--border)',
                      color: activePlayer.name === player.name ? '#fff' : 'var(--text-muted)',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-accent)',
                      fontSize: '11px',
                      letterSpacing: '0.1em',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    {player.imagePage ? (
                      <img
                        src={getPlayerImageSrc(player.imagePage)}
                        alt={player.name}
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          objectPosition: 'center top',
                          border: '1px solid rgba(255,255,255,0.15)',
                          filter: 'grayscale(1) contrast(1.08) brightness(0.86)',
                        }}
                      />
                    ) : (
                      <TeamLogo teamId={teamId} size={28} />
                    )}
                    <span>{player.name.split(' ').slice(-1)[0].toUpperCase()}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </section>

      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', gap: '24px', flexWrap: 'wrap' }}>
            <div>
              <div className="section-tag" style={{ marginBottom: '12px' }}>{`2026 ${team.league} ROSTER`}</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(28px, 4vw, 48px)' }}>
                MEET THE<br /><span style={{ color: 'var(--primary)' }}>TEAM</span>
              </h2>
            </div>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {positions.map((position) => (
                <button
                  key={position}
                  onClick={() => setFilter(position)}
                  style={{
                    fontFamily: 'var(--font-accent)',
                    fontSize: '11px',
                    letterSpacing: '0.1em',
                    padding: '6px 14px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: filter === position ? 'var(--primary)' : 'color-mix(in srgb, var(--team-surface) 58%, transparent)',
                    color: filter === position ? '#fff' : 'var(--text-muted)',
                  }}
                >
                  {position}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
            {filteredRoster.map((player) => {
              const card = (
                <>
                  {player.imagePage ? (
                    <>
                      <img
                        src={getPlayerImageSrc(player.imagePage)}
                        alt={player.name}
                        style={{
                          position: 'absolute',
                          inset: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: 'center top',
                          filter: 'grayscale(1) contrast(1.05) brightness(0.7)',
                          opacity: 0.18,
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(180deg, rgba(10,10,10,0.12) 0%, rgba(10,10,10,0.76) 58%, rgba(10,10,10,0.94) 100%)',
                        }}
                      />
                    </>
                  ) : null}
                  <div style={{ height: '4px', background: player.pos === 'G' ? 'var(--primary)' : 'color-mix(in srgb, var(--team-surface-strong) 76%, var(--bg-card2))' }} />
                  <div style={{ padding: '24px', position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div>
                        <div style={{ fontFamily: 'var(--font-accent)', fontSize: '10px', letterSpacing: '0.15em', color: 'var(--text-muted)', marginBottom: '4px' }}>{player.pos}</div>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '22px', lineHeight: 1 }}>{player.name}</h3>
                      </div>
                      {player.number ? (
                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '40px', color: player.pos === 'G' ? 'var(--primary)' : 'color-mix(in srgb, var(--text) 12%, transparent)', lineHeight: 1 }}>
                          #{player.number}
                        </div>
                      ) : null}
                    </div>
                    {player.hometown ? (
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: player.college ? '4px' : '0' }}>{player.hometown}</div>
                    ) : null}
                    {player.college ? (
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>{player.college}</div>
                    ) : (
                      <div style={{ marginBottom: '16px' }} />
                    )}
                    <div style={{ padding: '8px 12px', background: 'color-mix(in srgb, var(--primary) 10%, transparent)', borderLeft: '2px solid var(--primary)', fontSize: '12px', color: 'var(--text)', lineHeight: 1.4 }}>
                      {player.highlight}
                    </div>
                  </div>
                </>
              );

              if (player.slug) {
                return (
                  <Link
                    key={`${teamId}-${player.name}`}
                    href={`/team/${player.slug}`}
                    className="card"
                    style={{ overflow: 'hidden', cursor: 'pointer', position: 'relative', display: 'block' }}
                  >
                    {card}
                  </Link>
                );
              }

              return (
                <div
                  key={`${teamId}-${player.name}`}
                  className="card"
                  style={{ overflow: 'hidden', position: 'relative', display: 'block' }}
                >
                  {card}
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <section
        style={{
          padding: '10px 0 120px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div className="container">
          <div
            style={{
              border: '1px solid color-mix(in srgb, var(--border) 88%, transparent)',
              background: 'linear-gradient(135deg, color-mix(in srgb, var(--team-surface) 84%, var(--bg-card)) 0%, color-mix(in srgb, var(--bg-card) 86%, var(--bg)) 100%)',
              padding: '36px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                right: '-110px',
                top: '-90px',
                width: '320px',
                height: '320px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, color-mix(in srgb, var(--primary) 18%, transparent) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(280px, 0.88fr) minmax(0, 1.12fr)',
                gap: '36px',
                alignItems: 'center',
                position: 'relative',
                zIndex: 1,
              }}
            >
              <div>
                <div className="section-tag" style={{ marginBottom: '14px' }}>
                  SHOP {team.full.toUpperCase()} GEAR
                </div>
                <h2
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 900,
                    fontSize: 'clamp(28px, 4vw, 54px)',
                    lineHeight: 0.92,
                    marginBottom: '16px',
                  }}
                >
                  OFFICIAL {team.city.toUpperCase()}<br />
                  <span style={{ color: 'var(--primary)' }}>{team.name.toUpperCase()} GEAR</span>
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.75, marginBottom: '24px', maxWidth: '520px' }}>
                  {merch.featuredSubtitle}
                </p>
                <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                  <a
                    href={merch.shopUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minHeight: '56px',
                      padding: '0 24px',
                      background: 'var(--primary)',
                      color: '#fff',
                      fontFamily: 'var(--font-accent)',
                      fontSize: '13px',
                      letterSpacing: '0.12em',
                      textDecoration: 'none',
                      clipPath: 'polygon(0 0, calc(100% - 18px) 0, 100% 50%, calc(100% - 18px) 100%, 0 100%, 0 0)',
                    }}
                  >
                    SHOP {team.name.toUpperCase()} GEAR
                  </a>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '110px 1fr',
                      gap: '16px',
                      alignItems: 'center',
                      minWidth: 'min(100%, 360px)',
                    }}
                  >
                    <div
                      style={{
                        aspectRatio: '0.82',
                        borderRadius: '28px 28px 18px 18px',
                        border: '2px solid color-mix(in srgb, var(--primary) 72%, white)',
                        background: `linear-gradient(180deg, color-mix(in srgb, var(--primary) 86%, white) 0%, color-mix(in srgb, var(--primary) 68%, var(--secondary)) 100%)`,
                        boxShadow: '0 18px 42px rgba(0,0,0,0.26)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          left: '50%',
                          top: '-2px',
                          transform: 'translateX(-50%)',
                          width: '42%',
                          height: '18%',
                          borderBottomLeftRadius: '16px',
                          borderBottomRightRadius: '16px',
                          background: 'color-mix(in srgb, var(--bg) 82%, transparent)',
                          borderLeft: '2px solid color-mix(in srgb, var(--primary) 72%, white)',
                          borderRight: '2px solid color-mix(in srgb, var(--primary) 72%, white)',
                          borderBottom: '2px solid color-mix(in srgb, var(--primary) 72%, white)',
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          inset: '14px',
                          borderRadius: '22px 22px 14px 14px',
                          border: '1px solid color-mix(in srgb, white 22%, transparent)',
                          opacity: 0.6,
                        }}
                      />
                      <TeamLogo teamId={teamId} size={58} style={{ mixBlendMode: 'multiply' }} />
                    </div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '28px', lineHeight: 0.95 }}>
                        {merch.featuredTitle.toUpperCase()}
                      </div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: 1.65, marginTop: '8px' }}>
                        Jerseys, sideline apparel, fan gear, and everyday essentials for {team.full}.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ overflow: 'hidden', maskImage: 'linear-gradient(90deg, transparent, black 10%, black 90%, transparent)' }}>
                <div
                  className="team-gear-rail"
                  style={{
                    display: 'flex',
                    gap: '16px',
                    width: 'max-content',
                  }}
                >
                  {merchRail.map((item, index) => (
                    <a
                      key={`${teamId}-${item.title}-${index}`}
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        width: '240px',
                        minHeight: '250px',
                        padding: '18px',
                        textDecoration: 'none',
                        color: 'inherit',
                        border: '1px solid color-mix(in srgb, var(--border) 86%, transparent)',
                        background: 'linear-gradient(180deg, color-mix(in srgb, var(--bg-card) 92%, var(--team-surface)) 0%, color-mix(in srgb, var(--team-surface) 68%, var(--bg)) 100%)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div
                        style={{
                          height: '144px',
                          border: '2px solid color-mix(in srgb, var(--primary) 56%, transparent)',
                          borderRadius: '24px',
                          background: 'linear-gradient(135deg, color-mix(in srgb, var(--primary) 18%, transparent) 0%, transparent 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            position: 'absolute',
                            inset: 0,
                            background: `repeating-linear-gradient(-32deg, transparent 0 22px, color-mix(in srgb, var(--primary) 10%, transparent) 22px 40px)`,
                            opacity: 0.9,
                          }}
                        />
                        <div
                          style={{
                            position: 'absolute',
                            top: '12px',
                            left: '12px',
                            fontFamily: 'var(--font-accent)',
                            fontSize: '10px',
                            letterSpacing: '0.16em',
                            color: 'var(--text-muted)',
                          }}
                        >
                          {item.accent}
                        </div>
                        <TeamLogo teamId={teamId} size={84} style={{ position: 'relative', zIndex: 1, filter: 'drop-shadow(0 16px 24px rgba(0,0,0,0.22))' }} />
                      </div>

                      <div style={{ marginTop: '16px' }}>
                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '28px', lineHeight: 0.95 }}>
                          {item.title.toUpperCase()}
                        </div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: 1.65, marginTop: '8px' }}>
                          {item.subtitle}
                        </div>
                      </div>

                      <div style={{ marginTop: '16px', fontFamily: 'var(--font-accent)', fontSize: '12px', letterSpacing: '0.14em', color: 'var(--primary)' }}>
                        VIEW IN OFFICIAL SHOP
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes teamGearMarquee {
          from { transform: translateX(0); }
          to { transform: translateX(calc(-50% - 8px)); }
        }
        .team-selector-tile:hover {
          opacity: 1 !important;
          transform: translateY(-2px) scale(1.05);
          border-color: var(--primary) !important;
        }
        .team-selector-tile:hover img {
          opacity: 1 !important;
          transform: scale(1.08);
        }
        .team-gear-rail {
          animation: teamGearMarquee 26s linear infinite;
        }
        .team-gear-rail:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
