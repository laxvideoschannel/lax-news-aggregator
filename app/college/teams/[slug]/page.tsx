import Link from 'next/link';
import { notFound } from 'next/navigation';
import { COLLEGE_TEAMS, getCollegeTeam } from '@/lib/college';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return COLLEGE_TEAMS.map((team) => ({ slug: team.slug }));
}

export default async function CollegeTeamPage({ params }: Props) {
  const { slug } = await params;
  const team = getCollegeTeam(slug);

  if (!team) {
    notFound();
  }

  return (
    <div>
      <section
        style={{
          position: 'relative',
          overflow: 'hidden',
          background: `linear-gradient(135deg, color-mix(in srgb, ${team.primary} 18%, var(--bg)) 0%, var(--bg) 70%)`,
          padding: '84px 0 54px',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div className="container">
          <Link href="/college" style={{ fontFamily: 'var(--font-accent)', fontSize: '14px', letterSpacing: '0.14em', color: 'var(--text-muted)' }}>
            {'<-'} BACK TO COLLEGE
          </Link>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '28px', alignItems: 'end', marginTop: '24px' }}>
            <div>
              <div className="section-tag" style={{ marginBottom: '16px' }}>{team.conference}</div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(44px, 7vw, 88px)', lineHeight: 0.92, marginBottom: '14px' }}>
                {team.school.toUpperCase()}<br /><span style={{ color: team.primary }}>{team.nickname.toUpperCase()}</span>
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.8, maxWidth: '820px' }}>{team.overview}</p>
            </div>

            <div
              style={{
                width: '150px',
                height: '150px',
                borderRadius: '26px',
                background: `linear-gradient(135deg, ${team.primary}, ${team.secondary})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontFamily: 'var(--font-display)',
                fontWeight: 900,
                fontSize: '44px',
                boxShadow: '0 24px 60px rgba(0,0,0,0.28)',
              }}
            >
              {team.shortName}
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '42px 0 24px' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '22px' }}>
          <div className="card" style={{ padding: '26px' }}>
            <div className="section-tag" style={{ marginBottom: '16px' }}>PROGRAM SNAPSHOT</div>
            <div style={{ display: 'grid', gap: '14px' }}>
              {[
                ['School', team.school],
                ['Nickname', team.nickname],
                ['Conference', team.conference],
                ['Location', `${team.city}, ${team.state}`],
              ].map(([label, value]) => (
                <div key={label} style={{ paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '26px', lineHeight: 1.1 }}>{value}</div>
                  <div style={{ fontFamily: 'var(--font-accent)', fontSize: '14px', letterSpacing: '0.12em', color: 'var(--text-muted)', marginTop: '6px' }}>
                    {label.toUpperCase()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: '26px' }}>
            <div className="section-tag" style={{ marginBottom: '16px' }}>WHY THIS PAGE MATTERS</div>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.8, marginBottom: '16px' }}>{team.recruitingAngle}</p>
            <div style={{ display: 'grid', gap: '10px' }}>
              {team.strengths.map((item) => (
                <div key={item} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: team.primary, marginTop: '7px', flexShrink: 0 }} />
                  <span style={{ color: 'var(--text)', fontSize: '14px' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '0 0 24px' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: '22px' }}>
          <div className="card" style={{ padding: '26px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px', gap: '12px', flexWrap: 'wrap' }}>
              <div>
                <div className="section-tag" style={{ marginBottom: '10px' }}>ROSTER WATCH</div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(28px, 4vw, 42px)', lineHeight: 0.95 }}>
                  PLAYERS TO<br /><span style={{ color: team.primary }}>KNOW</span>
                </h2>
              </div>
              <a href={team.rosterUrl} target="_blank" rel="noreferrer" className="btn-outline">Full Official Roster</a>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '14px' }}>
              {team.roster.map((player) => (
                <div key={player.name} className="card" style={{ padding: '18px', background: 'color-mix(in srgb, var(--team-surface) 62%, transparent)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', marginBottom: '10px' }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '24px', lineHeight: 1 }}>{player.name}</div>
                      <div style={{ fontFamily: 'var(--font-accent)', fontSize: '14px', letterSpacing: '0.12em', color: team.primary, marginTop: '6px' }}>
                        {player.position} • {player.classYear}
                      </div>
                    </div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '34px', color: 'var(--primary)' }}>#{player.number}</div>
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '10px' }}>{player.hometown}</div>
                  <div style={{ color: 'var(--text)', fontSize: '14px', lineHeight: 1.6 }}>{player.standout}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: '26px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px', gap: '12px', flexWrap: 'wrap' }}>
              <div>
                <div className="section-tag" style={{ marginBottom: '10px' }}>SCHEDULE WATCH</div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(28px, 4vw, 42px)', lineHeight: 0.95 }}>
                  RECENT +<br /><span style={{ color: team.primary }}>UP NEXT</span>
                </h2>
              </div>
              <a href={team.scheduleUrl} target="_blank" rel="noreferrer" className="btn-outline">Full Official Schedule</a>
            </div>

            <div style={{ display: 'grid', gap: '12px' }}>
              {team.featuredSchedule.map((game) => (
                <a
                  key={game.slug}
                  href={game.watchHref}
                  target="_blank"
                  rel="noreferrer"
                  className="card"
                  style={{ padding: '18px', display: 'block', background: 'color-mix(in srgb, var(--team-surface) 62%, transparent)' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center', marginBottom: '10px' }}>
                    <div className="section-tag" style={{ marginBottom: 0 }}>{game.dateLabel}</div>
                    <div style={{ fontFamily: 'var(--font-accent)', fontSize: '14px', letterSpacing: '0.12em', color: game.status === 'final' ? 'var(--primary)' : 'var(--text-muted)' }}>
                      {game.status === 'final' ? `${game.result} ${game.score || ''}`.trim() : 'UPCOMING'}
                    </div>
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '26px', lineHeight: 1, marginBottom: '8px' }}>
                    {game.location === 'home' ? 'VS' : game.location === 'away' ? '@' : 'VS'} {game.opponent.toUpperCase()}
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '8px' }}>{game.venue} • {game.broadcast}</div>
                  <div style={{ color: 'var(--text)', fontSize: '14px', lineHeight: 1.6 }}>{game.notes}</div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '18px 0 70px' }}>
        <div className="container">
          <div className="card" style={{ padding: '28px' }}>
            <div className="section-tag" style={{ marginBottom: '16px' }}>WATCH + REWATCH</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(28px, 4vw, 44px)', lineHeight: 0.95, marginBottom: '14px' }}>
              OFFICIAL LINKS FOR<br /><span style={{ color: 'var(--primary)' }}>{team.school.toUpperCase()}</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.8, marginBottom: '18px' }}>
              This hub is designed to centralize official team pages, schedules, rosters, and rewatch destinations so fans, players, parents, and coaches can find what they need faster.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '14px' }}>
              {team.watchLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="card"
                  style={{
                    display: 'block',
                    padding: '18px',
                    background: 'color-mix(in srgb, var(--team-surface) 62%, transparent)',
                  }}
                >
                  <div style={{ fontFamily: 'var(--font-accent)', fontSize: '14px', letterSpacing: '0.12em', color: team.primary, marginBottom: '10px' }}>
                    {link.type.toUpperCase()}
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '24px', lineHeight: 1.05, marginBottom: '8px' }}>
                    {link.label}
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                    Open official destination -&gt;
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
