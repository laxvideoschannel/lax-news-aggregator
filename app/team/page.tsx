'use client';
import { useState, useEffect } from 'react';
import { CHAOS_SPOTLIGHTS, PLL_TEAMS, getTeam } from '@/lib/teams';

const CHAOS_ROSTER = [
  { name: 'Blaze Riorden', number: '30', pos: 'G', hometown: 'Fairport, NY', college: 'Albany', years: '7', highlight: '5× Goalie of the Year' },
  { name: 'Austin Kaut', number: '37', pos: 'G', hometown: 'Denver, CO', college: 'Denver', years: '4', highlight: 'Backup goalie & team backbone' },
  { name: 'Jack Rowlett', number: '4', pos: 'D', hometown: 'Chesapeake, VA', college: 'Duke', years: '5', highlight: '3× All-Star close defender' },
  { name: 'Jarrod Neumann', number: '22', pos: 'D', hometown: 'Smithtown, NY', college: 'Cornell', years: '5', highlight: '2024 All-Star' },
  { name: 'Troy Reh', number: '14', pos: 'LSM', hometown: 'Glen Cove, NY', college: 'Albany', years: '6', highlight: 'Elite long-stick midfielder' },
  { name: 'Shane Knobloch', number: '11', pos: 'A', hometown: 'Charlotte, NC', college: 'Duke', years: '3', highlight: '2026 Golden Stick Award — 30 pts' },
  { name: 'Pat Resch', number: '17', pos: 'SSDM', hometown: 'Cazenovia, NY', college: 'Penn State', years: '10', highlight: '10-year PLL veteran' },
  { name: 'Mark Glicini', number: '28', pos: 'SSDM', hometown: 'Commack, NY', college: 'Penn', years: '6', highlight: 'Team captain' },
  { name: 'Owen Hiltz', number: '8', pos: 'A', hometown: 'Toronto, ON', college: 'Virginia', years: '1', highlight: '2025 Draft pick — lefty attack' },
  { name: 'Josh Zawada', number: '5', pos: 'M', hometown: 'Orchard Park, NY', college: 'Michigan', years: '2', highlight: 'Rising star midfielder' },
  { name: 'Carter Parlette', number: '33', pos: 'SSDM', hometown: 'Annapolis, MD', college: 'Maryland', years: '2', highlight: 'Defensive specialist' },
  { name: 'Jack Posey', number: '44', pos: 'D', hometown: 'Medfield, MA', college: 'Princeton', years: '2', highlight: 'Emerging close defender' },
];

const POS_COLORS: Record<string, string> = {
  G: '#CC0000', D: '#1a1a1a', A: '#333', M: '#222', LSM: '#1a1a1a', SSDM: '#2a2a2a',
};

export default function TeamPage() {
  const [teamId, setTeamId] = useState('chaos');
  const [activePlayer, setActivePlayer] = useState(CHAOS_SPOTLIGHTS[0]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const saved = localStorage.getItem('lax_team') || 'chaos';
    setTeamId(saved);
  }, []);

  const team = getTeam(teamId);
  const positions = ['All', 'G', 'D', 'LSM', 'SSDM', 'M', 'A'];
  const filtered = filter === 'All' ? CHAOS_ROSTER : CHAOS_ROSTER.filter(p => p.pos === filter);

  return (
    <div>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0d0000 0%, #000 60%, #0a0a0a 100%)',
        padding: '80px 0 0', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', right: 0, top: 0, bottom: 0, width: '40%',
          background: 'var(--primary)', opacity: 0.05,
          clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0% 100%)',
        }} />
        <div style={{
          position: 'absolute', left: '10%', top: '50%', transform: 'translateY(-50%)',
          fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '220px',
          color: 'rgba(204,0,0,0.04)', lineHeight: 1, userSelect: 'none',
        }}>CHAOS</div>
        <div className="container" style={{ position: 'relative', zIndex: 2, paddingBottom: '60px' }}>
          <div className="section-tag" style={{ marginBottom: '16px' }}>2026 PLL CHAMPIONS</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(48px, 8vw, 96px)', lineHeight: 0.9, marginBottom: '24px' }}>
            {team.city.toUpperCase()}<br /><span style={{ color: 'var(--primary)' }}>{team.name.toUpperCase()}</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>2026 PLL Championship Series Winners · Western Conference</p>

          {/* Team quick stats */}
          <div style={{ display: 'flex', gap: '40px', marginTop: '40px' }}>
            {[
              { label: 'Championships', val: '2' },
              { label: 'Roster Size', val: '25' },
              { label: 'Conference', val: 'West' },
              { label: 'Founded', val: '2019' },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '40px', color: 'var(--primary)', lineHeight: 1 }}>{s.val}</div>
                <div style={{ fontFamily: 'var(--font-accent)', fontSize: '10px', letterSpacing: '0.15em', color: 'var(--text-muted)', marginTop: '4px' }}>{s.label.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FEATURED PLAYER SPOTLIGHT (bold Xtreme/SWORD style) ── */}
      <section style={{
        background: '#0a0000',
        padding: '80px 0',
        borderTop: '3px solid var(--primary)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', right: '-200px', top: '-200px',
          width: '600px', height: '600px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(204,0,0,0.08) 0%, transparent 60%)',
        }} />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
            {/* Left: giant typographic player visual */}
            <div style={{ position: 'relative' }}>
              {/* Circle backdrop */}
              <div style={{
                width: '380px', height: '380px', borderRadius: '50%',
                background: 'rgba(204,0,0,0.06)',
                border: '1px solid rgba(204,0,0,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative', margin: '0 auto',
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '120px', color: 'var(--primary)', lineHeight: 1, opacity: 0.7 }}>#{activePlayer.number}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '28px', color: '#fff', letterSpacing: '0.05em' }}>{activePlayer.position.toUpperCase()}</div>
                </div>
                {/* Rotating ring decoration */}
                <div style={{
                  position: 'absolute', inset: '-16px',
                  border: '1px dashed rgba(204,0,0,0.3)',
                  borderRadius: '50%',
                  animation: 'spin 20s linear infinite',
                }} />
              </div>
              {/* Name overlay */}
              <div style={{ textAlign: 'center', marginTop: '24px' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '48px', lineHeight: 0.95 }}>{activePlayer.name.toUpperCase()}</h2>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-muted)', marginTop: '8px' }}>
                  {activePlayer.hometown} · {activePlayer.college}
                </div>
              </div>
            </div>

            {/* Right: stats & bio */}
            <div>
              <div className="section-tag" style={{ marginBottom: '20px' }}>FEATURED ATHLETE</div>
              <p style={{ color: '#aaa', fontSize: '15px', lineHeight: 1.8, marginBottom: '36px' }}>{activePlayer.description}</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '36px' }}>
                {activePlayer.stats.map((s, i) => (
                  <div key={i} style={{
                    background: 'var(--bg-card)', border: '1px solid var(--border)',
                    padding: '20px', borderLeft: '3px solid var(--primary)',
                  }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '36px', color: 'var(--primary)', lineHeight: 1 }}>{s.value}</div>
                    <div style={{ fontFamily: 'var(--font-accent)', fontSize: '10px', letterSpacing: '0.1em', color: 'var(--text-muted)', marginTop: '4px' }}>{s.label.toUpperCase()}</div>
                  </div>
                ))}
              </div>

              <blockquote style={{ borderLeft: '3px solid var(--primary)', paddingLeft: '20px', fontStyle: 'italic', color: '#ccc', fontSize: '15px', lineHeight: 1.6, marginBottom: '32px' }}>
                "{activePlayer.quote}"
              </blockquote>

              {/* Switch between spotlights */}
              <div style={{ display: 'flex', gap: '10px' }}>
                {CHAOS_SPOTLIGHTS.map((p, i) => (
                  <button key={i} onClick={() => setActivePlayer(p)} style={{
                    padding: '8px 16px',
                    background: activePlayer.name === p.name ? 'var(--primary)' : 'transparent',
                    border: '1px solid',
                    borderColor: activePlayer.name === p.name ? 'var(--primary)' : 'var(--border)',
                    color: activePlayer.name === p.name ? '#fff' : 'var(--text-muted)',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-accent)', fontSize: '11px', letterSpacing: '0.1em',
                    transition: 'all 0.2s',
                  }}>{p.name.split(' ')[1].toUpperCase()}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </section>

      {/* ── FULL ROSTER ── */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
            <div>
              <div className="section-tag" style={{ marginBottom: '12px' }}>2026 ROSTER</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(28px, 4vw, 48px)' }}>
                MEET THE<br /><span style={{ color: 'var(--primary)' }}>TEAM</span>
              </h2>
            </div>
            {/* Position filter */}
            <div style={{ display: 'flex', gap: '4px' }}>
              {positions.map(p => (
                <button key={p} onClick={() => setFilter(p)} style={{
                  fontFamily: 'var(--font-accent)', fontSize: '11px', letterSpacing: '0.1em',
                  padding: '6px 14px', border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                  background: filter === p ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                  color: filter === p ? '#fff' : 'var(--text-muted)',
                }}>{p}</button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
            {filtered.map((player, i) => (
              <div key={i} className="card" style={{ overflow: 'hidden', cursor: 'default' }}>
                {/* Position color bar */}
                <div style={{ height: '4px', background: player.pos === 'G' ? 'var(--primary)' : 'var(--bg-card2)' }} />
                <div style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-accent)', fontSize: '10px', letterSpacing: '0.15em', color: 'var(--text-muted)', marginBottom: '4px' }}>{player.pos}</div>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '22px', lineHeight: 1 }}>{player.name}</h3>
                    </div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '40px', color: player.pos === 'G' ? 'var(--primary)' : 'rgba(255,255,255,0.1)', lineHeight: 1 }}>
                      #{player.number}
                    </div>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>{player.hometown}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>{player.college}</div>
                  <div style={{ padding: '8px 12px', background: 'rgba(204,0,0,0.08)', borderLeft: '2px solid var(--primary)', fontSize: '12px', color: '#ccc', lineHeight: 1.4 }}>
                    {player.highlight}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
