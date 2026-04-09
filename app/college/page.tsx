'use client';

import Link from 'next/link';
import { COLLEGE_CONFERENCES, COLLEGE_FEATURED_GAMES, COLLEGE_RANKINGS, COLLEGE_TEAMS } from '@/lib/college';
import { useMemo, useState } from 'react';

export default function CollegePage() {
  const [conference, setConference] = useState<'All' | (typeof COLLEGE_CONFERENCES)[number]>('All');

  const visibleTeams = useMemo(() => {
    if (conference === 'All') return COLLEGE_TEAMS;
    return COLLEGE_TEAMS.filter((team) => team.conference === conference);
  }, [conference]);

  return (
    <div>
      <section
        style={{
          background: 'color-mix(in srgb, var(--team-surface) 28%, var(--bg))',
          padding: '56px 0 42px',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div className="container">
          <div className="section-tag" style={{ marginBottom: '12px' }}>COLLEGE HUB</div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 900,
              fontSize: 'clamp(34px, 5vw, 58px)',
              lineHeight: 0.96,
              marginBottom: '14px',
              maxWidth: '980px',
            }}
          >
            College lacrosse teams,
            <span style={{ color: 'var(--primary)' }}> scoreboard, rankings, and standings</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.8, maxWidth: '860px', marginBottom: '24px' }}>
            This section is moving toward utility first: searchable school hubs, cleaner schedules, better official links, and structured pages we can
            expand into player profiles and recruiting tools.
          </p>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '24px' }}>
            <Link href="/college/scoreboard" target="_blank" rel="noopener noreferrer" className="btn-outline">Scoreboard</Link>
            <Link href="/college/standings" target="_blank" rel="noopener noreferrer" className="btn-outline">Standings</Link>
            <Link href="/college/rankings" target="_blank" rel="noopener noreferrer" className="btn-outline">Rankings</Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '16px' }}>
            {[
              { label: 'School Hubs', value: `${COLLEGE_TEAMS.length}`, sub: 'Team pages live now' },
              { label: 'Official Links', value: 'School First', sub: 'Schedule pages replace generic watch links' },
              { label: 'Next Phase', value: 'Players', sub: 'Profiles and game pages come next' },
            ].map((item) => (
              <div key={item.label} className="card" style={{ padding: '24px' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '40px', color: 'var(--primary)', lineHeight: 1 }}>{item.value}</div>
                <div style={{ fontFamily: 'var(--font-accent)', fontSize: '14px', letterSpacing: '0.14em', color: 'var(--text)', marginTop: '6px' }}>{item.label.toUpperCase()}</div>
                <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '6px' }}>{item.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '42px 0 24px' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: '22px', marginBottom: '30px' }}>
            <div className="card" style={{ padding: '28px' }}>
              <div className="section-tag" style={{ marginBottom: '14px' }}>SCOREBOARD</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(28px, 4vw, 44px)', lineHeight: 0.95, marginBottom: '16px' }}>
                Today&apos;s college<br /><span style={{ color: 'var(--primary)' }}>watch board</span>
              </h2>
              <div style={{ display: 'grid', gap: '12px' }}>
                {COLLEGE_FEATURED_GAMES.slice(0, 3).map((game) => (
                  <Link
                    key={game.slug}
                    href="/college/scoreboard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card"
                    style={{ display: 'block', padding: '18px', background: 'color-mix(in srgb, var(--team-surface) 64%, transparent)' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginBottom: '10px' }}>
                      <div className="section-tag" style={{ marginBottom: 0 }}>{game.dateLabel}</div>
                      <div style={{ fontFamily: 'var(--font-accent)', fontSize: '14px', letterSpacing: '0.12em', color: 'var(--text-muted)' }}>{game.broadcast}</div>
                    </div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '28px', lineHeight: 1, marginBottom: '8px' }}>
                      {game.awaySchool.toUpperCase()}<br />
                      <span style={{ color: 'var(--primary)' }}>VS</span> {game.homeSchool.toUpperCase()}
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                      {game.status === 'final' ? `Final: ${game.score}` : `Upcoming - ${game.venue}`}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="card" style={{ padding: '28px' }}>
              <div className="section-tag" style={{ marginBottom: '14px' }}>RANKINGS SNAPSHOT</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(28px, 4vw, 44px)', lineHeight: 0.95, marginBottom: '16px' }}>
                Top programs<br /><span style={{ color: 'var(--primary)' }}>to track</span>
              </h2>
              <div style={{ display: 'grid', gap: '10px' }}>
                {COLLEGE_RANKINGS.slice(0, 5).map((row) => (
                  <div key={row.rank} style={{ display: 'grid', gridTemplateColumns: '44px 1fr auto', gap: '12px', alignItems: 'center', paddingBottom: '10px', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '30px', color: 'var(--primary)' }}>{row.rank}</div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '24px', lineHeight: 1 }}>{row.school.toUpperCase()}</div>
                      <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{row.conference} - {row.record}</div>
                    </div>
                    {row.slug ? (
                      <Link href={`/college/teams/${row.slug}`} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'var(--font-accent)', fontSize: '14px', letterSpacing: '0.12em', color: 'var(--primary)' }}>
                        OPEN
                      </Link>
                    ) : null}
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '18px', flexWrap: 'wrap' }}>
                <Link href="/college/rankings" target="_blank" rel="noopener noreferrer" className="btn-primary">Full Rankings</Link>
                <Link href="/college/standings" target="_blank" rel="noopener noreferrer" className="btn-outline">Conference Standings</Link>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '20px', marginBottom: '26px', flexWrap: 'wrap' }}>
            <div>
              <div className="section-tag" style={{ marginBottom: '12px' }}>SCHOOL DIRECTORY</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(28px, 4vw, 44px)' }}>
                Browse teams
              </h2>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {(['All', ...COLLEGE_CONFERENCES] as const).map((value) => (
                <button
                  key={value}
                  onClick={() => setConference(value)}
                  style={{
                    border: 'none',
                    cursor: 'pointer',
                    padding: '8px 14px',
                    background: conference === value ? 'var(--primary)' : 'color-mix(in srgb, var(--team-surface) 70%, transparent)',
                    color: conference === value ? '#fff' : 'var(--text-muted)',
                    fontFamily: 'var(--font-accent)',
                    fontSize: '14px',
                    letterSpacing: '0.12em',
                  }}
                >
                  {value.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '18px' }}>
            {visibleTeams.map((team) => (
              <Link key={team.slug} href={`/college/teams/${team.slug}`} target="_blank" rel="noopener noreferrer" className="card" style={{ display: 'block', padding: '22px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, color-mix(in srgb, ${team.primary} 12%, transparent) 0%, transparent 70%)` }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '14px', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-accent)', fontSize: '14px', letterSpacing: '0.14em', color: team.primary }}>{team.conference}</div>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '34px', lineHeight: 0.95, marginTop: '8px' }}>
                        {team.school.toUpperCase()}
                      </h3>
                    </div>
                    <div
                      style={{
                        minWidth: '74px',
                        height: '74px',
                        borderRadius: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: `color-mix(in srgb, ${team.primary} 18%, var(--team-surface))`,
                        color: team.primary,
                        border: '1px solid var(--border)',
                        fontFamily: 'var(--font-display)',
                        fontWeight: 900,
                        fontSize: '24px',
                        padding: '0 8px',
                      }}
                    >
                      {team.shortName}
                    </div>
                  </div>

                  <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '12px' }}>{team.nickname} - {team.city}, {team.state}</div>
                  <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '16px' }}>{team.overview}</p>

                  <div style={{ display: 'grid', gap: '8px' }}>
                    {team.strengths.map((strength) => (
                      <div key={strength} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                        <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: team.primary, marginTop: '7px', flexShrink: 0 }} />
                        <span style={{ fontSize: '14px', color: 'var(--text)' }}>{strength}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '36px 0 80px' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '22px' }}>
          <div className="card" style={{ padding: '28px' }}>
            <div className="section-tag" style={{ marginBottom: '14px' }}>WATCH LINKS</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(28px, 4vw, 44px)', lineHeight: 0.95, marginBottom: '14px' }}>
              Cleaner official<br /><span style={{ color: 'var(--primary)' }}>game destinations</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.8, marginBottom: '18px' }}>
              Team pages now prioritize official school schedule and game pages instead of dropping people onto generic network home screens. We can layer
              in better direct replay links later when those are stable.
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['Official schedule', 'Game recap', 'ESPN+', 'ACCN', 'BTN+', 'FloSports'].map((label) => (
                <span key={label} style={{ padding: '7px 12px', border: '1px solid var(--border)', fontFamily: 'var(--font-accent)', fontSize: '14px', letterSpacing: '0.12em', color: 'var(--text-muted)' }}>
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: '28px' }}>
            <div className="section-tag" style={{ marginBottom: '14px' }}>RECRUITING ROADMAP</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(28px, 4vw, 44px)', lineHeight: 0.95, marginBottom: '14px' }}>
              Player-owned<br /><span style={{ color: 'var(--primary)' }}>profile pages</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.8, marginBottom: '18px' }}>
              A later phase can let high school and college players maintain recruiting profiles with film links, coach contact information, measurements,
              academic notes, and portal or availability status through a protected backend workflow.
            </p>
            <div style={{ display: 'grid', gap: '8px' }}>
              {[
                'Player + coach logins',
                'Admin-approved profile updates',
                'YouTube / Hudl / highlight links',
                'Recruiting contact cards',
              ].map((item) => (
                <div key={item} style={{ display: 'flex', gap: '10px', alignItems: 'center', color: 'var(--text)', fontSize: '14px' }}>
                  <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--primary)' }} />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


