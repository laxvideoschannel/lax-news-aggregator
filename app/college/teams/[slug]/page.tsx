'use client';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { use, useEffect, useState, useMemo } from 'react';
import { getCollegeTeam } from '@/lib/college';
import type { RosterPlayer } from '@/app/api/college-roster/route';

type Props = {
  params: Promise<{ slug: string }>;
};

const POSITION_LABELS: Record<string, string> = {
  A: 'Attack', M: 'Midfield', D: 'Defense', G: 'Goalie', LSM: 'LSM', SSDM: 'SSDM',
};

function PlayerCard({ player, primary }: { player: RosterPlayer; primary: string }) {
  const initials = player.name.split(' ').map((p: string) => p[0]).slice(0, 2).join('');
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '72px 1fr', gap: 16, padding: '16px 0', borderBottom: '1px solid var(--border)', alignItems: 'center' }}>
      <div style={{ position: 'relative', flexShrink: 0 }}>
        {player.imageUrl ? (
          <img src={player.imageUrl} alt={player.name}
            style={{ width: 72, height: 72, objectFit: 'cover', objectPosition: 'top', borderRadius: 10, border: '1px solid var(--border)', display: 'block' }}
            onError={(e) => { e.currentTarget.style.display = 'none'; (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex'; }} />
        ) : null}
        <div style={{ width: 72, height: 72, borderRadius: 10, border: '1px solid var(--border)', background: `color-mix(in srgb, ${primary} 15%, var(--bg-card))`, display: player.imageUrl ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 22, color: primary }}>
          {initials}
        </div>
        {player.number && (
          <div style={{ position: 'absolute', bottom: -4, right: -4, background: primary, color: '#fff', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 11, padding: '2px 5px', borderRadius: 4, lineHeight: 1.4 }}>
            #{player.number}
          </div>
        )}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, lineHeight: 1 }}>{player.name}</span>
          {player.position && <span style={{ fontFamily: 'var(--font-accent)', fontSize: 12, letterSpacing: '0.14em', color: primary }}>{POSITION_LABELS[player.position.toUpperCase()] || player.position}</span>}
          {player.classYear && <span style={{ fontFamily: 'var(--font-accent)', fontSize: 12, letterSpacing: '0.1em', color: 'var(--text-muted)' }}>{player.classYear}</span>}
        </div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 13, color: 'var(--text-muted)' }}>
          {player.hometown && <span>{player.hometown}</span>}
          {player.height && <span>{player.height}</span>}
          {player.weight && <span>{player.weight} lbs</span>}
        </div>
      </div>
    </div>
  );
}

function SkeletonRow() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '72px 1fr', gap: 16, padding: '16px 0', borderBottom: '1px solid var(--border)', alignItems: 'center' }}>
      <div style={{ width: 72, height: 72, borderRadius: 10, background: 'var(--bg-card)', opacity: 0.5 }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ height: 22, width: '45%', background: 'var(--bg-card)', borderRadius: 4, opacity: 0.5 }} />
        <div style={{ height: 14, width: '30%', background: 'var(--bg-card)', borderRadius: 4, opacity: 0.35 }} />
      </div>
    </div>
  );
}

export default function CollegeTeamPage({ params }: Props) {
  const { slug } = use(params);
  const team = getCollegeTeam(slug);

  const [liveRoster, setLiveRoster] = useState<RosterPlayer[] | null>(null);
  const [rosterLoading, setRosterLoading] = useState(true);
  const [rosterError, setRosterError] = useState(false);
  const [posFilter, setPosFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!team) return;
    setRosterLoading(true);
    setRosterError(false);
    fetch(`/api/college-roster?url=${encodeURIComponent(team.rosterUrl)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.players && d.players.length > 0) setLiveRoster(d.players);
        else setRosterError(true);
      })
      .catch(() => setRosterError(true))
      .finally(() => setRosterLoading(false));
  }, [team?.slug]);

  if (!team) { notFound(); }

  const seedRoster: RosterPlayer[] = team.roster.map((p) => ({
    name: p.name, number: p.number, position: p.position,
    classYear: p.classYear, hometown: p.hometown,
    imageUrl: p.imagePage ? `/api/player-image?url=${encodeURIComponent(p.imagePage)}` : undefined,
  }));

  const displayRoster: RosterPlayer[] = liveRoster ?? (rosterError ? seedRoster : []);

  const positions = useMemo(() => {
    const seen = new Set<string>();
    for (const p of displayRoster) {
      const pos = p.position?.toUpperCase().trim();
      if (pos) seen.add(pos);
    }
    return Array.from(seen).sort();
  }, [displayRoster]);

  const filtered = useMemo(() => displayRoster.filter((p) => {
    const matchPos = posFilter === 'ALL' || p.position?.toUpperCase().trim() === posFilter;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || (p.hometown || '').toLowerCase().includes(search.toLowerCase());
    return matchPos && matchSearch;
  }), [displayRoster, posFilter, search]);

  return (
    <div>
      {/* ── HEADER ── */}
      <section style={{ background: `linear-gradient(180deg, color-mix(in srgb, ${team.primary} 8%, var(--bg)) 0%, var(--bg) 100%)`, padding: '46px 0 28px', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <Link href="/college" style={{ fontFamily: 'var(--font-accent)', fontSize: 14, letterSpacing: '0.14em', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>
            ← BACK TO COLLEGE
          </Link>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 28, alignItems: 'end' }}>
            <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
              {team.logoUrl && <img src={team.logoUrl} alt={team.school} style={{ width: 72, height: 72, objectFit: 'contain', flexShrink: 0 }} />}
              <div>
                <div className="section-tag" style={{ marginBottom: 14 }}>{team.conference}</div>
                <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(34px, 5vw, 58px)', lineHeight: 0.96, marginBottom: 12 }}>
                  {team.school}<span style={{ color: team.primary }}> {team.nickname}</span>
                </h1>
                <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', color: 'var(--text-muted)', fontSize: 14 }}>
                  <span>{team.city}, {team.state}</span>
                  <span>{team.conference}</span>
                  <span>{team.record} record</span>
                  {team.ranking ? <span>No. {team.ranking} snapshot</span> : null}
                </div>
              </div>
            </div>
            <div className="card" style={{ padding: 20 }}>
              <div className="section-tag" style={{ marginBottom: 12 }}>QUICK LINKS</div>
              <div style={{ display: 'grid', gap: 10 }}>
                <a href={team.officialUrl} target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ textAlign: 'center' }}>Official Team Site</a>
                <a href={team.scheduleUrl} target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ textAlign: 'center' }}>Official Schedule</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROGRAM + SCHEDULE ── */}
      <section style={{ padding: '28px 0 22px' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '0.95fr 1.05fr', gap: 20 }}>
          <div className="card" style={{ padding: 24 }}>
            <div className="section-tag" style={{ marginBottom: 12 }}>PROGRAM NOTES</div>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.8, marginBottom: 18 }}>{team.recruitingAngle}</p>
            <div style={{ display: 'grid', gap: 12 }}>
              {team.strengths.map((item) => (
                <div key={item} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: team.primary, marginTop: 7, flexShrink: 0 }} />
                  <span style={{ color: 'var(--text)', fontSize: 14, lineHeight: 1.6 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="card" style={{ padding: 24 }}>
            <div className="section-tag" style={{ marginBottom: 12 }}>SCHEDULE WATCH</div>
            <div style={{ display: 'grid', gap: 12 }}>
              {team.featuredSchedule.map((game) => (
                <a key={game.slug} href={game.watchHref} target="_blank" rel="noreferrer"
                  style={{ display: 'grid', gridTemplateColumns: '92px 1fr auto', gap: 16, alignItems: 'center', padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <div className="section-tag" style={{ marginBottom: 8 }}>{game.dateLabel}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: 14 }}>{game.broadcast}</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 26, lineHeight: 1, marginBottom: 8 }}>
                      {game.location === 'away' ? '@' : 'VS'} {game.opponent}
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 6 }}>{game.venue}</div>
                    <div style={{ color: 'var(--text)', fontSize: 14, lineHeight: 1.6 }}>{game.notes}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'var(--font-accent)', fontSize: 13, letterSpacing: '0.12em', color: game.status === 'final' ? team.primary : 'var(--text-muted)', marginBottom: 8 }}>
                      {game.status === 'final' ? `${game.result} ${game.score || ''}`.trim() : 'UPCOMING'}
                    </div>
                    <div style={{ fontFamily: 'var(--font-accent)', fontSize: 13, letterSpacing: '0.12em', color: 'var(--primary)' }}>
                      {game.watchLabel ?? (game.status === 'final' ? 'RECAP' : 'GAME PAGE')}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── ROSTER ── */}
      <section style={{ padding: '0 0 80px' }}>
        <div className="container">
          <div className="card" style={{ padding: 28 }}>

            {/* Header row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, gap: 16, flexWrap: 'wrap' }}>
              <div>
                <div className="section-tag" style={{ marginBottom: 10 }}>ROSTER</div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(28px, 4vw, 42px)', lineHeight: 0.98 }}>
                  {team.school} <span style={{ color: team.primary }}>{team.nickname}</span>
                </h2>
                <div style={{ fontFamily: 'var(--font-accent)', fontSize: 12, letterSpacing: '0.14em', color: 'var(--text-muted)', marginTop: 6 }}>
                  {rosterLoading && 'LOADING ROSTER…'}
                  {!rosterLoading && liveRoster && `${liveRoster.length} PLAYERS · LIVE FROM OFFICIAL SITE`}
                  {!rosterLoading && rosterError && (
                    <>SHOWING FEATURED PLAYERS · <a href={team.rosterUrl} target="_blank" rel="noopener noreferrer" style={{ color: team.primary }}>FULL ROSTER ↗</a></>
                  )}
                </div>
              </div>
              <a href={team.rosterUrl} target="_blank" rel="noopener noreferrer" className="btn-outline">
                Official Roster Site ↗
              </a>
            </div>

            {/* Search + position filters */}
            {!rosterLoading && displayRoster.length > 0 && (
              <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
                <input type="text" placeholder="Search by name or hometown…" value={search} onChange={(e) => setSearch(e.target.value)}
                  style={{ flex: '1 1 200px', minWidth: 160, background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', fontFamily: 'var(--font-body)', fontSize: 14, padding: '9px 14px', outline: 'none' }} />
                <div style={{ display: 'flex', gap: 0, border: '1px solid var(--border)', flexShrink: 0, flexWrap: 'wrap' }}>
                  {(['ALL', ...positions]).map((pos, i, arr) => (
                    <button key={pos} onClick={() => setPosFilter(pos)}
                      style={{ fontFamily: 'var(--font-accent)', fontSize: 12, letterSpacing: '0.14em', padding: '9px 14px', cursor: 'pointer', border: 'none', borderRight: i < arr.length - 1 ? '1px solid var(--border)' : 'none', background: posFilter === pos ? team.primary : 'transparent', color: posFilter === pos ? '#fff' : 'var(--text-muted)', transition: 'all 0.15s' }}>
                      {pos === 'ALL' ? 'ALL' : (POSITION_LABELS[pos] || pos)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Player list */}
            {rosterLoading ? (
              <div>{[...Array(10)].map((_, i) => <SkeletonRow key={i} />)}</div>
            ) : filtered.length > 0 ? (
              <div>{filtered.map((player, i) => <PlayerCard key={`${player.name}-${i}`} player={player} primary={team.primary} />)}</div>
            ) : (
              <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
                {search ? `No players matching "${search}"` : 'No roster data available.'}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
