'use client';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { getTeam } from '@/lib/teams';
import { TeamLogo } from '@/lib/team-logo';
import { ALL_PLL_SCHEDULE_2026, getTeamSchedule } from '@/lib/schedule';

function TeamBadge({ teamId, isWinner = false }: { teamId: string; isWinner?: boolean }) {
  const team = getTeam(teamId);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', minWidth: '132px' }}>
      <div
        style={{
          width: '96px',
          height: '96px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          border: isWinner ? '3px solid color-mix(in srgb, var(--primary) 82%, transparent)' : '1px solid color-mix(in srgb, var(--border) 70%, transparent)',
          boxShadow: isWinner ? '0 0 0 1px color-mix(in srgb, var(--primary) 28%, transparent), 0 18px 42px color-mix(in srgb, var(--primary) 14%, transparent)' : 'none',
          background: 'transparent',
        }}
      >
        <TeamLogo teamId={teamId} size={90} />
      </div>
      <div style={{ fontFamily: 'var(--font-accent)', fontSize: '11px', letterSpacing: '0.12em', color: 'var(--text-muted)', textAlign: 'center' }}>
        {team.city.toUpperCase()}
      </div>
    </div>
  );
}

function parseScore(score?: string) {
  const [home = '0', away = '0'] = (score || '0-0').split('-');
  return {
    home: Number(home),
    away: Number(away),
  };
}

export default function SchedulePage() {
  const [teamId, setTeamId] = useState('chaos');
  const [filter, setFilter] = useState<'team' | 'all' | 'results' | 'upcoming'>('team');

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

  const selectedTeam = getTeam(teamId);
  const teamSchedule = useMemo(() => getTeamSchedule(teamId), [teamId]);

  const filtered = useMemo(() => {
    if (filter === 'team') return teamSchedule;
    if (filter === 'results') return ALL_PLL_SCHEDULE_2026.filter((game) => game.status === 'final');
    if (filter === 'upcoming') return ALL_PLL_SCHEDULE_2026.filter((game) => game.status === 'upcoming');
    return ALL_PLL_SCHEDULE_2026;
  }, [filter, teamSchedule]);

  const upcoming = teamSchedule.find((game) => game.status === 'upcoming');
  const completedGames = teamSchedule.filter((game) => game.status === 'final');
  const wins = completedGames.filter((game) => {
    const score = parseScore(game.score);
    if (game.homeId === teamId) return score.home > score.away;
    if (game.awayId === teamId) return score.away > score.home;
    return false;
  }).length;
  const losses = completedGames.length - wins;

  return (
    <div>
      <section
        style={{
          background: 'linear-gradient(180deg, color-mix(in srgb, var(--primary) 10%, var(--bg)) 0%, var(--bg) 100%)',
          padding: '80px 0 60px',
          borderBottom: '1px solid var(--border)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'linear-gradient(color-mix(in srgb, var(--primary) 8%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--primary) 8%, transparent) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="section-tag" style={{ marginBottom: '16px' }}>{selectedTeam.full.toUpperCase()}</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(48px, 8vw, 96px)', lineHeight: 0.9, marginBottom: '24px' }}>
            2026<br /><span style={{ color: 'var(--primary)' }}>SCHEDULE</span>
          </h1>

          <div style={{ display: 'flex', gap: '24px', marginTop: '36px', flexWrap: 'wrap' }}>
            {[
              {
                label: 'Next Game',
                val: upcoming ? upcoming.dateLabel.split(',')[0] : 'TBD',
                sub: upcoming
                  ? `${getTeam(upcoming.awayId).full} vs ${getTeam(upcoming.homeId).full}`
                  : 'Awaiting official update',
              },
              {
                label: 'Season Record',
                val: `${wins}-${losses}`,
                sub: `${wins} wins / ${losses} losses`,
              },
            ].map((item) => (
              <div key={item.label} style={{ borderLeft: '2px solid var(--primary)', paddingLeft: '16px' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '28px', color: 'var(--primary)', lineHeight: 1 }}>{item.val}</div>
                <div style={{ fontFamily: 'var(--font-accent)', fontSize: '10px', letterSpacing: '0.1em', color: 'var(--text)', marginTop: '2px' }}>{item.label.toUpperCase()}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{item.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', position: 'sticky', top: '70px', zIndex: 100 }}>
        <div className="container" style={{ display: 'flex', gap: '0', height: '52px', alignItems: 'center' }}>
          {[
            ['team', `${selectedTeam.name} Games`],
            ['all', 'All Games'],
            ['results', 'Results'],
            ['upcoming', 'Upcoming'],
          ].map(([value, label]) => (
            <button
              key={value}
              onClick={() => setFilter(value as 'team' | 'all' | 'results' | 'upcoming')}
              style={{
                height: '100%',
                padding: '0 24px',
                fontFamily: 'var(--font-accent)',
                fontSize: '11px',
                letterSpacing: '0.15em',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: filter === value ? 'var(--primary)' : 'transparent',
                color: filter === value ? '#fff' : 'var(--text-muted)',
              }}
            >
              {label.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="container" style={{ padding: '48px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {filtered.map((game) => {
            const home = getTeam(game.homeId);
            const away = getTeam(game.awayId);
            const scoreParts = parseScore(game.score);
            const leftScore = scoreParts.away;
            const rightScore = scoreParts.home;
            const winnerSide = game.status === 'final'
              ? (rightScore > leftScore ? 'right' : leftScore > rightScore ? 'left' : null)
              : null;
            const winnerTeamId = winnerSide === 'right' ? game.homeId : winnerSide === 'left' ? game.awayId : null;

            const cardInner = (
              <div className="card schedule-card" style={{ padding: '28px', position: 'relative', overflow: 'hidden' }}>
                <div
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    padding: '7px 12px',
                    background: 'color-mix(in srgb, var(--bg-card) 88%, black)',
                    border: '1px solid color-mix(in srgb, var(--primary) 42%, transparent)',
                    color: '#fff',
                    fontFamily: 'var(--font-accent)',
                    fontSize: '10px',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    opacity: 0,
                    transform: 'translateY(-6px)',
                    transition: 'opacity 0.2s, transform 0.2s',
                    pointerEvents: 'none',
                    zIndex: 3,
                  }}
                  className="schedule-card-tooltip"
                >
                  {game.status === 'final' ? 'See Game Recap' : 'Buy Tickets'}
                </div>
                {winnerTeamId ? (
                  <div
                    style={{
                      position: 'absolute',
                      right: '-12px',
                      bottom: '24px',
                      transform: 'rotate(-14deg)',
                      opacity: 0.08,
                      pointerEvents: 'none',
                      fontFamily: 'var(--font-accent)',
                      fontSize: '30px',
                      fontWeight: 700,
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      color: 'var(--text)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {[...Array(4)].map((_, index) => (
                      <div key={index} style={{ marginBottom: '8px' }}>
                        {`${getTeam(winnerTeamId).full} + ${getTeam(winnerTeamId).full} +`}
                      </div>
                    ))}
                  </div>
                ) : null}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, color-mix(in srgb, var(--primary) 3%, transparent) 0%, transparent 100%)' }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <div className="section-tag">{game.event}</div>
                    <div style={{ fontFamily: 'var(--font-accent)', fontSize: '10px', letterSpacing: '0.12em', color: 'var(--text-muted)' }}>{game.dateLabel.toUpperCase()}</div>
                  </div>

                  <div style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '26px' }}>
                    {game.venue} | {game.time} | <span style={{ color: 'var(--text)' }}>{game.broadcast}</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '16px', alignItems: 'center', marginBottom: '22px' }}>
                    <div style={{ justifySelf: 'center' }}>
                      <TeamBadge teamId={game.awayId} isWinner={winnerSide === 'left'} />
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: 'var(--font-accent)', fontSize: '12px', letterSpacing: '0.18em', color: 'var(--text-muted)', marginBottom: '8px' }}>VS</div>
                      <div style={{ width: '42px', height: '2px', background: 'var(--border)', margin: '0 auto' }} />
                    </div>
                    <div style={{ justifySelf: 'center' }}>
                      <TeamBadge teamId={game.homeId} isWinner={winnerSide === 'right'} />
                    </div>
                  </div>

                  <div style={{ textAlign: 'center', paddingTop: '18px', borderTop: '1px solid var(--border)' }}>
                    {game.status === 'final' ? (
                      <>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
                          <div
                            style={{
                              fontFamily: 'var(--font-display)',
                              fontWeight: 900,
                              fontSize: '44px',
                              lineHeight: 1,
                              color: winnerSide === 'left' ? '#22c55e' : 'var(--text)',
                            }}
                          >
                            {leftScore}
                          </div>
                          <div style={{ fontFamily: 'var(--font-accent)', fontSize: '14px', letterSpacing: '0.2em', color: 'var(--text-muted)' }}>-</div>
                          <div
                            style={{
                              fontFamily: 'var(--font-display)',
                              fontWeight: 900,
                              fontSize: '44px',
                              lineHeight: 1,
                              color: winnerSide === 'right' ? '#22c55e' : 'var(--text)',
                            }}
                          >
                            {rightScore}
                          </div>
                        </div>
                        <div style={{ fontFamily: 'var(--font-accent)', fontSize: '10px', letterSpacing: '0.18em', color: 'var(--text-muted)', marginTop: '6px' }}>
                          FINAL SCORE
                        </div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '8px' }}>
                          {home.full} vs {away.full}
                        </div>
                      </>
                    ) : (
                      <>
                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '36px', color: 'var(--text)', lineHeight: 1 }}>{game.time}</div>
                        <div style={{ fontFamily: 'var(--font-accent)', fontSize: '10px', letterSpacing: '0.18em', color: 'var(--text-muted)', marginTop: '6px' }}>
                          NEXT FACEOFF
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );

            if (game.status === 'upcoming') {
              return (
                <a
                  key={game.slug}
                  href={game.ticketUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'block' }}
                >
                  {cardInner}
                </a>
              );
            }

            return (
              <Link key={game.slug} href={`/schedule/${game.slug}`} style={{ display: 'block' }}>
                {cardInner}
              </Link>
            );
          })}
        </div>

        <div style={{ marginTop: '28px', color: 'var(--text-muted)', fontSize: '12px', lineHeight: 1.7 }}>
          Schedule note: the default view shows the selected team's schedule. The ALL GAMES tab shows the broader PLL slate currently loaded on the site, including non-selected-team matchups from the official 2026 schedule weekends shared earlier.
        </div>
      </div>
      <style>{`
        .schedule-card:hover .schedule-card-tooltip {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
}
