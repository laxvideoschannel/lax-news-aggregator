import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getScheduleGame } from '@/lib/schedule';
import { getTeam } from '@/lib/teams';
import { TeamLogo } from '@/lib/team-logo';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const game = getScheduleGame(slug);

  if (!game || game.status !== 'final') {
    return {};
  }

  const home = getTeam(game.homeId);
  const away = getTeam(game.awayId);

  return {
    title: `${home.full} vs ${away.full} Recap | LaxHub`,
    description: `${game.event} recap with score breakdown, standout performers, and official league links.`,
  };
}

export function generateStaticParams() {
  return ['2026-championship-series-final-chaos-vs-redwoods', '2026-championship-series-semifinal-chaos-vs-outlaws'].map((slug) => ({ slug }));
}

export default async function ScheduleGamePage({ params }: Props) {
  const { slug } = await params;
  const game = getScheduleGame(slug);

  if (!game || game.status !== 'final') {
    notFound();
  }

  const home = getTeam(game.homeId);
  const away = getTeam(game.awayId);
  const [homeScore, awayScore] = (game.score || '0-0').split('-');

  return (
    <div>
      <section
        style={{
          background: 'linear-gradient(180deg, color-mix(in srgb, var(--primary) 12%, var(--bg)) 0%, var(--bg) 100%)',
          padding: '90px 0 56px',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div className="container">
          <div className="section-tag" style={{ marginBottom: '16px' }}>{game.event}</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(40px, 6vw, 78px)', lineHeight: 0.95, marginBottom: '18px' }}>
            GAME<br /><span style={{ color: 'var(--primary)' }}>RECAP</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', maxWidth: '760px', lineHeight: 1.7 }}>
            {game.recapSummary}
          </p>
        </div>
      </section>

      <section style={{ padding: '48px 0' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '24px' }}>
          <div className="card" style={{ padding: '28px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '18px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
                  <TeamLogo teamId={away.id} size={96} />
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '28px' }}>{awayScore}</div>
                <div style={{ fontFamily: 'var(--font-accent)', fontSize: '14px', letterSpacing: '0.14em', color: 'var(--text-muted)', marginTop: '4px' }}>{away.full.toUpperCase()}</div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-accent)', fontSize: '14px', letterSpacing: '0.18em', color: 'var(--text-muted)' }}>{game.dateLabel.toUpperCase()}</div>
                <div style={{ width: '54px', height: '2px', background: 'var(--border)', margin: '14px auto' }} />
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '22px', color: 'var(--primary)' }}>FINAL</div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
                  <TeamLogo teamId={home.id} size={96} />
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '28px' }}>{homeScore}</div>
                <div style={{ fontFamily: 'var(--font-accent)', fontSize: '14px', letterSpacing: '0.14em', color: 'var(--text-muted)', marginTop: '4px' }}>{home.full.toUpperCase()}</div>
              </div>
            </div>

            <div style={{ marginTop: '28px', paddingTop: '24px', borderTop: '1px solid var(--border)', color: 'var(--text-muted)', lineHeight: 1.7 }}>
              <div>{game.venue}</div>
              <div>{game.time} | {game.broadcast}</div>
            </div>
          </div>

          <div className="card" style={{ padding: '28px' }}>
            <div className="section-tag" style={{ marginBottom: '18px' }}>Watch And Follow</div>
            <div style={{ display: 'grid', gap: '12px' }}>
              {game.media?.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline"
                  style={{ justifyContent: 'space-between' }}
                >
                  <span>{item.label}</span>
                  <span>{'→'}</span>
                </a>
              ))}
              <div style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.7, marginTop: '6px' }}>
                Verified game-specific replay and highlight links were not available from official public sources, so those buttons have been removed instead of sending you somewhere inaccurate.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ paddingBottom: '56px' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div className="card" style={{ padding: '28px' }}>
            <div className="section-tag" style={{ marginBottom: '18px' }}>Score By Period</div>
            <div style={{ display: 'grid', gap: '10px' }}>
              {game.scoreByPeriod?.length ? game.scoreByPeriod.map((period) => (
                <div
                  key={period.label}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '72px 1fr 1fr',
                    alignItems: 'center',
                    padding: '12px 14px',
                    background: 'color-mix(in srgb, var(--team-surface) 48%, transparent)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <div style={{ fontFamily: 'var(--font-accent)', fontSize: '14px', letterSpacing: '0.14em', color: 'var(--text-muted)' }}>{period.label}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '26px', textAlign: 'center' }}>{period.away}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '26px', textAlign: 'center', color: 'var(--primary)' }}>{period.home}</div>
                </div>
              )) : (
                <div style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.7 }}>
                  A verified period-by-period breakdown was not available from public official sources for this game.
                </div>
              )}
            </div>
          </div>

          <div className="card" style={{ padding: '28px' }}>
            <div className="section-tag" style={{ marginBottom: '18px' }}>Standout Performers</div>
            <div style={{ display: 'grid', gap: '10px' }}>
              {game.topScorers?.length ? game.topScorers.map((scorer) => {
                const scorerTeam = getTeam(scorer.teamId);
                return (
                  <div
                    key={`${scorer.player}-${scorerTeam.id}`}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '44px 1fr auto',
                      gap: '12px',
                      alignItems: 'center',
                      padding: '12px 14px',
                      background: 'color-mix(in srgb, var(--team-surface) 48%, transparent)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <TeamLogo teamId={scorerTeam.id} size={36} />
                    <div>
                      <div style={{ fontWeight: 700 }}>{scorer.player}</div>
                      <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{scorerTeam.full}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '24px', color: 'var(--primary)' }}>{scorer.goals}G</div>
                      <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{scorer.note || (scorer.assists ? `${scorer.assists}A` : '0A')}</div>
                    </div>
                  </div>
                );
              }) : (
                <div style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.7 }}>
                  Verified box-score leaders were not publicly available from official sources for this game.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section style={{ paddingBottom: '72px' }}>
        <div className="container">
          <div className="card" style={{ padding: '28px' }}>
            <div className="section-tag" style={{ marginBottom: '18px' }}>Quick Links</div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link href="/schedule" target="_blank" rel="noopener noreferrer" className="btn-outline">Back To Schedule</Link>
              {game.media?.map((item) => (
                <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer" className="btn-outline">
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


