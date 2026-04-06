import Link from 'next/link';
import { COLLEGE_RANKINGS } from '@/lib/college';

export default function CollegeRankingsPage() {
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
          <div className="section-tag" style={{ marginBottom: '16px' }}>TRACK THE FIELD</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(46px, 7vw, 86px)', lineHeight: 0.92, marginBottom: '16px' }}>
            COLLEGE<br /><span style={{ color: 'var(--primary)' }}>RANKINGS</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.8, maxWidth: '860px' }}>
            A curated snapshot board of the teams currently shaping the season, designed as the base for future poll tracking, RPI history, and resume comparison pages.
          </p>
        </div>
      </section>

      <section style={{ padding: '42px 0 80px' }}>
        <div className="container">
          <div className="card" style={{ padding: '26px' }}>
            <div style={{ display: 'grid', gap: '10px' }}>
              {COLLEGE_RANKINGS.map((row) => (
                <div key={row.rank} style={{ display: 'grid', gridTemplateColumns: '60px 1.3fr 120px 140px 1fr', gap: '14px', alignItems: 'center', padding: '14px 0', borderTop: '1px solid var(--border)' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '34px', color: 'var(--primary)' }}>{row.rank}</div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '28px', lineHeight: 1 }}>{row.school.toUpperCase()}</div>
                    {row.slug ? (
                      <Link href={`/college/teams/${row.slug}`} style={{ color: 'var(--primary)', fontFamily: 'var(--font-accent)', fontSize: '14px', letterSpacing: '0.12em' }}>
                        OPEN TEAM HUB
                      </Link>
                    ) : null}
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '24px' }}>{row.record}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Record</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '24px' }}>{row.conference}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Conference</div>
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6 }}>
                    {row.note}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
