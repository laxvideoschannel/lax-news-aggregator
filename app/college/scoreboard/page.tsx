import Link from 'next/link';
import { COLLEGE_FEATURED_GAMES } from '@/lib/college';

export default function CollegeScoreboardPage() {
  return (
    <div>
      <section
        style={{
          background: 'linear-gradient(180deg, color-mix(in srgb, var(--primary) 10%, var(--bg)) 0%, var(--bg) 100%)',
          padding: '86px 0 54px',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div className="container">
          <div className="section-tag" style={{ marginBottom: '16px' }}>COLLEGE LACROSSE</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(46px, 7vw, 86px)', lineHeight: 0.92, marginBottom: '16px' }}>
            FEATURED<br /><span style={{ color: 'var(--primary)' }}>SCOREBOARD</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.8, maxWidth: '820px' }}>
            A focused board of nationally relevant college matchups, with broadcast and rewatch destinations centralized in one place.
          </p>
        </div>
      </section>

      <section style={{ padding: '42px 0 80px' }}>
        <div className="container" style={{ display: 'grid', gap: '18px' }}>
          {COLLEGE_FEATURED_GAMES.map((game) => (
            <div key={game.slug} className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr auto', gap: '20px', alignItems: 'center' }}>
                <div>
                  <div className="section-tag" style={{ marginBottom: '8px' }}>{game.dateLabel}</div>
                  <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{game.broadcast}</div>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '34px', lineHeight: 0.95, marginBottom: '8px' }}>
                    {game.awaySchool.toUpperCase()} <span style={{ color: 'var(--primary)' }}>VS</span> {game.homeSchool.toUpperCase()}
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '8px' }}>{game.venue}</div>
                  <div style={{ color: 'var(--text)', fontSize: '14px' }}>{game.notes}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '40px', color: game.status === 'final' ? 'var(--primary)' : 'var(--text)' }}>
                    {game.status === 'final' ? game.score : 'UP NEXT'}
                  </div>
                  <a href={game.watchHref} target="_blank" rel="noreferrer" className="btn-outline" style={{ marginTop: '12px' }}>
                    {game.status === 'final' ? 'Rewatch' : 'Watch Live'}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

