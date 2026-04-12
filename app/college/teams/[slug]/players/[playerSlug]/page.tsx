'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getCollegeTeam } from '@/lib/college';
import type { RosterPlayer } from '@/app/api/college-roster/route';

type Props = {
  params: { slug: string; playerSlug: string };
};

const POSITION_LABELS: Record<string, string> = {
  A: 'Attack', M: 'Midfield', D: 'Defense', G: 'Goalie', LSM: 'LSM', SSDM: 'SSDM',
  ATTACK: 'Attack', MIDFIELD: 'Midfield', DEFENSE: 'Defense', GOALIE: 'Goalie',
  MF: 'Midfield', DEF: 'Defense', ATT: 'Attack',
};

const POSITION_COLORS: Record<string, string> = {
  A: '#dc2626', ATT: '#dc2626', ATTACK: '#dc2626',
  M: '#2563eb', MF: '#2563eb', MIDFIELD: '#2563eb',
  D: '#16a34a', DEF: '#16a34a', DEFENSE: '#16a34a',
  G: '#d97706', GOALIE: '#d97706',
  LSM: '#7c3aed', SSDM: '#0891b2',
};

const POSITION_DESCRIPTIONS: Record<string, string> = {
  A: 'Attackmen are the primary scorers, operating near the crease and on the perimeter to create and finish offensive opportunities.',
  M: 'Midfielders are versatile two-way players who cover the full field, contributing on both offense and defense.',
  D: 'Defensemen anchor the backline, using physicality and positioning to shut down opposing attacks.',
  G: 'The last line of defense — goalies command the crease, direct the defense, and ignite fast breaks with outlets.',
  LSM: 'Long-stick midfielders provide defensive pressure across the midfield while offering transition threat.',
  SSDM: 'Short-stick defensive midfielders shut down opposing midfielders and protect the defensive zone.',
};

function nameToSlug(name: string) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

function getPosKey(position: string) {
  return position?.toUpperCase().trim().split(/[\/\s]/)[0] || '';
}

function StatBlock({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div style={{ padding: '18px 20px', background: 'var(--bg)', border: '1px solid var(--border)' }}>
      <div style={{ fontFamily: 'var(--font-accent)', fontSize: '10px', letterSpacing: '0.2em', color: 'var(--text-muted)', marginBottom: '6px' }}>
        {label}
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '24px', lineHeight: 1, color: accent || 'var(--text)' }}>
        {value || '—'}
      </div>
    </div>
  );
}

export default function PlayerProfilePage({ params }: Props) {
  const { slug, playerSlug } = params;
  const team = getCollegeTeam(slug);

  const [player, setPlayer] = useState<RosterPlayer | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (!team) return;
    fetch(`/api/college-roster?url=${encodeURIComponent(team.rosterUrl)}`)
      .then((r) => r.json())
      .then((d) => {
        const players: RosterPlayer[] = d.players ?? [];
        // Try matching by slug
        const match = players.find((p) => nameToSlug(p.name) === playerSlug);
        if (match) {
          setPlayer(match);
        } else {
          // Fall back to seed roster
          const seedMatch = team.roster.find((p) => nameToSlug(p.name) === playerSlug);
          if (seedMatch) {
            setPlayer({
              name: seedMatch.name,
              number: seedMatch.number,
              position: seedMatch.position,
              classYear: seedMatch.classYear,
              hometown: seedMatch.hometown,
              imageUrl: seedMatch.imagePage
                ? `/api/player-image?url=${encodeURIComponent(seedMatch.imagePage)}`
                : undefined,
            });
          } else {
            setNotFound(true);
          }
        }
        setLoading(false);
      })
      .catch(() => {
        // Try seed roster on error
        const seedMatch = team?.roster.find((p) => nameToSlug(p.name) === playerSlug);
        if (seedMatch) {
          setPlayer({
            name: seedMatch.name,
            number: seedMatch.number,
            position: seedMatch.position,
            classYear: seedMatch.classYear,
            hometown: seedMatch.hometown,
            imageUrl: seedMatch.imagePage
              ? `/api/player-image?url=${encodeURIComponent(seedMatch.imagePage)}`
              : undefined,
          });
        } else {
          setNotFound(true);
        }
        setLoading(false);
      });
  }, [slug, playerSlug, team]);

  if (!team) {
    return (
      <div className="container" style={{ padding: '80px 0' }}>
        <p style={{ color: 'var(--text-muted)' }}>Team not found.</p>
        <Link href="/college" className="btn-outline" style={{ marginTop: 16, display: 'inline-block' }}>← College Hub</Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div>
        <section style={{ position: 'relative', padding: '56px 0', borderBottom: '1px solid var(--border)', overflow: 'hidden' }}>
          {team.headerImageUrl && (
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: `url(${team.headerImageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center 30%',
              opacity: 0.18,
              filter: 'grayscale(60%)',
              zIndex: 0,
            }} />
          )}
          <div style={{
            position: 'absolute', inset: 0,
            background: `linear-gradient(180deg, color-mix(in srgb, ${team.primary} 22%, var(--bg)) 0%, var(--bg) 85%)`,
            zIndex: 1,
          }} />
          <div className="container" style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 48, alignItems: 'start' }}>
              <div style={{ width: 280, height: 340, borderRadius: 12, background: 'var(--bg-card)', opacity: 0.5 }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 24 }}>
                {[40, 60, 30, 70, 50].map((w, i) => (
                  <div key={i} style={{ height: i === 1 ? 52 : 16, width: `${w}%`, background: 'var(--bg-card)', borderRadius: 4, opacity: 0.5 }} />
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (notFound || !player) {
    return (
      <div className="container" style={{ padding: '80px 0' }}>
        <div className="section-tag" style={{ marginBottom: 14 }}>PLAYER NOT FOUND</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(36px, 5vw, 64px)', lineHeight: 0.92, marginBottom: 20 }}>
          COULDN'T FIND<br /><span style={{ color: 'var(--primary)' }}>THIS PLAYER</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 15, marginBottom: 28 }}>
          This player may not be on the current official roster or the name format has changed.
        </p>
        <Link href={`/college/teams/${slug}`} className="btn-primary">← Back to {team.school} Roster</Link>
      </div>
    );
  }

  const posKey = getPosKey(player.position || '');
  const posLabel = POSITION_LABELS[posKey] || player.position || '';
  const posColor = POSITION_COLORS[posKey] || team.primary;
  const posDescription = POSITION_DESCRIPTIONS[posKey] || '';
  const initials = player.name.split(' ').map((p: string) => p[0]).slice(0, 2).join('');

  return (
    <div>
      {/* ── HERO ── */}
      <section
        style={{
          padding: '48px 0 0',
          borderBottom: '1px solid var(--border)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background image */}
        {team.headerImageUrl && (
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${team.headerImageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 30%',
            opacity: 0.14,
            filter: 'grayscale(60%)',
            zIndex: 0,
          }} />
        )}
        {/* Color gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(160deg, color-mix(in srgb, ${team.primary} 20%, var(--bg)) 0%, var(--bg) 65%)`,
          zIndex: 1,
        }} />
        {/* Big number watermark */}
        {player.number && (
          <div style={{
            position: 'absolute', right: '-20px', bottom: '-30px',
            fontFamily: 'var(--font-display)', fontWeight: 900,
            fontSize: '340px', lineHeight: 1,
            color: team.primary, opacity: 0.06,
            pointerEvents: 'none', userSelect: 'none',
          }}>
            {player.number}
          </div>
        )}

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 28, flexWrap: 'wrap' }}>
            <Link href="/college" style={{ fontFamily: 'var(--font-accent)', fontSize: 12, letterSpacing: '0.14em', color: 'var(--text-muted)', textDecoration: 'none' }}>COLLEGE</Link>
            <span style={{ color: 'var(--border)' }}>/</span>
            <Link href={`/college/teams/${slug}`} style={{ fontFamily: 'var(--font-accent)', fontSize: 12, letterSpacing: '0.14em', color: 'var(--text-muted)', textDecoration: 'none' }}>{team.school.toUpperCase()}</Link>
            <span style={{ color: 'var(--border)' }}>/</span>
            <span style={{ fontFamily: 'var(--font-accent)', fontSize: 12, letterSpacing: '0.14em', color: 'var(--text)' }}>ROSTER</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 48, alignItems: 'end', paddingBottom: 48 }}>
            {/* Photo */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              {player.imageUrl && !imgError ? (
                <img
                  src={player.imageUrl}
                  alt={player.name}
                  onError={() => setImgError(true)}
                  style={{
                    width: '100%', aspectRatio: '3/4',
                    objectFit: 'cover', objectPosition: 'top',
                    borderRadius: 12,
                    border: `3px solid color-mix(in srgb, ${team.primary} 40%, var(--border))`,
                    boxShadow: `0 32px 80px color-mix(in srgb, ${team.primary} 20%, rgba(0,0,0,0.6))`,
                    display: 'block',
                  }}
                />
              ) : (
                <div style={{
                  width: '100%', aspectRatio: '3/4',
                  borderRadius: 12,
                  border: `3px solid color-mix(in srgb, ${team.primary} 40%, var(--border))`,
                  background: `color-mix(in srgb, ${team.primary} 15%, var(--bg-card))`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 72, color: team.primary,
                }}>
                  {initials}
                </div>
              )}
              {/* Team logo watermark on photo */}
              {team.logoUrl && (
                <div style={{ position: 'absolute', bottom: 12, right: 12, width: 44, height: 44, opacity: 0.85 }}>
                  <img src={team.logoUrl} alt={team.school} style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    onError={(e) => { (e.currentTarget.parentElement as HTMLElement).style.display = 'none'; }} />
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 14, flexWrap: 'wrap' }}>
                {posLabel && (
                  <span style={{ fontFamily: 'var(--font-accent)', fontSize: 11, letterSpacing: '0.18em', color: '#fff', background: posColor, padding: '5px 12px' }}>
                    {posLabel.toUpperCase()}
                  </span>
                )}
                <span style={{ fontFamily: 'var(--font-accent)', fontSize: 11, letterSpacing: '0.14em', color: team.primary }}>
                  {team.conference} · {team.school}
                </span>
              </div>

              <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(48px, 7vw, 88px)', lineHeight: 0.88, marginBottom: 20 }}>
                {player.name.split(' ')[0]}<br />
                <span style={{ color: team.primary }}>{player.name.split(' ').slice(1).join(' ')}</span>
              </h1>

              {/* Stat chips */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
                {player.number && (
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 18, color: '#fff', background: team.primary, padding: '6px 14px' }}>
                    #{player.number}
                  </div>
                )}
                {player.classYear && (
                  <div style={{ fontFamily: 'var(--font-accent)', fontSize: 12, letterSpacing: '0.14em', color: 'var(--text)', border: '1px solid var(--border)', padding: '6px 14px', background: 'var(--bg-card)' }}>
                    {player.classYear}
                  </div>
                )}
                {player.height && (
                  <div style={{ fontFamily: 'var(--font-accent)', fontSize: 12, letterSpacing: '0.14em', color: 'var(--text)', border: '1px solid var(--border)', padding: '6px 14px', background: 'var(--bg-card)' }}>
                    {player.height}
                  </div>
                )}
                {player.weight && (
                  <div style={{ fontFamily: 'var(--font-accent)', fontSize: 12, letterSpacing: '0.14em', color: 'var(--text)', border: '1px solid var(--border)', padding: '6px 14px', background: 'var(--bg-card)' }}>
                    {player.weight} LBS
                  </div>
                )}
              </div>

              {player.hometown && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>{player.hometown}</span>
                </div>
              )}

              <Link href={`/college/teams/${slug}`} style={{ fontFamily: 'var(--font-accent)', fontSize: 12, letterSpacing: '0.14em', color: 'var(--text-muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, borderBottom: '1px solid var(--border)', paddingBottom: 3 }}>
                ← BACK TO {team.school.toUpperCase()} ROSTER
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS + BIO ── */}
      <section style={{ padding: '48px 0 80px' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

            {/* Player profile card */}
            <div className="card" style={{ padding: 28 }}>
              <div className="section-tag" style={{ marginBottom: 14 }}>PLAYER PROFILE</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(24px, 3vw, 36px)', lineHeight: 0.95, marginBottom: 24 }}>
                BIO &amp; <span style={{ color: 'var(--primary)' }}>DETAILS</span>
              </h2>

              {/* Stats grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'var(--border)', marginBottom: 24 }}>
                <StatBlock label="POSITION" value={posLabel || '—'} accent={posColor} />
                <StatBlock label="JERSEY #" value={player.number ? `#${player.number}` : '—'} accent={team.primary} />
                <StatBlock label="CLASS" value={player.classYear || '—'} />
                <StatBlock label="HOMETOWN" value={player.hometown || '—'} />
                {player.height && <StatBlock label="HEIGHT" value={player.height} />}
                {player.weight && <StatBlock label="WEIGHT" value={`${player.weight} lbs`} />}
              </div>

              {posDescription && (
                <div>
                  <div style={{ fontFamily: 'var(--font-accent)', fontSize: 10, letterSpacing: '0.2em', color: posColor, marginBottom: 8 }}>ABOUT THE POSITION</div>
                  <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.8 }}>{posDescription}</p>
                </div>
              )}
            </div>

            {/* Team context card */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="card" style={{ padding: 28, flex: 1 }}>
                <div className="section-tag" style={{ marginBottom: 14 }}>TEAM</div>
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 18 }}>
                  {team.logoUrl && (
                    <img src={team.logoUrl} alt={team.school} style={{ width: 56, height: 56, objectFit: 'contain', flexShrink: 0 }}
                      onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }} />
                  )}
                  <div>
                    <div style={{ fontFamily: 'var(--font-accent)', fontSize: 11, letterSpacing: '0.16em', color: team.primary, marginBottom: 4 }}>{team.conference}</div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 32, lineHeight: 0.95 }}>
                      {team.school} <span style={{ color: team.primary }}>{team.nickname}</span>
                    </h3>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 6 }}>{team.city}, {team.state} · {team.record} record</div>
                  </div>
                </div>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: 20 }}>{team.overview}</p>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <Link href={`/college/teams/${slug}`} className="btn-primary">Full Roster →</Link>
                  <a href={team.officialUrl} target="_blank" rel="noopener noreferrer" className="btn-outline">Official Site ↗</a>
                </div>
              </div>

              <div className="card" style={{ padding: 24 }}>
                <div className="section-tag" style={{ marginBottom: 10 }}>UPCOMING GAMES</div>
                <div style={{ display: 'grid', gap: 10 }}>
                  {team.featuredSchedule.filter(g => g.status === 'upcoming').slice(0, 2).map((game) => (
                    <a key={game.slug} href={game.watchHref} target="_blank" rel="noopener noreferrer"
                      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: '12px 14px', background: 'var(--bg)', border: '1px solid var(--border)', textDecoration: 'none', transition: 'border-color 0.15s' }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = team.primary; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; }}
                    >
                      <div>
                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: 'var(--text)', lineHeight: 1.1, marginBottom: 3 }}>
                          {game.location === 'away' ? '@' : 'VS'} {game.opponent}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{game.dateLabel} · {game.broadcast}</div>
                      </div>
                      <div style={{ fontFamily: 'var(--font-accent)', fontSize: 11, letterSpacing: '0.12em', color: team.primary, flexShrink: 0 }}>GAME PAGE →</div>
                    </a>
                  ))}
                  {team.featuredSchedule.filter(g => g.status === 'upcoming').length === 0 && (
                    <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>No upcoming games in dataset.</p>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
