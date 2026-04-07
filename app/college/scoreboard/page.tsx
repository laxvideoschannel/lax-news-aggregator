import Link from 'next/link';
import { COLLEGE_FEATURED_GAMES } from '@/lib/college';

export default function CollegeScoreboardPage() {
  return (
    <div>
      <section
        style={{
          background: 'color-mix(in srgb, var(--team-surface) 32%, var(--bg))',
          padding: '54px 0 34px',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div className="container">
          <div className="section-tag" style={{ marginBottom: '12px' }}>COLLEGE SCOREBOARD</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(34px, 5vw, 56px)', lineHeight: 0.96, marginBottom: '12px' }}>
            National scoreboard and
            <span style={{ color: 'var(--primary)' }}> official game links</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.8, maxWidth: '820px' }}>
            This board stays practical: matchup, score, broadcast window, and the official school destination that is most likely to have live or replay details.
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
                    {game.watchLabel ?? (game.status === 'final' ? 'Official recap' : 'Official game page')}
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
