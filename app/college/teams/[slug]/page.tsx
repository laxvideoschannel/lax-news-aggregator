import Link from 'next/link';
import { notFound } from 'next/navigation';
import { COLLEGE_TEAMS, getCollegeTeam } from '@/lib/college';

type Props = {
  params: Promise<{ slug: string }>;
};

function getCollegePlayerImageSrc(imagePage?: string) {
  return imagePage ? `/api/player-image?url=${encodeURIComponent(imagePage)}` : null;
}

function PlayerThumb({ name, imagePage }: { name: string; imagePage?: string }) {
  const imageSrc = getCollegePlayerImageSrc(imagePage);

  if (imageSrc) {
    return (
      <img
        src={imageSrc}
        alt={name}
        style={{
          width: '88px',
          height: '88px',
          objectFit: 'cover',
          display: 'block',
          borderRadius: '14px',
          background: 'color-mix(in srgb, var(--team-surface) 70%, #111)',
          border: '1px solid var(--border)',
        }}
      />
    );
  }

  return (
    <div
      style={{
        width: '88px',
        height: '88px',
        borderRadius: '14px',
        border: '1px solid var(--border)',
        background: 'color-mix(in srgb, var(--team-surface) 70%, #111)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-display)',
        fontWeight: 900,
        fontSize: '24px',
        color: 'var(--text-muted)',
      }}
    >
      {name.split(' ').map((part) => part[0]).slice(0, 2).join('')}
    </div>
  );
}

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
          background: `linear-gradient(180deg, color-mix(in srgb, ${team.primary} 8%, var(--bg)) 0%, var(--bg) 100%)`,
          padding: '46px 0 28px',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div className="container">
          <Link href="/college" style={{ fontFamily: 'var(--font-accent)', fontSize: '14px', letterSpacing: '0.14em', color: 'var(--text-muted)' }}>
            {'<-'} BACK TO COLLEGE
          </Link>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '28px', marginTop: '20px', alignItems: 'end' }}>
            <div>
              <div className="section-tag" style={{ marginBottom: '14px' }}>{team.conference}</div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(34px, 5vw, 58px)', lineHeight: 0.96, marginBottom: '12px' }}>
                {team.school}
                <span style={{ color: team.primary }}> {team.nickname}</span>
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.8, maxWidth: '760px', marginBottom: '18px' }}>{team.overview}</p>

              <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap', color: 'var(--text-muted)', fontSize: '14px' }}>
                <span>{team.city}, {team.state}</span>
                <span>{team.conference}</span>
                <span>{team.record} record</span>
                {team.ranking ? <span>No. {team.ranking} snapshot</span> : null}
              </div>
            </div>

            <div className="card" style={{ padding: '20px' }}>
              <div className="section-tag" style={{ marginBottom: '12px' }}>QUICK LINKS</div>
              <div style={{ display: 'grid', gap: '10px' }}>
                <a href={team.officialUrl} target="_blank" rel="noreferrer" className="btn-outline" style={{ textAlign: 'center' }}>Official Team Site</a>
                <a href={team.rosterUrl} target="_blank" rel="noreferrer" className="btn-outline" style={{ textAlign: 'center' }}>Official Roster</a>
                <a href={team.scheduleUrl} target="_blank" rel="noreferrer" className="btn-outline" style={{ textAlign: 'center' }}>Official Schedule</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '28px 0 22px' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '0.95fr 1.05fr', gap: '20px' }}>
          <div className="card" style={{ padding: '24px' }}>
            <div className="section-tag" style={{ marginBottom: '12px' }}>PROGRAM NOTES</div>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.8, marginBottom: '18px' }}>{team.recruitingAngle}</p>
            <div style={{ display: 'grid', gap: '12px' }}>
              {team.strengths.map((item) => (
                <div key={item} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: team.primary, marginTop: '7px', flexShrink: 0 }} />
                  <span style={{ color: 'var(--text)', fontSize: '14px', lineHeight: 1.6 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <div className="section-tag" style={{ marginBottom: '12px' }}>SCHEDULE WATCH</div>
            <div style={{ display: 'grid', gap: '12px' }}>
              {team.featuredSchedule.map((game) => (
                <a
                  key={game.slug}
                  href={game.watchHref}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '92px 1fr auto',
                    gap: '16px',
                    alignItems: 'center',
                    padding: '16px 0',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <div>
                    <div className="section-tag" style={{ marginBottom: '8px' }}>{game.dateLabel}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{game.broadcast}</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '26px', lineHeight: 1, marginBottom: '8px' }}>
                      {game.location === 'home' ? 'VS' : game.location === 'away' ? '@' : 'VS'} {game.opponent}
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '6px' }}>{game.venue}</div>
                    <div style={{ color: 'var(--text)', fontSize: '14px', lineHeight: 1.6 }}>{game.notes}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'var(--font-accent)', fontSize: '14px', letterSpacing: '0.12em', color: game.status === 'final' ? team.primary : 'var(--text-muted)', marginBottom: '8px' }}>
                      {game.status === 'final' ? `${game.result} ${game.score || ''}`.trim() : 'UPCOMING'}
                    </div>
                    <div style={{ fontFamily: 'var(--font-accent)', fontSize: '14px', letterSpacing: '0.12em', color: 'var(--primary)' }}>
                      {game.watchLabel ?? (game.status === 'final' ? 'OFFICIAL RECAP' : 'OFFICIAL GAME PAGE')}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '0 0 24px' }}>
        <div className="container">
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px', gap: '12px', flexWrap: 'wrap' }}>
              <div>
                <div className="section-tag" style={{ marginBottom: '10px' }}>ROSTER</div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(28px, 4vw, 42px)', lineHeight: 0.98 }}>
                  Players to know
                </h2>
              </div>
              <a href={team.rosterUrl} target="_blank" rel="noreferrer" className="btn-outline">Full official roster</a>
            </div>

            <div style={{ display: 'grid', gap: '14px' }}>
              {team.roster.map((player) => (
                <div key={player.name} style={{ display: 'grid', gridTemplateColumns: '88px 1fr auto', gap: '16px', padding: '14px 0', borderBottom: '1px solid var(--border)', alignItems: 'center' }}>
                  <PlayerThumb name={player.name} imagePage={player.imagePage} />

                  <div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'baseline', flexWrap: 'wrap', marginBottom: '6px' }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '28px', lineHeight: 1 }}>{player.name}</div>
                      <div style={{ fontFamily: 'var(--font-accent)', fontSize: '14px', letterSpacing: '0.12em', color: team.primary }}>
                        {player.position} - {player.classYear}
                      </div>
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '8px' }}>{player.hometown}</div>
                    <div style={{ color: 'var(--text)', fontSize: '14px', lineHeight: 1.7, maxWidth: '760px' }}>{player.standout}</div>
                  </div>

                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '30px', color: 'var(--text-muted)' }}>#{player.number}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '0 0 70px' }}>
        <div className="container">
          <div className="card" style={{ padding: '24px' }}>
            <div className="section-tag" style={{ marginBottom: '12px' }}>OFFICIAL DESTINATIONS</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
              {team.watchLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'block',
                    padding: '16px',
                    border: '1px solid var(--border)',
                    background: 'color-mix(in srgb, var(--team-surface) 34%, transparent)',
                  }}
                >
                  <div style={{ fontFamily: 'var(--font-accent)', fontSize: '14px', letterSpacing: '0.12em', color: team.primary, marginBottom: '8px' }}>
                    {link.type.toUpperCase()}
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '22px', lineHeight: 1.08, marginBottom: '8px' }}>
                    {link.label}
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Open official destination</div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
