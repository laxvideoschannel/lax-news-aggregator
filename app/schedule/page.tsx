'use client';
import { useState } from 'react';

const SCHEDULE_2026 = [
  { date: 'Mar 8', day: 'Sun', home: 'Carolina Chaos', away: 'Utah Archers', time: '3:00 PM ET', location: 'Washington, D.C.', broadcast: 'ESPN+', type: 'Championship', result: 'W 24-16', final: true },
  { date: 'Mar 7', day: 'Sat', home: 'Carolina Chaos', away: 'Denver Outlaws', time: '7:00 PM ET', location: 'Washington, D.C.', broadcast: 'ESPN+', type: 'Semifinal', result: 'W 23-22', final: true },
  { date: 'Jun 7', day: 'Sat', home: 'Carolina Chaos', away: 'Denver Outlaws', time: '5:00 PM ET', location: 'Charlotte, NC', broadcast: 'ESPN+', type: 'Regular Season', result: 'W 12-9', final: true },
  { date: 'Jun 14', day: 'Sat', home: 'Maryland Whipsnakes', away: 'Carolina Chaos', time: '2:00 PM ET', location: 'Baltimore, MD', broadcast: 'ESPN2', type: 'Regular Season', result: null, final: false },
  { date: 'Jun 21', day: 'Sat', home: 'Carolina Chaos', away: 'Boston Cannons', time: '4:00 PM ET', location: 'Charlotte, NC', broadcast: 'ESPN+', type: 'Regular Season', result: null, final: false },
  { date: 'Jun 28', day: 'Sat', home: 'Utah Archers', away: 'Carolina Chaos', time: '6:00 PM ET', location: 'Salt Lake City, UT', broadcast: 'ESPN+', type: 'Regular Season', result: null, final: false },
  { date: 'Jul 5', day: 'Sat', home: 'Carolina Chaos', away: 'New York Atlas', time: '3:00 PM ET', location: 'Charlotte, NC', broadcast: 'ESPN', type: 'Regular Season', result: null, final: false },
  { date: 'Jul 12', day: 'Sat', home: 'California Redwoods', away: 'Carolina Chaos', time: '7:00 PM ET', location: 'Los Angeles, CA', broadcast: 'ESPN+', type: 'Regular Season', result: null, final: false },
  { date: 'Jul 19', day: 'Sat', home: 'Carolina Chaos', away: 'Philadelphia Waterdogs', time: '5:00 PM ET', location: 'Charlotte, NC', broadcast: 'ESPN2', type: 'Regular Season', result: null, final: false },
  { date: 'Jul 26', day: 'Sat', home: 'Carolina Chaos', away: 'Maryland Whipsnakes', time: '4:00 PM ET', location: 'Charlotte, NC', broadcast: 'ESPN+', type: 'Regular Season', result: null, final: false },
  { date: 'Aug 2', day: 'Sat', home: 'Denver Outlaws', away: 'Carolina Chaos', time: '8:00 PM ET', location: 'Denver, CO', broadcast: 'ESPN+', type: 'Regular Season', result: null, final: false },
  { date: 'Aug 9', day: 'Sat', home: 'Carolina Chaos', away: 'Utah Archers', time: '3:00 PM ET', location: 'Charlotte, NC', broadcast: 'ABC', type: 'Regular Season', result: null, final: false },
];

export default function SchedulePage() {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'results'>('all');

  const filtered = SCHEDULE_2026.filter(g => {
    if (filter === 'upcoming') return !g.final;
    if (filter === 'results') return g.final;
    return true;
  });

  return (
    <div>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(180deg, #0a0000 0%, var(--bg) 100%)',
        padding: '80px 0 60px', borderBottom: '1px solid var(--border)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(204,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(204,0,0,0.04) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="section-tag" style={{ marginBottom: '16px' }}>CAROLINA CHAOS</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(48px, 8vw, 96px)', lineHeight: 0.9, marginBottom: '24px' }}>
            2026<br /><span style={{ color: 'var(--primary)' }}>SCHEDULE</span>
          </h1>

          {/* Record banner */}
          <div style={{ display: 'flex', gap: '24px', marginTop: '36px' }}>
            {[
              { label: 'Season Record', val: '—', sub: 'Season begins Jun 14' },
              { label: 'Championship', val: '✓', sub: '2026 PLL Champions' },
              { label: 'Next Game', val: 'Jun 14', sub: 'at Maryland' },
              { label: 'Broadcast', val: 'ESPN', sub: 'Select games on ABC' },
            ].map(s => (
              <div key={s.label} style={{ borderLeft: '2px solid var(--primary)', paddingLeft: '16px' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '28px', color: 'var(--primary)', lineHeight: 1 }}>{s.val}</div>
                <div style={{ fontFamily: 'var(--font-accent)', fontSize: '10px', letterSpacing: '0.1em', color: '#fff', marginTop: '2px' }}>{s.label.toUpperCase()}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', position: 'sticky', top: '70px', zIndex: 100 }}>
        <div className="container" style={{ display: 'flex', gap: '0', height: '52px', alignItems: 'center' }}>
          {[['all', 'All Games'], ['results', 'Results'], ['upcoming', 'Upcoming']].map(([val, label]) => (
            <button key={val} onClick={() => setFilter(val as any)} style={{
              height: '100%', padding: '0 24px',
              fontFamily: 'var(--font-accent)', fontSize: '11px', letterSpacing: '0.15em',
              border: 'none', cursor: 'pointer', transition: 'all 0.2s',
              background: filter === val ? 'var(--primary)' : 'transparent',
              color: filter === val ? '#fff' : 'var(--text-muted)',
              borderBottom: filter === val ? 'none' : '2px solid transparent',
            }}>{label.toUpperCase()}</button>
          ))}
        </div>
      </div>

      {/* Schedule list */}
      <div className="container" style={{ padding: '48px 24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map((game, i) => {
            const isChaosHome = game.home === 'Carolina Chaos';
            const isChampionship = game.type !== 'Regular Season';
            return (
              <div key={i} className="card" style={{
                display: 'grid', gridTemplateColumns: '80px 1fr auto auto',
                gap: '24px', padding: '20px 24px', alignItems: 'center',
                borderLeft: isChampionship ? '3px solid var(--primary)' : '3px solid transparent',
              }}>
                {/* Date */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '28px', color: '#fff', lineHeight: 1 }}>
                    {game.date.split(' ')[1]}
                  </div>
                  <div style={{ fontFamily: 'var(--font-accent)', fontSize: '10px', letterSpacing: '0.1em', color: 'var(--primary)' }}>
                    {game.date.split(' ')[0].toUpperCase()}
                  </div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--text-muted)' }}>{game.day}</div>
                </div>

                {/* Teams */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                    {isChampionship && (
                      <span style={{ fontFamily: 'var(--font-accent)', fontSize: '9px', letterSpacing: '0.15em', color: '#fff', background: 'var(--primary)', padding: '2px 8px' }}>
                        {game.type.toUpperCase()}
                      </span>
                    )}
                    <span style={{ fontFamily: 'var(--font-accent)', fontSize: '9px', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
                      {isChaosHome ? 'HOME' : 'AWAY'}
                    </span>
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '20px', lineHeight: 1.1 }}>
                    <span style={{ color: isChaosHome ? '#fff' : 'var(--text-muted)' }}>{game.home}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '14px', margin: '0 8px' }}>vs</span>
                    <span style={{ color: !isChaosHome ? '#fff' : 'var(--text-muted)' }}>{game.away}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {game.location} · {game.time} · <span style={{ color: '#fff' }}>{game.broadcast}</span>
                  </div>
                </div>

                {/* Result or time */}
                <div style={{ textAlign: 'right' }}>
                  {game.result ? (
                    <div style={{
                      fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '22px',
                      color: game.result.startsWith('W') ? '#22c55e' : '#ef4444',
                    }}>{game.result}</div>
                  ) : (
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px', color: 'var(--text-muted)' }}>
                      {game.time.split(' ')[0]}
                    </div>
                  )}
                </div>

                {/* Arrow */}
                <div style={{ color: 'var(--primary)', fontSize: '18px' }}>→</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
