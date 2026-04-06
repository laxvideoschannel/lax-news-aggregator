import Link from 'next/link';
import { COLLEGE_STANDINGS } from '@/lib/college';

export default function CollegeStandingsPage() {
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
          <div className="section-tag" style={{ marginBottom: '16px' }}>CONFERENCE RACE</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(46px, 7vw, 86px)', lineHeight: 0.92, marginBottom: '16px' }}>
            COLLEGE<br /><span style={{ color: 'var(--primary)' }}>STANDINGS</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.8, maxWidth: '820px' }}>
            Snapshot boards for the major conference races we’re building out first. This is the foundation for a deeper standings product with sortable records, tiebreakers, and auto-updated results.
          </p>
        </div>
      </section>

      <section style={{ padding: '42px 0 80px' }}>
        <div className="container" style={{ display: 'grid', gap: '22px' }}>
          {COLLEGE_STANDINGS.map((conference) => (
            <div key={conference.conference} className="card" style={{ padding: '26px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', gap: '16px', flexWrap: 'wrap' }}>
                <div>
                  <div className="section-tag" style={{ marginBottom: '10px' }}>{conference.updatedLabel}</div>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(30px, 4vw, 46px)', lineHeight: 0.95 }}>
                    {conference.conference.toUpperCase()}
                  </h2>
                </div>
              </div>

              <div style={{ display: 'grid', gap: '10px' }}>
                {conference.rows.map((row, index) => (
                  <div key={row.school} style={{ display: 'grid', gridTemplateColumns: '50px 1fr 120px 120px 90px', gap: '14px', alignItems: 'center', padding: '14px 0', borderTop: index === 0 ? '1px solid var(--border)' : '1px solid var(--border)' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '30px', color: 'var(--primary)' }}>{index + 1}</div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '26px', lineHeight: 1 }}>{row.school.toUpperCase()}</div>
                      {row.slug ? (
                        <Link href={`/college/teams/${row.slug}`} style={{ color: 'var(--primary)', fontFamily: 'var(--font-accent)', fontSize: '14px', letterSpacing: '0.12em' }}>
                          OPEN TEAM HUB
                        </Link>
                      ) : null}
                    </div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '24px' }}>{row.overall}</div>
                      <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Overall</div>
                    </div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '24px' }}>{row.conferenceRecord}</div>
                      <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>League</div>
                    </div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '24px', color: 'var(--primary)' }}>{row.streak}</div>
                      <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Streak</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

