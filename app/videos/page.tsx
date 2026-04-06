'use client';

import { useEffect, useMemo, useState } from 'react';
import { getTeam } from '@/lib/teams';

type VideoLeague = 'PLL' | 'WLL' | 'CUSTOM';

type VideoItem = {
  id: string;
  title: string;
  youtubeUrl: string;
  embedUrl: string;
  thumbnailUrl: string;
  channelName: string;
  league: VideoLeague;
  source: 'official' | 'custom';
  publishedAt?: string;
  description?: string;
  featured?: boolean;
  teamId?: string | null;
};

export default function VideosPage() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [teamId, setTeamId] = useState('chaos');
  const [filter, setFilter] = useState<'TEAM' | 'ALL' | VideoLeague>('TEAM');

  useEffect(() => {
    const syncTeam = () => {
      setTeamId(localStorage.getItem('lax_team') || 'chaos');
    };

    syncTeam();
    window.addEventListener('storage', syncTeam);
    window.addEventListener('lax-team-change', syncTeam);
    return () => {
      window.removeEventListener('storage', syncTeam);
      window.removeEventListener('lax-team-change', syncTeam);
    };
  }, []);

  useEffect(() => {
    fetch('/api/videos')
      .then((response) => response.json())
      .then((data) => {
        setVideos(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const selectedTeam = getTeam(teamId);
  const teamKeywords = useMemo(() => {
    const combined = [
      selectedTeam.full,
      selectedTeam.city,
      selectedTeam.name,
      selectedTeam.id.replace(/-/g, ' '),
    ].join(' ').toLowerCase();

    return combined.split(/\s+/).filter(Boolean);
  }, [selectedTeam]);

  const filteredVideos = useMemo(() => {
    if (filter === 'ALL') return videos;
    if (filter === 'TEAM') {
      const exactTeamMatches = videos.filter((video) => {
        if (video.teamId) {
          return video.teamId === teamId;
        }
        const haystack = `${video.title} ${video.description || ''} ${video.channelName}`.toLowerCase();
        return teamKeywords.some((keyword) => haystack.includes(keyword));
      });
      return exactTeamMatches.length ? exactTeamMatches : videos.filter((video) => video.league === selectedTeam.league);
    }
    return videos.filter((video) => video.league === filter);
  }, [filter, selectedTeam.league, teamId, teamKeywords, videos]);

  const featuredVideo = filteredVideos.find((video) => video.featured) ?? filteredVideos[0];
  const featuredIsEmbeddable = Boolean(featuredVideo?.embedUrl && !featuredVideo.embedUrl.includes('listType='));

  return (
    <div>
      <section
        style={{
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(180deg, color-mix(in srgb, var(--primary) 10%, var(--bg)) 0%, var(--bg) 100%)',
          padding: '80px 0 56px',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'linear-gradient(color-mix(in srgb, var(--primary) 8%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--primary) 8%, transparent) 1px, transparent 1px)',
            backgroundSize: '42px 42px',
          }}
        />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="section-tag" style={{ marginBottom: '14px' }}>OFFICIAL + CURATED</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(48px, 8vw, 96px)', lineHeight: 0.9, marginBottom: '16px' }}>
            LACROSSE<br /><span style={{ color: 'var(--primary)' }}>VIDEOS</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.8, maxWidth: '760px', marginBottom: '30px' }}>
            Watch the latest YouTube videos from the official PLL and WLL channels, plus playlist videos you add privately from any channel you want to feature.
          </p>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {(['TEAM', 'ALL', 'PLL', 'WLL', 'CUSTOM'] as const).map((value) => (
              <button
                key={value}
                onClick={() => setFilter(value)}
                style={{
                  border: 'none',
                  cursor: 'pointer',
                  padding: '10px 16px',
                  background: filter === value ? 'var(--primary)' : 'color-mix(in srgb, var(--team-surface) 70%, transparent)',
                  color: filter === value ? '#fff' : 'var(--text-muted)',
                  fontFamily: 'var(--font-accent)',
                  fontSize: '11px',
                  letterSpacing: '0.14em',
                }}
              >
                {value === 'TEAM' ? `${selectedTeam.name.toUpperCase()} VIDEOS` : value === 'ALL' ? 'ALL VIDEOS' : value === 'CUSTOM' ? 'PLAYLIST' : value}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '40px 0 80px' }}>
        <div className="container">
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '20px' }}>
              <div className="card" style={{ minHeight: '420px', opacity: 0.5 }} />
              <div style={{ display: 'grid', gap: '20px' }}>
                <div className="card" style={{ minHeight: '200px', opacity: 0.5 }} />
                <div className="card" style={{ minHeight: '200px', opacity: 0.35 }} />
              </div>
            </div>
          ) : filteredVideos.length === 0 ? (
            <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '40px', marginBottom: '10px' }}>NO VIDEOS YET</div>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                Once the official feeds resolve or you add custom entries in the backend, they will appear here.
              </p>
            </div>
          ) : (
            <>
              {featuredVideo ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 0.75fr', gap: '20px', marginBottom: '24px' }}>
                  <div className="card" style={{ overflow: 'hidden' }}>
                    {featuredIsEmbeddable ? (
                      <iframe
                        src={featuredVideo.embedUrl}
                        title={featuredVideo.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        style={{ width: '100%', aspectRatio: '16 / 9', border: 'none', display: 'block' }}
                      />
                    ) : (
                      <a href={featuredVideo.youtubeUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'block', position: 'relative' }}>
                        <img
                          src={featuredVideo.thumbnailUrl}
                          alt={featuredVideo.title}
                          style={{ width: '100%', aspectRatio: '16 / 9', objectFit: 'cover', display: 'block' }}
                        />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.66) 100%)' }} />
                        <div
                          style={{
                            position: 'absolute',
                            bottom: '22px',
                            left: '22px',
                            width: '72px',
                            height: '72px',
                            borderRadius: '50%',
                            background: 'rgba(0,0,0,0.7)',
                            border: '2px solid rgba(255,255,255,0.9)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '28px',
                            color: '#fff',
                          }}
                        >
                          ▶
                        </div>
                      </a>
                    )}
                  </div>
                  <div className="card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div className="section-tag" style={{ marginBottom: '14px' }}>
                        {featuredVideo.source === 'custom' ? 'PLAYLIST' : `${featuredVideo.league} OFFICIAL`}
                      </div>
                      <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(28px, 4vw, 46px)', lineHeight: 0.94, marginBottom: '16px' }}>
                        {featuredVideo.title.toUpperCase()}
                      </h2>
                      <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.8, marginBottom: '18px' }}>
                        {featuredVideo.description || `Latest ${featuredVideo.league} video from ${featuredVideo.channelName}.`}
                      </p>
                    </div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-accent)', fontSize: '10px', letterSpacing: '0.14em', color: 'var(--primary)', marginBottom: '8px' }}>
                        {featuredVideo.channelName.toUpperCase()}
                      </div>
                      <a href={featuredVideo.youtubeUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
                        Watch on YouTube -&gt;
                      </a>
                    </div>
                  </div>
                </div>
              ) : null}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                {filteredVideos.map((video) => (
                  <a
                    key={video.id}
                    href={video.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card"
                    style={{ overflow: 'hidden', display: 'block' }}
                  >
                    <div style={{ position: 'relative' }}>
                      <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                        style={{ width: '100%', aspectRatio: '16 / 9', objectFit: 'cover', display: 'block' }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(180deg, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.62) 100%)',
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          bottom: '16px',
                          left: '16px',
                          width: '56px',
                          height: '56px',
                          borderRadius: '50%',
                          background: 'rgba(0,0,0,0.7)',
                          border: '2px solid rgba(255,255,255,0.8)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '22px',
                          color: '#fff',
                        }}
                      >
                        ▶
                      </div>
                    </div>
                    <div style={{ padding: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', alignItems: 'center', marginBottom: '12px' }}>
                        <span className="news-pill" style={{ background: video.league === 'PLL' ? 'var(--primary)' : video.league === 'WLL' ? 'var(--secondary)' : 'color-mix(in srgb, var(--primary) 55%, var(--secondary))' }}>
                          {video.league === 'CUSTOM' ? 'PLAYLIST' : video.league}
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          {video.publishedAt ? new Date(video.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : video.source.toUpperCase()}
                        </span>
                      </div>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '24px', lineHeight: 1.05, marginBottom: '12px' }}>
                        {video.title}
                      </h3>
                      <div style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '10px' }}>{video.channelName}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: 1.6 }}>
                        {(video.description || '').slice(0, 140)}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

