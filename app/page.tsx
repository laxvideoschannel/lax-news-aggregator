'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { getTeam } from '@/lib/teams';
import { getTeamPageContent } from '@/lib/team-content';
import { getNextUpcomingGameForTeam, getTeamSeasonRecord } from '@/lib/schedule';

type VideoItem = {
  id: string;
  title: string;
  youtubeUrl: string;
  embedUrl: string;
  thumbnailUrl: string;
  channelName: string;
  league: 'PLL' | 'WLL' | 'CUSTOM';
  source: 'official' | 'custom';
  publishedAt?: string;
  description?: string;
  featured?: boolean;
  teamId?: string | null;
};

type VideoFilter = 'ALL' | 'PLL' | 'WLL' | 'MY VIDEOS';

type ArticleData = {
  title?: string;
  author?: string;
  paragraphs?: string[];
  image?: string;
  description?: string;
  sourceUrl?: string;
  canEmbed?: boolean;
  error?: string;
};

const PLL_TICKETS_URL = 'https://premierlacrosseleague.com/schedule';
const WLL_TICKETS_URL = 'https://thewll.com/schedule';

function ArticleModal({ item, onClose }: { item: any; onClose: () => void }) {
  const [article, setArticle] = useState<ArticleData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/news-article?url=${encodeURIComponent(item.link)}`)
      .then(r => r.json())
      .then(d => { setArticle(d); setLoading(false); })
      .catch(() => { setArticle({ canEmbed: false }); setLoading(false); });
  }, [item.link]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', handler); document.body.style.overflow = ''; };
  }, [onClose]);

  const displayImage = article?.image || item.image_url;
  const paragraphs = article?.paragraphs || [];
  const hasContent = !loading && paragraphs.length > 0;

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', width: '100%', maxWidth: '760px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}
      >
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 10, background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border)', color: '#fff', width: '36px', height: '36px', cursor: 'pointer', fontFamily: 'var(--font-accent)', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >&#x2715;</button>

        {displayImage && (
          <div style={{ aspectRatio: '16/9', overflow: 'hidden', position: 'relative' }}>
            <img src={displayImage} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} onError={e => { (e.currentTarget.parentElement as HTMLElement).style.display = 'none'; }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.6) 100%)' }} />
          </div>
        )}

        <div style={{ padding: '28px 32px 32px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
            <span className="news-pill">{item.category || 'General'}</span>
            {item.source && <span style={{ fontFamily: 'var(--font-accent)', fontSize: '12px', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>{item.source.toUpperCase()}</span>}
            {item.published_at && <span style={{ fontFamily: 'var(--font-accent)', fontSize: '12px', color: 'var(--text-muted)' }}>{new Date(item.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>}
          </div>

          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(24px, 4vw, 38px)', lineHeight: 1.05, color: 'var(--text)', marginBottom: '8px' }}>{article?.title || item.title}</h2>
          {article?.author && <div style={{ fontFamily: 'var(--font-accent)', fontSize: '13px', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '24px' }}>BY {article.author.toUpperCase()}</div>}

          <div style={{ width: '48px', height: '3px', background: 'var(--primary)', marginBottom: '24px' }} />

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[100, 85, 92, 78].map((w, i) => (
                <div key={i} style={{ height: '14px', background: 'var(--bg)', opacity: 0.6, width: `${w}%` }} />
              ))}
            </div>
          ) : hasContent ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {paragraphs.map((p: string, i: number) => (
                <p key={i} style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.8, margin: 0 }}>{p}</p>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.8 }}>{item.summary || article?.description || 'Unable to load article content.'}</p>
          )}

          <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Source: {item.source}</span>
            <a href={item.link} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ fontSize: '13px' }}>
              Read Full Article &rarr;
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}


function PlayButton({ size = 56 }: { size?: number }) {
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: 'rgba(0,0,0,0.75)', border: '2px solid rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <svg width={size * 0.35} height={size * 0.35} viewBox="0 0 24 24" fill="white"><polygon points="5,3 19,12 5,21" /></svg>
    </div>
  );
}

function VideoCard({ video }: { video: VideoItem }) {
  const leagueLabel = video.league === 'CUSTOM' ? 'MY VIDEOS' : video.league;
  return (
    <a href={video.youtubeUrl} target="_blank" rel="noopener noreferrer" className="card"
      style={{ overflow: 'hidden', display: 'block', padding: 0, textDecoration: 'none', transition: 'transform 0.2s, border-color 0.2s' }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = 'var(--primary)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'var(--border)'; }}>
      <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden', background: '#000' }}>
        <img src={video.thumbnailUrl} alt={video.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.65) 100%)', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '14px' }}>
          <PlayButton size={42} />
          <span style={{ fontFamily: 'var(--font-accent)', fontSize: '11px', letterSpacing: '0.12em', padding: '4px 10px', background: video.league === 'WLL' ? 'var(--secondary,#1a3a6e)' : 'var(--primary)', color: '#fff' }}>
            {leagueLabel}
          </span>
        </div>
      </div>
      <div style={{ padding: '18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontFamily: 'var(--font-accent)', fontSize: '12px', color: 'var(--text-muted)' }}>{video.channelName}</span>
          <span style={{ fontFamily: 'var(--font-accent)', fontSize: '12px', color: 'var(--text-muted)' }}>
            {video.publishedAt ? new Date(video.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
          </span>
        </div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '22px', lineHeight: 1.05, color: 'var(--text)' }}>{video.title}</h3>
      </div>
    </a>
  );
}

export default function HomePage() {
  const [teamId, setTeamId] = useState('chaos');
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [videosLoading, setVideosLoading] = useState(true);
  const [videoFilter, setVideoFilter] = useState<VideoFilter>('ALL');
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [spotlight, setSpotlight] = useState<any>(null);
  const [spotlightLoading, setSpotlightLoading] = useState(true);
  const [spotlightIndex, setSpotlightIndex] = useState(0);
  const [news, setNews] = useState<any[]>([]);
  const [showFilmCta, setShowFilmCta] = useState(false);
  const [selectedNewsItem, setSelectedNewsItem] = useState<any | null>(null);

  useEffect(() => {
    const sync = () => setTeamId(localStorage.getItem('lax_team') || 'chaos');
    sync();
    window.addEventListener('storage', sync);
    window.addEventListener('lax-team-change', sync);
    return () => { window.removeEventListener('storage', sync); window.removeEventListener('lax-team-change', sync); };
  }, []);

  useEffect(() => {
    fetch('/api/videos').then((r) => r.json()).then((d) => { setVideos(Array.isArray(d) ? d : []); setVideosLoading(false); }).catch(() => setVideosLoading(false));
    fetch('/api/news').then((r) => r.json()).then((d) => setNews(Array.isArray(d) ? d.slice(0, 4) : [])).catch(() => {});
    fetch('/api/settings').then((r) => r.json()).then((d) => setShowFilmCta(Boolean(d.showFilmCta))).catch(() => {});
  }, []);

  const loadSpotlight = useCallback((team: string, idx?: number) => {
    setSpotlightLoading(true);
    fetch(`/api/player-spotlight?team=${team}${idx !== undefined ? `&player=${idx}` : ''}`)
      .then((r) => r.json()).then((d) => { setSpotlight(d); setSpotlightIndex(d.playerIndex ?? 0); setSpotlightLoading(false); })
      .catch(() => setSpotlightLoading(false));
  }, []);

  useEffect(() => { if (teamId) loadSpotlight(teamId); }, [teamId, loadSpotlight]);

  const team = getTeam(teamId);
  const pageContent = useMemo(() => getTeamPageContent(teamId), [teamId]);
  const seasonRecord = useMemo(() => getTeamSeasonRecord(teamId), [teamId]);
  const nextGame = useMemo(() => getNextUpcomingGameForTeam(teamId), [teamId]);
  const opponentTeam = useMemo(() => {
    if (!nextGame) return null;
    const oppId = nextGame.homeId === teamId ? nextGame.awayId : nextGame.homeId;
    return getTeam(oppId);
  }, [nextGame, teamId]);
  const ticketHref = useMemo(() => nextGame?.ticketUrl || (team.league === 'WLL' ? WLL_TICKETS_URL : PLL_TICKETS_URL), [nextGame, team]);
  const titleCount = useMemo(() => parseInt(pageContent.championships.replace(/\D/g, '') || '0', 10), [pageContent]);
  const hasCustomVideos = videos.some((v) => v.league === 'CUSTOM');

  const filteredVideos = useMemo(() => {
    if (videoFilter === 'ALL') return videos;
    if (videoFilter === 'MY VIDEOS') return videos.filter((v) => v.league === 'CUSTOM');
    return videos.filter((v) => v.league === videoFilter);
  }, [videos, videoFilter]);

  const featuredVideo = filteredVideos.find((v) => v.featured) ?? filteredVideos[0];
  const sideVideos = filteredVideos.filter((v) => v !== featuredVideo).slice(0, 2);
  const gridVideos = filteredVideos.filter((v) => v !== featuredVideo).slice(0, 6);
  const visibleAccolades = (spotlight?.accolades || []).filter((a: string) => !a.includes('PLL Professional'));

  return (
    <div>

      {/* ─── VIDEO HERO ─── */}
      <section className="video-hero" style={{ position: 'relative', background: 'var(--bg)', overflow: 'hidden', borderBottom: '1px solid var(--border)' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(color-mix(in srgb, var(--primary) 5%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--primary) 5%, transparent) 1px, transparent 1px)', backgroundSize: '52px 52px', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 40% at 50% 0%, color-mix(in srgb, var(--primary) 9%, transparent) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, paddingTop: '56px', paddingBottom: '56px' }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px', flexWrap: 'wrap' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(44px, 7vw, 88px)', lineHeight: 0.9, color: 'var(--text)' }}>
              LACROSSE <span style={{ color: 'var(--primary)' }}>VIDEOS</span>
            </h1>
            <div style={{ display: 'flex', gap: 0, border: '1px solid var(--border)', flexShrink: 0 }}>
              {(['ALL', 'PLL', 'WLL', ...(hasCustomVideos ? ['MY VIDEOS' as VideoFilter] : [])] as VideoFilter[]).map((f, i, arr) => (
                <button key={f} onClick={() => { setVideoFilter(f); setActiveVideoId(null); }}
                  style={{ fontFamily: 'var(--font-accent)', fontSize: '13px', letterSpacing: '0.14em', padding: '10px 20px', background: videoFilter === f ? 'var(--primary)' : 'transparent', color: videoFilter === f ? '#fff' : 'var(--text)', border: 'none', borderRight: i < arr.length - 1 ? '1px solid var(--border)' : 'none', cursor: 'pointer', transition: 'all 0.2s' }}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {videosLoading ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1.55fr 1fr', gap: '16px' }}>
              <div style={{ background: 'var(--bg-card)', aspectRatio: '16/9', opacity: 0.5 }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ background: 'var(--bg-card)', flex: 1, opacity: 0.5 }} />
                <div style={{ background: 'var(--bg-card)', flex: 1, opacity: 0.35 }} />
              </div>
            </div>
          ) : filteredVideos.length === 0 ? (
            <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>No videos yet — add channels or individual videos in the admin panel.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1.55fr 1fr', gap: '16px', alignItems: 'stretch' }}>
              {/* Main player */}
              {featuredVideo && (
                <div style={{ background: '#000', border: '1px solid var(--border)', overflow: 'hidden', position: 'relative', aspectRatio: '16/9', width: '100%', minWidth: 0 }}>
                  {activeVideoId === featuredVideo.id ? (
                    <iframe src={`${featuredVideo.embedUrl}?autoplay=1`} allow="autoplay; fullscreen; encrypted-media" allowFullScreen style={{ width: '100%', height: '100%', border: 'none', display: 'block' }} title={featuredVideo.title} />
                  ) : (
                    <div style={{ position: 'relative', width: '100%', height: '100%', cursor: 'pointer' }} onClick={() => setActiveVideoId(featuredVideo.id)}>
                      <img src={featuredVideo.thumbnailUrl} alt={featuredVideo.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.78) 100%)', display: 'flex', alignItems: 'flex-end', padding: '28px' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '20px' }}>
                          <PlayButton size={72} />
                          <div>
                            <div style={{ fontFamily: 'var(--font-accent)', fontSize: '12px', letterSpacing: '0.2em', color: 'var(--primary)', marginBottom: '8px' }}>
                              {featuredVideo.league === 'CUSTOM' ? 'MY VIDEOS' : `${featuredVideo.league} OFFICIAL`}
                            </div>
                            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(22px, 3vw, 38px)', lineHeight: 1.05, color: '#fff' }}>
                              {featuredVideo.title}
                            </div>
                            <div style={{ fontFamily: 'var(--font-accent)', fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '6px', letterSpacing: '0.08em' }}>
                              {featuredVideo.channelName}
                              {featuredVideo.publishedAt ? ` · ${new Date(featuredVideo.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}` : ''}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Side stack */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
                {sideVideos.map((v) => (
                  <div key={v.id}
                    onClick={() => { setActiveVideoId(null); window.open(v.youtubeUrl, '_blank'); }}
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', overflow: 'hidden', cursor: 'pointer', transition: 'border-color 0.2s', position: 'relative', flex: 1, minHeight: 0, width: '100%' }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--primary)')}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}>
                    <img src={v.thumbnailUrl} alt={v.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.75) 100%)', display: 'flex', alignItems: 'flex-end', padding: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
                        <PlayButton size={36} />
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontFamily: 'var(--font-accent)', fontSize: '11px', letterSpacing: '0.18em', color: 'var(--primary)', marginBottom: '4px' }}>
                            {v.league === 'CUSTOM' ? 'MY VIDEOS' : `${v.league} OFFICIAL`}
                          </div>
                          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(14px, 1.6vw, 20px)', lineHeight: 1.05, color: '#fff', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                            {v.title}
                          </div>
                          <div style={{ fontFamily: 'var(--font-accent)', fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
                            {v.publishedAt ? new Date(v.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : v.channelName}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─── TEAM FAN HUB ─── */}
      <section style={{ padding: '80px 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'start' }}>

            {/* Stats side */}
            <div>
              <div className="section-tag" style={{ marginBottom: '14px' }}>{team.league} · FAN HUB</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(52px, 8vw, 100px)', lineHeight: 0.88, marginBottom: '24px' }}>
                <span style={{ display: 'block' }}>{team.city.toUpperCase()}</span>
                <span style={{ display: 'block', color: 'var(--primary)', WebkitTextStroke: '2px var(--primary)', WebkitTextFillColor: 'transparent' } as any}>{team.name.toUpperCase()}</span>
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.7, marginBottom: '32px', maxWidth: '420px' }}>
                Your home for {team.full} and the wider {team.league} world. Pick any team from the header to re-theme the hub.
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '40px' }}>
                <Link href="/videos" className="btn-primary">Watch Videos →</Link>
                <Link href="/team" className="btn-outline">View Roster</Link>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="card" style={{ padding: '22px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '3px', height: '100%', background: 'var(--primary)' }} />
                  <div className="stat-num">{titleCount === 0 ? '0' : pageContent.championships}</div>
                  <div style={{ fontFamily: 'var(--font-accent)', fontSize: '13px', letterSpacing: '0.1em', marginTop: '6px', marginBottom: '4px' }}>CHAMPIONSHIPS</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{titleCount === 0 ? `No ${team.league} titles yet` : `${team.league} wins`}</div>
                </div>
                <div className="card" style={{ padding: '22px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '3px', height: '100%', background: 'var(--primary)' }} />
                  <div className="stat-num">{team.league === 'WLL' && seasonRecord.played === 0 ? '—' : `${seasonRecord.wins}-${seasonRecord.losses}`}</div>
                  <div style={{ fontFamily: 'var(--font-accent)', fontSize: '13px', letterSpacing: '0.1em', marginTop: '6px', marginBottom: '4px' }}>2026 RECORD</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{seasonRecord.played} games played</div>
                </div>
                <div className="card" style={{ padding: '22px', gridColumn: '1 / -1', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '3px', height: '100%', background: 'var(--primary)' }} />
                  <div style={{ fontFamily: 'var(--font-accent)', fontSize: '13px', letterSpacing: '0.1em', marginBottom: '12px' }}>NEXT UP</div>
                  {nextGame && opponentTeam ? (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                      <div>
                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(22px, 3vw, 32px)', lineHeight: 1.1, marginBottom: '6px' }}>vs {opponentTeam.full}</div>
                        <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{nextGame.dateLabel} · {nextGame.time}<br />{nextGame.venue}</div>
                      </div>
                      <a href={ticketHref} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ display: 'inline-block', flexShrink: 0 }}>Tickets →</a>
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                        {team.league === 'WLL' ? "Pro women's slate lives on the WLL site." : 'No upcoming match in current dataset.'}
                      </div>
                      <a href={ticketHref} target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ display: 'inline-block' }}>
                        {team.league === 'WLL' ? 'WLL Schedule →' : 'PLL Schedule →'}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Player spotlight */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
                <div>
                  <div className="section-tag" style={{ marginBottom: '8px' }}>PLAYER SPOTLIGHT</div>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(28px, 4vw, 48px)', lineHeight: 0.95 }}>
                    THIS WEEK'S<br /><span style={{ color: 'var(--primary)' }}>FEATURE</span>
                  </h2>
                </div>
                {spotlight && (
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    {Array.from({ length: spotlight.totalPlayers || 3 }, (_, i) => (
                      <button key={i} onClick={() => loadSpotlight(teamId, i)}
                        style={{ width: i === spotlightIndex ? '28px' : '8px', height: '4px', background: i === spotlightIndex ? 'var(--primary)' : 'rgba(255,255,255,0.2)', border: 'none', cursor: 'pointer', transition: 'all 0.3s', padding: 0 }} />
                    ))}
                  </div>
                )}
              </div>

              {spotlightLoading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {[320, 60, 180, 80].map((h, i) => <div key={i} style={{ background: 'var(--bg-card)', height: h, opacity: 0.5 }} />)}
                </div>
              ) : spotlight ? (
                <div>
                  {spotlight.imagePage && (
                    <div style={{ position: 'relative', width: '100%', aspectRatio: '3/2', overflow: 'hidden', background: 'var(--bg-card)', border: '1px solid var(--border)', marginBottom: '20px' }}>
                      <img src={`/api/player-image?url=${encodeURIComponent(spotlight.imagePage)}`} alt={spotlight.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 45%, rgba(0,0,0,0.75) 100%)' }} />
                      <div style={{ position: 'absolute', bottom: '16px', left: '20px' }}>
                        <div style={{ fontFamily: 'var(--font-accent)', fontSize: '12px', letterSpacing: '0.18em', color: 'var(--primary)', marginBottom: '4px' }}>{spotlight.position?.toUpperCase()}</div>
                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(24px, 3.5vw, 42px)', lineHeight: 0.95, color: '#fff' }}>{spotlight.name.toUpperCase()}</div>
                      </div>
                      {spotlight.number && (
                        <div style={{ position: 'absolute', bottom: '12px', right: '20px', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '64px', color: 'var(--primary)', lineHeight: 0.88, opacity: 0.9 }}>#{spotlight.number}</div>
                      )}
                    </div>
                  )}
                  {spotlight.stats && spotlight.stats.length > 0 && (() => {
                    const stats = spotlight.stats.filter((s: any) => s.value && s.label).slice(0, 4);
                    return (
                    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${stats.length}, 1fr)`, gap: '1px', background: 'var(--border)', marginBottom: '16px' }}>
                      {stats.map((s: any, i: number) => (
                        <div key={i} style={{ background: 'var(--bg-card)', padding: '12px 14px' }}>
                          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '26px', color: 'var(--primary)', lineHeight: 1 }}>{s.value}</div>
                          <div style={{ fontFamily: 'var(--font-accent)', fontSize: '11px', letterSpacing: '0.1em', color: 'var(--text-muted)', marginTop: '4px' }}>{s.label?.toUpperCase()}</div>
                        </div>
                      ))}
                    </div>
                    );
                  })()}
                  {spotlight.description && <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.75, marginBottom: '16px' }}>{spotlight.description}</p>}
                  {visibleAccolades.length > 0 && (
                    <div style={{ marginBottom: '20px' }}>
                      {visibleAccolades.slice(0, 3).map((a: string, i: number) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                          <div style={{ width: '5px', height: '5px', background: 'var(--primary)', borderRadius: '50%', flexShrink: 0 }} />
                          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{a}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <Link href="/team" className="btn-primary">Full Roster →</Link>
                    <button onClick={() => loadSpotlight(teamId, (spotlightIndex + 1) % (spotlight.totalPlayers || 3))} className="btn-outline" style={{ cursor: 'pointer' }}>Next Player →</button>
                  </div>
                </div>
              ) : (
                <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Spotlight unavailable.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── MORE VIDEOS ─── */}
      <section style={{ padding: '72px 0', background: 'var(--bg-card)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
            <div>
              <div className="section-tag" style={{ marginBottom: '10px' }}>LATEST VIDEOS</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(36px, 5vw, 60px)', lineHeight: 0.92 }}>WATCH MORE<br /><span style={{ color: 'var(--primary)' }}>LACROSSE</span></h2>
            </div>
            <Link href="/videos" className="btn-outline">ALL VIDEOS →</Link>
          </div>
          {videosLoading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              {[...Array(6)].map((_, i) => <div key={i} style={{ background: 'var(--bg)', height: '280px', opacity: 0.5 }} />)}
            </div>
          ) : gridVideos.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              {gridVideos.map((v) => <VideoCard key={v.id} video={v} />)}
            </div>
          ) : (
            <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Add more channels or individual videos in the admin panel.</p>
            </div>
          )}
        </div>
      </section>

      {/* ─── NEWS ─── */}
      {news.length > 0 && (
        <section style={{ padding: '72px 0', borderBottom: '1px solid var(--border)' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
              <div>
                <div className="section-tag" style={{ marginBottom: '10px' }}>LATEST NEWS</div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(36px, 5vw, 60px)', lineHeight: 0.92 }}>STAY IN THE<br /><span style={{ color: 'var(--primary)' }}>GAME</span></h2>
              </div>
              <Link href="/news" className="btn-outline">ALL NEWS →</Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              {news.map((item, i) => {
                const isGoogleNewsImg = item.image_url && (
                  item.image_url.includes('news.google.com') ||
                  item.image_url.includes('googleusercontent.com') ||
                  item.image_url.includes('lh3.google') ||
                  item.image_url.includes('/rss/') 
                );
                const showImage = item.image_url && !isGoogleNewsImg;
                return (
                <div key={i} className="card" onClick={() => setSelectedNewsItem(item)}
                  style={{ padding: 0, overflow: 'hidden', display: 'block', cursor: 'pointer', transition: 'transform 0.2s, border-color 0.2s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--primary)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; }}>
                  <div style={{ aspectRatio: '16/9', overflow: 'hidden', background: 'color-mix(in srgb, var(--primary) 12%, var(--bg))', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    {showImage ? (
                      <img src={item.image_url} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} onError={(e) => { (e.currentTarget.parentElement as HTMLElement).innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:color-mix(in srgb, var(--primary) 12%, var(--bg))"><svg width='40' height='40' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.5' opacity='0.3'><path d='M19 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h3l2-2h4l2 2h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2z'/><circle cx='12' cy='13' r='3'/></svg></div>`; }} />
                    ) : (
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ opacity: 0.3 }}>
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
                        <path d="M3 9h18M9 21V9"/>
                      </svg>
                    )}
                  </div>
                  <div style={{ padding: '18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span className="news-pill">{item.category || 'General'}</span>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.published_at ? new Date(item.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}</span>
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '18px', lineHeight: 1.15, color: 'var(--text)' }}>{item.title}</h3>
                    <div style={{ marginTop: '8px', fontFamily: 'var(--font-accent)', fontSize: '11px', letterSpacing: '0.12em', color: 'var(--primary)' }}>READ STORY →</div>
                  </div>
                </div>
              )})}
            </div>
          </div>
        </section>
      )}

      {/* ─── COLLEGE TEASER ─── */}
      <section style={{ padding: '72px 0', background: 'var(--bg-card)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
            <div>
              <div className="section-tag" style={{ marginBottom: '10px' }}>COLLEGE LACROSSE</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(36px, 5vw, 60px)', lineHeight: 0.92 }}>COLLEGE<br /><span style={{ color: 'var(--primary)' }}>HUB</span></h2>
            </div>
            <Link href="/college" className="btn-outline">EXPLORE →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            {[
              { slug: 'duke', name: 'DUKE BLUE DEVILS', conf: 'ACC', abbr: 'DU', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Duke_Athletics_logo.svg/200px-Duke_Athletics_logo.svg.png' },
              { slug: 'maryland', name: 'MARYLAND TERRAPINS', conf: 'BIG TEN', abbr: 'MD', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Maryland_Terrapins_logo.svg/330px-Maryland_Terrapins_logo.svg.png' },
              { slug: 'syracuse', name: 'SYRACUSE ORANGE', conf: 'ACC', abbr: 'SYR', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/49/Syracuse_Orange_logo.svg' },
              { slug: 'virginia', name: 'UVA CAVALIERS', conf: 'ACC', abbr: 'UVA', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/04/UVA_Cavaliers_logo.png' },
            ].map((s) => (
              <Link key={s.slug} href={`/college/teams/${s.slug}`}
                style={{ background: 'var(--bg)', border: '1px solid var(--border)', overflow: 'hidden', display: 'block', textDecoration: 'none', transition: 'border-color 0.2s, transform 0.2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; }}>
                <div style={{ aspectRatio: '4/3', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', background: 'var(--bg)', padding: '24px' }}>
                  <img
                    src={s.logo}
                    alt={s.name}
                    style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                    onError={(e) => {
                      const el = e.currentTarget;
                      el.style.display = 'none';
                      const parent = el.parentElement!;
                      parent.innerHTML = `<div style="font-family:var(--font-display);font-weight:900;font-size:56px;color:color-mix(in srgb,var(--primary) 18%,transparent);line-height:1;user-select:none">${s.abbr}</div>`;
                    }}
                  />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: 'var(--primary)' }} />
                </div>
                <div style={{ padding: '14px' }}>
                  <div style={{ fontFamily: 'var(--font-accent)', fontSize: '10px', letterSpacing: '0.18em', color: 'var(--primary)', marginBottom: '5px' }}>{s.conf}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '18px', color: 'var(--text)', lineHeight: 1 }}>{s.name}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FILM CTA (admin-toggled) ─── */}
      {showFilmCta && (
        <section style={{ background: 'var(--primary)', padding: '72px 0', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(45deg, rgba(0,0,0,0.04) 0px, rgba(0,0,0,0.04) 1px, transparent 1px, transparent 18px)' }} />
          <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-accent)', fontSize: '12px', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.6)', marginBottom: '16px' }}>FOR UNIVERSITIES · PROGRAMS · TEAMS</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(48px, 8vw, 96px)', color: '#fff', lineHeight: 0.9, marginBottom: '24px' }}>
              WANT YOUR<br />TEAM ON FILM?
            </h2>
            <p style={{ fontFamily: 'var(--font-accent)', fontSize: '13px', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.1em', marginBottom: '36px' }}>
              PROFESSIONAL LACROSSE VIDEOGRAPHY · PLAYER REELS · PROGRAM COVERAGE
            </p>
            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/videos" style={{ background: '#fff', color: 'var(--primary)', fontFamily: 'var(--font-accent)', fontSize: '13px', letterSpacing: '0.15em', padding: '13px 32px', textDecoration: 'none', display: 'inline-block' }}>
                WATCH MY REEL →
              </Link>
              <a href="mailto:hello@laxhub.com" style={{ background: 'none', color: '#fff', fontFamily: 'var(--font-accent)', fontSize: '13px', letterSpacing: '0.15em', padding: '11px 30px', textDecoration: 'none', display: 'inline-block', border: '2px solid rgba(255,255,255,0.5)' }}>
                GET IN TOUCH ↗
              </a>
            </div>
          </div>
        </section>
      )}

      {/* ─── ARTICLE MODAL ─── */}
      {selectedNewsItem && (
        <ArticleModal item={selectedNewsItem} onClose={() => setSelectedNewsItem(null)} />
      )}

    </div>
  );
}
