'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { ALL_TEAMS } from '@/lib/teams';

type AdminVideo = {
  id: string | number;
  title: string;
  youtube_url: string;
  channel_name?: string;
  league?: 'PLL' | 'WLL' | 'CUSTOM';
  published_at?: string;
};

type AdminSource = {
  id: string | number;
  title?: string;
  handle_url?: string;
  channel_name?: string;
  channel_id?: string;
  league?: 'PLL' | 'WLL' | 'CUSTOM';
  pull_mode?: 'all' | 'select';
  active?: boolean;
  team_id?: string | null;
};

type PreviewVideo = {
  id: string;
  title: string;
  youtubeUrl: string;
  thumbnailUrl: string;
  channelName: string;
  publishedAt?: string;
};

export default function AdminPage() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState('');
  const [videos, setVideos] = useState<AdminVideo[]>([]);
  const [sources, setSources] = useState<AdminSource[]>([]);
  const [defaultSources, setDefaultSources] = useState<any[]>([]);
  const [previewVideos, setPreviewVideos] = useState<PreviewVideo[]>([]);
  const [selectedPreviewUrls, setSelectedPreviewUrls] = useState<string[]>([]);
  const [selectedSourceId, setSelectedSourceId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [form, setForm] = useState({
    username: '',
    password: '',
    title: '',
    youtubeUrl: '',
    channelName: '',
    description: '',
    league: 'CUSTOM' as 'PLL' | 'WLL' | 'CUSTOM',
    featured: false,
  });
  const [sourceForm, setSourceForm] = useState({
    title: '',
    handleUrl: '',
    channelName: '',
    league: 'CUSTOM' as 'PLL' | 'WLL' | 'CUSTOM',
    pullMode: 'select' as 'all' | 'select',
    teamId: '',
  });

  const combinedSources = useMemo(
    () => [...defaultSources, ...sources.map((source) => ({ ...source, id: String(source.id) }))],
    [defaultSources, sources],
  );

  const loadDashboard = async () => {
    const [videosResponse, sourcesResponse] = await Promise.all([
      fetch('/api/admin/videos'),
      fetch('/api/admin/video-sources'),
    ]);

    if (!videosResponse.ok || !sourcesResponse.ok) {
      setIsAuthed(false);
      setChecking(false);
      return;
    }

    const videosData = await videosResponse.json();
    const sourcesData = await sourcesResponse.json();
    setVideos(Array.isArray(videosData.videos) ? videosData.videos : []);
    setSources(Array.isArray(sourcesData.sources) ? sourcesData.sources : []);
    setDefaultSources(Array.isArray(sourcesData.defaults) ? sourcesData.defaults : []);
    setIsAuthed(true);
    setError('');
    setChecking(false);
  };

  useEffect(() => {
    loadDashboard().catch(() => setChecking(false));
  }, []);

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: form.username,
        password: form.password,
      }),
    });

    setSubmitting(false);

    if (!response.ok) {
      const data = await response.json().catch(() => ({ error: 'Login failed.' }));
      setError(data.error || 'Login failed.');
      return;
    }

    await loadDashboard();
  };

  const handleCreateVideo = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    const response = await fetch('/api/admin/videos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: form.title,
        youtubeUrl: form.youtubeUrl,
        channelName: form.channelName,
        description: form.description,
        league: form.league,
        featured: form.featured,
      }),
    });

    setSubmitting(false);

    if (!response.ok) {
      const data = await response.json().catch(() => ({ error: 'Unable to save video.' }));
      setError(data.error || 'Unable to save video.');
      return;
    }

    setForm((current) => ({
      ...current,
      title: '',
      youtubeUrl: '',
      channelName: '',
      description: '',
      featured: false,
    }));
    await loadDashboard();
  };

  const handleCreateSource = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    const response = await fetch('/api/admin/video-sources', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: sourceForm.title,
        handleUrl: sourceForm.handleUrl,
        channelName: sourceForm.channelName,
        league: sourceForm.league,
        pullMode: sourceForm.pullMode,
        teamId: sourceForm.teamId || null,
      }),
    });

    setSubmitting(false);

    if (!response.ok) {
      const data = await response.json().catch(() => ({ error: 'Unable to save source.' }));
      setError(data.error || 'Unable to save source.');
      return;
    }

    setSourceForm({
      title: '',
      handleUrl: '',
      channelName: '',
      league: 'CUSTOM',
      pullMode: 'select',
      teamId: '',
    });
    await loadDashboard();
  };

  const loadPreview = async (sourceId: string) => {
    setSelectedSourceId(sourceId);
    setLoadingPreview(true);
    setSelectedPreviewUrls([]);

    const response = await fetch(`/api/admin/video-sources/preview?sourceId=${encodeURIComponent(sourceId)}`);
    const data = await response.json().catch(() => ({ videos: [] }));
    setPreviewVideos(Array.isArray(data.videos) ? data.videos : []);
    setLoadingPreview(false);
  };

  const togglePreviewSelection = (youtubeUrl: string) => {
    setSelectedPreviewUrls((current) =>
      current.includes(youtubeUrl)
        ? current.filter((value) => value !== youtubeUrl)
        : [...current, youtubeUrl],
    );
  };

  const importFromSource = async (mode: 'all' | 'selected') => {
    if (!selectedSourceId) return;

    setError('');
    setSubmitting(true);
    const response = await fetch('/api/admin/video-sources/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sourceId: selectedSourceId,
        mode,
        selectedUrls: selectedPreviewUrls,
      }),
    });

    setSubmitting(false);

    if (!response.ok) {
      const data = await response.json().catch(() => ({ error: 'Unable to import videos.' }));
      setError(data.error || 'Unable to import videos.');
      return;
    }

    await loadDashboard();
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    setIsAuthed(false);
    setVideos([]);
    setSources([]);
    setPreviewVideos([]);
    setSelectedPreviewUrls([]);
    setSelectedSourceId('');
  };

  if (checking) {
    return <div className="container" style={{ padding: '100px 0', color: 'var(--text-muted)' }}>Loading admin...</div>;
  }

  if (!isAuthed) {
    return (
      <div className="container" style={{ padding: '90px 0 120px', maxWidth: '560px' }}>
        <div className="card" style={{ padding: '34px' }}>
          <div className="section-tag" style={{ marginBottom: '12px' }}>ADMIN</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '54px', lineHeight: 0.92, marginBottom: '16px' }}>
            SIGN IN
          </h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px', lineHeight: 1.7 }}>
            Use your admin login to manage video feeds and playlist picks privately.
          </p>
          <form onSubmit={handleLogin} style={{ display: 'grid', gap: '14px' }}>
            <input
              value={form.username}
              onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))}
              placeholder="Username"
              style={{ padding: '14px 16px', background: 'var(--bg-card2)', border: '1px solid var(--border)', color: 'var(--text)' }}
            />
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              placeholder="Password"
              style={{ padding: '14px 16px', background: 'var(--bg-card2)', border: '1px solid var(--border)', color: 'var(--text)' }}
            />
            {error ? <div style={{ color: 'var(--primary)', fontSize: '14px' }}>{error}</div> : null}
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '80px 0 120px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '18px', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap' }}>
        <div>
          <div className="section-tag" style={{ marginBottom: '10px' }}>ADMIN DASHBOARD</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '58px', lineHeight: 0.92 }}>
            VIDEO CONTROL ROOM
          </h1>
        </div>
        <button onClick={handleLogout} style={{ padding: '12px 18px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', cursor: 'pointer' }}>
          Log Out
        </button>
      </div>

      {error ? (
        <div className="card" style={{ padding: '16px 18px', marginBottom: '24px', color: 'var(--primary)' }}>
          {error}
        </div>
      ) : null}

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 0.9fr) minmax(0, 1.1fr)', gap: '24px', alignItems: 'start' }}>
        <div style={{ display: 'grid', gap: '24px' }}>
          <div className="card" style={{ padding: '26px' }}>
            <div className="section-tag" style={{ marginBottom: '12px' }}>ADD SINGLE VIDEO</div>
            <form onSubmit={handleCreateVideo} style={{ display: 'grid', gap: '12px' }}>
              <input value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} placeholder="Video title" style={{ padding: '14px 16px', background: 'var(--bg-card2)', border: '1px solid var(--border)', color: 'var(--text)' }} />
              <input value={form.youtubeUrl} onChange={(event) => setForm((current) => ({ ...current, youtubeUrl: event.target.value }))} placeholder="YouTube URL" style={{ padding: '14px 16px', background: 'var(--bg-card2)', border: '1px solid var(--border)', color: 'var(--text)' }} />
              <input value={form.channelName} onChange={(event) => setForm((current) => ({ ...current, channelName: event.target.value }))} placeholder="Channel name" style={{ padding: '14px 16px', background: 'var(--bg-card2)', border: '1px solid var(--border)', color: 'var(--text)' }} />
              <select value={form.league} onChange={(event) => setForm((current) => ({ ...current, league: event.target.value as 'PLL' | 'WLL' | 'CUSTOM' }))} style={{ padding: '14px 16px', background: 'var(--bg-card2)', border: '1px solid var(--border)', color: 'var(--text)' }}>
                <option value="PLL">PLL</option>
                <option value="WLL">WLL</option>
                <option value="CUSTOM">PLAYLIST</option>
              </select>
              <textarea value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} placeholder="Description" rows={5} style={{ padding: '14px 16px', background: 'var(--bg-card2)', border: '1px solid var(--border)', color: 'var(--text)', resize: 'vertical' }} />
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)' }}>
                <input type="checkbox" checked={form.featured} onChange={(event) => setForm((current) => ({ ...current, featured: event.target.checked }))} />
                Make featured
              </label>
              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? 'Saving...' : 'Publish Video'}
              </button>
            </form>
          </div>

          <div className="card" style={{ padding: '26px' }}>
            <div className="section-tag" style={{ marginBottom: '12px' }}>ADD YOUTUBE FEED</div>
            <form onSubmit={handleCreateSource} style={{ display: 'grid', gap: '12px' }}>
              <input value={sourceForm.title} onChange={(event) => setSourceForm((current) => ({ ...current, title: event.target.value }))} placeholder="Feed title" style={{ padding: '14px 16px', background: 'var(--bg-card2)', border: '1px solid var(--border)', color: 'var(--text)' }} />
              <input value={sourceForm.handleUrl} onChange={(event) => setSourceForm((current) => ({ ...current, handleUrl: event.target.value }))} placeholder="YouTube channel or handle URL" style={{ padding: '14px 16px', background: 'var(--bg-card2)', border: '1px solid var(--border)', color: 'var(--text)' }} />
              <input value={sourceForm.channelName} onChange={(event) => setSourceForm((current) => ({ ...current, channelName: event.target.value }))} placeholder="Channel name" style={{ padding: '14px 16px', background: 'var(--bg-card2)', border: '1px solid var(--border)', color: 'var(--text)' }} />
              <select value={sourceForm.league} onChange={(event) => setSourceForm((current) => ({ ...current, league: event.target.value as 'PLL' | 'WLL' | 'CUSTOM' }))} style={{ padding: '14px 16px', background: 'var(--bg-card2)', border: '1px solid var(--border)', color: 'var(--text)' }}>
                <option value="PLL">PLL</option>
                <option value="WLL">WLL</option>
                <option value="CUSTOM">PLAYLIST</option>
              </select>
              <select value={sourceForm.pullMode} onChange={(event) => setSourceForm((current) => ({ ...current, pullMode: event.target.value as 'all' | 'select' }))} style={{ padding: '14px 16px', background: 'var(--bg-card2)', border: '1px solid var(--border)', color: 'var(--text)' }}>
                <option value="all">Pull all feed videos</option>
                <option value="select">Select videos manually</option>
              </select>
              <select value={sourceForm.teamId} onChange={(event) => setSourceForm((current) => ({ ...current, teamId: event.target.value }))} style={{ padding: '14px 16px', background: 'var(--bg-card2)', border: '1px solid var(--border)', color: 'var(--text)' }}>
                <option value="">No team binding</option>
                {ALL_TEAMS.map((team) => (
                  <option key={team.id} value={team.id}>{team.full}</option>
                ))}
              </select>
              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? 'Saving...' : 'Save Feed Source'}
              </button>
            </form>
          </div>
        </div>

        <div style={{ display: 'grid', gap: '24px' }}>
          <div className="card" style={{ padding: '26px' }}>
            <div className="section-tag" style={{ marginBottom: '12px' }}>FEED SOURCES</div>
            <div style={{ display: 'grid', gap: '12px' }}>
              {combinedSources.map((source) => (
                <div key={String(source.id)} style={{ border: '1px solid var(--border)', padding: '14px 16px', background: 'color-mix(in srgb, var(--team-surface) 50%, var(--bg-card2))' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '22px', lineHeight: 1 }}>
                        {source.title || source.channel_name}
                      </div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '8px' }}>
                        {source.league === 'CUSTOM' ? 'PLAYLIST' : source.league} • {(source.pull_mode || 'all').toUpperCase()} • {source.channel_name || 'Feed source'}
                      </div>
                    </div>
                    <button onClick={() => loadPreview(String(source.id))} style={{ padding: '10px 14px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', cursor: 'pointer' }}>
                      Preview Feed
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: '26px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '14px', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap' }}>
              <div className="section-tag">FEED PREVIEW</div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button onClick={() => importFromSource('all')} disabled={!selectedSourceId || submitting} style={{ padding: '10px 14px', border: 'none', background: 'var(--primary)', color: '#fff', cursor: 'pointer' }}>
                  Import All
                </button>
                <button onClick={() => importFromSource('selected')} disabled={!selectedSourceId || selectedPreviewUrls.length === 0 || submitting} style={{ padding: '10px 14px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', cursor: 'pointer' }}>
                  Import Selected
                </button>
              </div>
            </div>

            {loadingPreview ? (
              <div style={{ color: 'var(--text-muted)' }}>Loading preview...</div>
            ) : previewVideos.length === 0 ? (
              <div style={{ color: 'var(--text-muted)' }}>Choose a feed source to preview the latest videos.</div>
            ) : (
              <div style={{ display: 'grid', gap: '12px' }}>
                {previewVideos.map((video) => (
                  <label key={video.youtubeUrl} style={{ border: '1px solid var(--border)', padding: '12px', display: 'grid', gridTemplateColumns: '24px 120px 1fr', gap: '12px', alignItems: 'center', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={selectedPreviewUrls.includes(video.youtubeUrl)}
                      onChange={() => togglePreviewSelection(video.youtubeUrl)}
                    />
                    <img src={video.thumbnailUrl} alt={video.title} style={{ width: '120px', aspectRatio: '16 / 9', objectFit: 'cover', display: 'block' }} />
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '20px', lineHeight: 1.05 }}>{video.title}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '8px' }}>
                        {video.channelName}{video.publishedAt ? ` • ${new Date(video.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : ''}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="card" style={{ padding: '26px' }}>
            <div className="section-tag" style={{ marginBottom: '12px' }}>VIDEO LIBRARY</div>
            <div style={{ display: 'grid', gap: '14px' }}>
              {videos.length === 0 ? (
                <div style={{ color: 'var(--text-muted)' }}>No videos yet.</div>
              ) : (
                videos.map((video) => (
                  <div key={String(video.id)} style={{ border: '1px solid var(--border)', padding: '14px 16px', background: 'color-mix(in srgb, var(--team-surface) 50%, var(--bg-card2))' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '22px', lineHeight: 1 }}>{video.title}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '8px' }}>
                      {(video.league === 'CUSTOM' ? 'PLAYLIST' : video.league) || 'PLAYLIST'} • {video.channel_name || 'LaxHub'}
                    </div>
                    <a href={video.youtube_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', fontSize: '14px', marginTop: '10px', display: 'inline-block' }}>
                      Open source video
                    </a>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

