'use client';
import { useEffect, useState } from 'react';
import { CHAOS_SPOTLIGHTS, getTeam } from '@/lib/teams';

const CHAOS_ROSTER = [
  { name: 'Blaze Riorden', number: '30', pos: 'G', hometown: 'Fairport, NY', college: 'Albany', years: '7', highlight: '5x Goalie of the Year' },
  { name: 'Austin Kaut', number: '37', pos: 'G', hometown: 'Denver, CO', college: 'Denver', years: '4', highlight: 'Backup goalie & team backbone' },
  { name: 'Jack Rowlett', number: '4', pos: 'D', hometown: 'Chesapeake, VA', college: 'Duke', years: '5', highlight: '3x All-Star close defender' },
  { name: 'Jarrod Neumann', number: '22', pos: 'D', hometown: 'Smithtown, NY', college: 'Cornell', years: '5', highlight: '2024 All-Star' },
  { name: 'Troy Reh', number: '14', pos: 'LSM', hometown: 'Glen Cove, NY', college: 'Albany', years: '6', highlight: 'Elite long-stick midfielder' },
  { name: 'Shane Knobloch', number: '11', pos: 'A', hometown: 'Charlotte, NC', college: 'Duke', years: '3', highlight: '2026 Golden Stick Award - 30 pts' },
  { name: 'Pat Resch', number: '17', pos: 'SSDM', hometown: 'Cazenovia, NY', college: 'Penn State', years: '10', highlight: '10-year PLL veteran' },
  { name: 'Mark Glicini', number: '28', pos: 'SSDM', hometown: 'Commack, NY', college: 'Penn', years: '6', highlight: 'Team captain' },
  { name: 'Owen Hiltz', number: '8', pos: 'A', hometown: 'Toronto, ON', college: 'Virginia', years: '1', highlight: '2025 Draft pick - lefty attack' },
  { name: 'Josh Zawada', number: '5', pos: 'M', hometown: 'Orchard Park, NY', college: 'Michigan', years: '2', highlight: 'Rising star midfielder' },
  { name: 'Carter Parlette', number: '33', pos: 'SSDM', hometown: 'Annapolis, MD', college: 'Maryland', years: '2', highlight: 'Defensive specialist' },
  { name: 'Jack Posey', number: '44', pos: 'D', hometown: 'Medfield, MA', college: 'Princeton', years: '2', highlight: 'Emerging close defender' },
];

function getPlayerImageSrc(imagePage: string) {
  return `/api/player-image?url=${encodeURIComponent(imagePage)}`;
}

export default function TeamPage() {
  const [teamId, setTeamId] = useState('chaos');
  const [activePlayer, setActivePlayer] = useState(CHAOS_SPOTLIGHTS[0]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const saved = localStorage.getItem('lax_team') || 'chaos';
    setTeamId(saved);
  }, []);

  const team = getTeam(teamId);
  const conferenceShort = team.conference === 'Eastern' ? 'East' : 'West';
  const positions = ['All', 'G', 'D', 'LSM', 'SSDM', 'M', 'A'];
  const filtered = filter === 'All' ? CHAOS_ROSTER : CHAOS_ROSTER.filter((player) => player.pos === filter);

  return (
    <div>
      <div
        style={{
          background: 'linear-gradient(135deg, #0d0000 0%, #000 60%, #0a0a0a 100%)',
          padding: '80px 0 0',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: '40%',
            background: 'var(--primary)',
            opacity: 0.05,
            clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0% 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '10%',
            top: '50%',
            transform: 'translateY(-50%)',
            fontFamily: 'var(--font-display)',
            fontWeight: 900,
            fontSize: '220px',
            color: 'rgba(204,0,0,0.04)',
            lineHeight: 1,
            userSelect: 'none',
          }}
        >
          CHAOS
        </div>
        <div className="container" style={{ position: 'relative', zIndex: 2, paddingBottom: '60px' }}>
          <div className="section-tag" style={{ marginBottom: '16px' }}>2026 PLL CHAMPIONS</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(48px, 8vw, 96px)', lineHeight: 0.9, marginBottom: '24px' }}>
            {team.city.toUpperCase()}<br /><span style={{ color: 'var(--primary)' }}>{team.name.toUpperCase()}</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>2026 PLL Championship Series Winners - {team.conference} Conference</p>

          <div style={{ display: 'flex', gap: '40px', marginTop: '40px' }}>
            {[
              { label: 'Championships', val: '2' },
              { label: 'Roster Size', val: '25' },
              { label: 'Conference', val: conferenceShort },
              { label: 'Founded', val: '2019' },
            ].map((stat) => (
              <div key={stat.label}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '40px', color: 'var(--primary)', lineHeight: 1 }}>{stat.val}</div>
                <div style={{ fontFamily: 'var(--font-accent)', fontSize: '10px', letterSpacing: '0.15em', color: 'var(--text-muted)', marginTop: '4px' }}>{stat.label.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section
        style={{
          background: '#0a0000',
          padding: '80px 0',
          borderTop: '3px solid var(--primary)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            right: '-200px',
            top: '-200px',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(204,0,0,0.08) 0%, transparent 60%)',
          }}
        />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  width: '380px',
                  height: '380px',
                  borderRadius: '50%',
                  background: 'rgba(204,0,0,0.08)',
                  border: '1px solid rgba(204,0,0,0.2)',
                  position: 'relative',
                  margin: '0 auto',
                  overflow: 'hidden',
                  boxShadow: '0 30px 80px rgba(0,0,0,0.45)',
                }}
              >
                <img
                  src={getPlayerImageSrc(activePlayer.imagePage)}
                  alt={activePlayer.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center top',
                    filter: 'grayscale(1) contrast(1.08) brightness(0.82)',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.2) 55%, rgba(10,0,0,0.9) 100%)',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: '-16px',
                    border: '1px dashed rgba(204,0,0,0.3)',
                    borderRadius: '50%',
                    animation: 'spin 20s linear infinite',
                  }}
                />
              </div>
              <div
                style={{
                  position: 'absolute',
                  top: '58%',
                  right: '-36px',
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '2px',
                  pointerEvents: 'none',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 900,
                    fontSize: '76px',
                    color: 'var(--primary)',
                    lineHeight: 0.9,
                    textShadow: '0 10px 30px rgba(0,0,0,0.45)',
                  }}
                >
                  #{activePlayer.number}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 900,
                    fontSize: '20px',
                    color: '#fff',
                    letterSpacing: '0.05em',
                    lineHeight: 1,
                    textShadow: '0 10px 30px rgba(0,0,0,0.45)',
                    maxWidth: '160px',
                  }}
                >
                  {activePlayer.position.toUpperCase()}
                </div>
              </div>
              <div style={{ textAlign: 'center', marginTop: '24px' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '48px', lineHeight: 0.95 }}>{activePlayer.name.toUpperCase()}</h2>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-muted)', marginTop: '8px' }}>
                  {activePlayer.hometown} - {activePlayer.college}
                </div>
              </div>
            </div>

            <div>
              <div className="section-tag" style={{ marginBottom: '20px' }}>FEATURED ATHLETE</div>
              <p style={{ color: '#aaa', fontSize: '15px', lineHeight: 1.8, marginBottom: '36px' }}>{activePlayer.description}</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '36px' }}>
                {activePlayer.stats.map((stat, index) => (
                  <div
                    key={index}
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      padding: '20px',
                      borderLeft: '3px solid var(--primary)',
                    }}
                  >
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '36px', color: 'var(--primary)', lineHeight: 1 }}>{stat.value}</div>
                    <div style={{ fontFamily: 'var(--font-accent)', fontSize: '10px', letterSpacing: '0.1em', color: 'var(--text-muted)', marginTop: '4px' }}>{stat.label.toUpperCase()}</div>
                  </div>
                ))}
              </div>

              <blockquote style={{ borderLeft: '3px solid var(--primary)', paddingLeft: '20px', fontStyle: 'italic', color: '#ccc', fontSize: '15px', lineHeight: 1.6, marginBottom: '32px' }}>
                "{activePlayer.quote}"
              </blockquote>

              <div style={{ display: 'flex', gap: '10px' }}>
                {CHAOS_SPOTLIGHTS.map((player, index) => (
                  <button
                    key={index}
                    onClick={() => setActivePlayer(player)}
                    style={{
                      padding: '8px 10px 8px 8px',
                      background: activePlayer.name === player.name ? 'var(--primary)' : 'transparent',
                      border: '1px solid',
                      borderColor: activePlayer.name === player.name ? 'var(--primary)' : 'var(--border)',
                      color: activePlayer.name === player.name ? '#fff' : 'var(--text-muted)',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-accent)',
                      fontSize: '11px',
                      letterSpacing: '0.1em',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <img
                      src={getPlayerImageSrc(player.imagePage)}
                      alt={player.name}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        objectPosition: 'center top',
                        border: '1px solid rgba(255,255,255,0.15)',
                        filter: 'grayscale(1) contrast(1.08) brightness(0.86)',
                      }}
                    />
                    <span>{player.name.split(' ')[1].toUpperCase()}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </section>

      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
            <div>
              <div className="section-tag" style={{ marginBottom: '12px' }}>2026 ROSTER</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(28px, 4vw, 48px)' }}>
                MEET THE<br /><span style={{ color: 'var(--primary)' }}>TEAM</span>
              </h2>
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              {positions.map((position) => (
                <button
                  key={position}
                  onClick={() => setFilter(position)}
                  style={{
                    fontFamily: 'var(--font-accent)',
                    fontSize: '11px',
                    letterSpacing: '0.1em',
                    padding: '6px 14px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: filter === position ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                    color: filter === position ? '#fff' : 'var(--text-muted)',
                  }}
                >
                  {position}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
            {filtered.map((player, index) => (
              <div key={index} className="card" style={{ overflow: 'hidden', cursor: 'default' }}>
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
