'use client';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { getTeam } from '@/lib/teams';
import { TeamLogo } from '@/lib/team-logo';
import { CHAOS_SCHEDULE_2026 } from '@/lib/schedule';

function TeamBadge({ teamId }: { teamId: string }) {
  const team = getTeam(teamId);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', minWidth: '132px' }}>
      <div
        style={{
          width: '96px',
          height: '96px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
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

export default function SchedulePage() {
  const [filter, setFilter] = useState<'all' | 'results' | 'upcoming'>('all');

  const filtered = useMemo(() => {
    if (filter === 'results') return CHAOS_SCHEDULE_2026.filter((game) => game.status === 'final');
    if (filter === 'upcoming') return CHAOS_SCHEDULE_2026.filter((game) => game.status === 'upcoming');
    return CHAOS_SCHEDULE_2026;
  }, [filter]);

  const upcoming = CHAOS_SCHEDULE_2026.find((game) => game.status === 'upcoming');
  const completedGames = CHAOS_SCHEDULE_2026.filter((game) => game.status === 'final');
  const wins = completedGames.filter((game) => game.homeId === 'chaos').length;
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
          <div className="section-tag" style={{ marginBottom: '16px' }}>CAROLINA CHAOS</div>
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
            ['all', 'All Games'],
            ['results', 'Results'],
            ['upcoming', 'Upcoming'],
          ].map(([value, label]) => (
            <button
              key={value}
              onClick={() => setFilter(value as 'all' | 'results' | 'upcoming')}
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

            const cardInner = (
              <div className="card" style={{ padding: '28px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, color-mix(in srgb, var(--primary) 3%, transparent) 0%, transparent 100%)' }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <div className="section-tag">{game.event}</div>
                    <div style={{ fontFamily: 'var(--font-accent)', fontSize: '10px', letterSpacing: '0.12em', color: 'var(--text-muted)' }}>{game.dateLabel.toUpperCase()}</div>
                  </div>

                  <div style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '26px' }}>
                    {game.venue} • {game.time} • <span style={{ color: 'var(--text)' }}>{game.broadcast}</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '16px', alignItems: 'center', marginBottom: '22px' }}>
                    <TeamBadge teamId={game.awayId} />
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: 'var(--font-accent)', fontSize: '12px', letterSpacing: '0.18em', color: 'var(--text-muted)', marginBottom: '8px' }}>VS</div>
                      <div style={{ width: '42px', height: '2px', background: 'var(--border)', margin: '0 auto' }} />
                    </div>
                    <TeamBadge teamId={game.homeId} />
                  </div>

                  <div style={{ textAlign: 'center', paddingTop: '18px', borderTop: '1px solid var(--border)' }}>
                    {game.status === 'final' ? (
                      <>
                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '44px', color: '#22c55e', lineHeight: 1 }}>{game.score}</div>
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
          Schedule note: this page now reflects the official June 5-6 Charlotte "Chaos Homecoming" slate shown on the PLL 2026 schedule screenshot you shared, plus the 2026 Championship Series results already on the site. Additional regular-season weekends should be filled in from the official PLL schedule once confirmed.
        </div>
      </div>
    </div>
  );
}
