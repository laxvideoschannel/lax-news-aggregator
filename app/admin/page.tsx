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

type SiteSettings = {
  showFilmCta: boolean;
  filmCtaEmail: string;
  filmCtaHeadline: string;
};

type Tab = 'videos' | 'channels' | 'settings' | 'schools';

const inputStyle = {
  padding: '13px 16px',
  background: 'var(--bg-card2)',
  border: '1px solid var(--border)',
  color: 'var(--text)',
  width: '100%',
  fontFamily: 'var(--font-body)',
  fontSize: '15px',
};

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: 'var(--font-accent)', fontSize: '13px', letterSpacing: '0.15em',
        padding: '12px 24px',
        background: active ? 'var(--primary)' : 'transparent',
        color: active ? '#fff' : 'var(--text-muted)',
        border: 'none',
        borderBottom: active ? 'none' : '1px solid var(--border)',
        cursor: 'pointer', transition: 'all 0.2s',
      }}
    >
      {children}
    </button>
  );
}

function Toggle({ checked, onChange, label, sub }: { checked: boolean; onChange: (v: boolean) => void; label: string; sub?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 0', borderBottom: '1px solid var(--border)', gap: '20px' }}>
      <div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '20px', lineHeight: 1.1, marginBottom: sub ? '4px' : 0 }}>{label}</div>
        {sub && <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>{sub}</div>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        style={{
          width: '52px', height: '28px', borderRadius: '14px', border: 'none',
          background: checked ? 'var(--primary)' : 'var(--border)',
          position: 'relative', cursor: 'pointer', flexShrink: 0, transition: 'background 0.2s',
        }}
      >
        <div style={{
          width: '22px', height: '22px', borderRadius: '50%', background: '#fff',
          position: 'absolute', top: '3px', left: checked ? '27px' : '3px',
          transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
        }} />
      </button>
    </div>
  );
}

export default function AdminPage() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('videos');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [videos, setVideos] = useState<AdminVideo[]>([]);
  const [sources, setSources] = useState<AdminSource[]>([]);
  const [schoolSubs, setSchoolSubs] = useState<any[]>([]);  const [defaultSources, setDefaultSources] = useState<any[]>([]);
  const [previewVideos, setPreviewVideos] = useState<PreviewVideo[]>([]);
  const [selectedPreviewUrls, setSelectedPreviewUrls] = useState<string[]>([]);
  const [selectedSourceId, setSelectedSourceId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [settingsSaving, setSettingsSaving] = useState(false);

  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    showFilmCta: false,
    filmCtaEmail: '',
    filmCtaHeadline: 'WANT YOUR TEAM ON FILM?',
  });

  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [videoForm, setVideoForm] = useState({
    title: '', youtubeUrl: '', channelName: '', description: '',
    league: 'CUSTOM' as 'PLL' | 'WLL' | 'CUSTOM', featured: false,
  });
  const [sourceForm, setSourceForm] = useState({
    title: '', handleUrl: '', channelName: '',
    league: 'CUSTOM' as 'PLL' | 'WLL' | 'CUSTOM',
    pullMode: 'select' as 'all' | 'select', teamId: '',
  });

  const combinedSources = useMemo(
    () => [...defaultSources, ...sources.map((s) => ({ ...s, id: String(s.id) }))],
    [defaultSources, sources],
  );

  const loadDashboard = async () => {
    const [videosRes, sourcesRes, settingsRes] = await Promise.all([
      fetch('/api/admin/videos'),
      fetch('/api/admin/video-sources'),
      fetch('/api/admin/settings').catch(() => null),
    ]);

    if (!videosRes.ok || !sourcesRes.ok) { setIsAuthed(false); setChecking(false); return; }

    const videosData = await videosRes.json();
    const sourcesData = await sourcesRes.json();
    setVideos(Array.isArray(videosData.videos) ? videosData.videos : []);
    setSources(Array.isArray(sourcesData.sources) ? sourcesData.sources : []);
    setDefaultSources(Array.isArray(sourcesData.defaults) ? sourcesData.defaults : []);

    if (settingsRes?.ok) {
      const settingsData = await settingsRes.json();
      setSiteSettings((prev) => ({ ...prev, ...settingsData }));
    }

    setIsAuthed(true);
    setError('');
    setChecking(false);
  };

  useEffect(() => { loadDashboard().catch(() => setChecking(false)); }, []);

  const flash = (msg: string) => { setSuccess(msg); setTimeout(() => setSuccess(''), 3000); };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault(); setError(''); setSubmitting(true);
    const res = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(loginForm) });
    setSubmitting(false);
    if (!res.ok) { const d = await res.json().catch(() => ({})); setError(d.error || 'Login failed.'); return; }
    await loadDashboard();
  };

  const handleCreateVideo = async (e: FormEvent) => {
    e.preventDefault(); setError(''); setSubmitting(true);
    const res = await fetch('/api/admin/videos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(videoForm) });
    setSubmitting(false);
    if (!res.ok) { const d = await res.json().catch(() => ({})); setError(d.error || 'Unable to save video.'); return; }
    setVideoForm({ title: '', youtubeUrl: '', channelName: '', description: '', league: 'CUSTOM', featured: false });
    flash('Video published!');
    await loadDashboard();
  };

  const handleCreateSource = async (e: FormEvent) => {
    e.preventDefault(); setError(''); setSubmitting(true);
    const res = await fetch('/api/admin/video-sources', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: sourceForm.title, handleUrl: sourceForm.handleUrl, channelName: sourceForm.channelName, league: sourceForm.league, pullMode: sourceForm.pullMode, teamId: sourceForm.teamId || null }) });
    setSubmitting(false);
    if (!res.ok) { const d = await res.json().catch(() => ({})); setError(d.error || 'Unable to save source.'); return; }
    setSourceForm({ title: '', handleUrl: '', channelName: '', league: 'CUSTOM', pullMode: 'select', teamId: '' });
    flash('Channel source added!');
    await loadDashboard();
  };

  const loadPreview = async (sourceId: string) => {
    setSelectedSourceId(sourceId); setLoadingPreview(true); setSelectedPreviewUrls([]);
    const res = await fetch(`/api/admin/video-sources/preview?sourceId=${encodeURIComponent(sourceId)}`);
    const data = await res.json().catch(() => ({ videos: [] }));
    setPreviewVideos(Array.isArray(data.videos) ? data.videos : []);
    setLoadingPreview(false);
  };

  const importFromSource = async (mode: 'all' | 'selected') => {
    if (!selectedSourceId) return;
    setError(''); setSubmitting(true);
    const res = await fetch('/api/admin/video-sources/import', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sourceId: selectedSourceId, mode, selectedUrls: selectedPreviewUrls }) });
    setSubmitting(false);
    if (!res.ok) { const d = await res.json().catch(() => ({})); setError(d.error || 'Import failed.'); return; }
    flash('Videos imported!');
    await loadDashboard();
  };

  const saveSettings = async () => {
    setSettingsSaving(true);
    const res = await fetch('/api/admin/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(siteSettings) });
    setSettingsSaving(false);
    if (!res.ok) { setError('Failed to save settings.'); return; }
    flash('Settings saved!');
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    setIsAuthed(false); setVideos([]); setSources([]); setPreviewVideos([]);
    setSelectedPreviewUrls([]); setSelectedSourceId('');
  };

  if (checking) return <div className="container" style={{ padding: '100px 0', color: 'var(--text-muted)' }}>Loading…</div>;

  if (!isAuthed) {
    return (
      <div className="container" style={{ padding: '90px 0 120px', maxWidth: '520px' }}>
        <div className="card" style={{ padding: '36px' }}>
          <div className="section-tag" style={{ marginBottom: '12px' }}>ADMIN</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '54px', lineHeight: 0.92, marginBottom: '16px' }}>SIGN IN</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px', lineHeight: 1.7 }}>Manage videos, channels, and site settings.</p>
          <form onSubmit={handleLogin} style={{ display: 'grid', gap: '14px' }}>
            <input value={loginForm.username} onChange={(e) => setLoginForm((p) => ({ ...p, username: e.target.value }))} placeholder="Username" style={inputStyle} />
            <input type="password" value={loginForm.password} onChange={(e) => setLoginForm((p) => ({ ...p, password: e.target.value }))} placeholder="Password" style={inputStyle} />
            {error && <div style={{ color: 'var(--primary)', fontSize: '14px' }}>{error}</div>}
            <button type="submit" className="btn-primary" disabled={submitting}>{submitting ? 'Signing in…' : 'Sign In'}</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '60px 0 120px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '36px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div className="section-tag" style={{ marginBottom: '10px' }}>ADMIN DASHBOARD</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '58px', lineHeight: 0.92 }}>CONTROL ROOM</h1>
        </div>
        <button onClick={handleLogout} style={{ padding: '11px 20px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', fontFamily: 'var(--font-accent)', fontSize: '12px', letterSpacing: '0.12em' }}>
          LOG OUT
        </button>
      </div>

      {/* Flash messages */}
      {error && <div style={{ background: 'color-mix(in srgb, var(--primary) 14%, transparent)', border: '1px solid var(--primary)', padding: '14px 18px', marginBottom: '20px', color: 'var(--primary)', fontSize: '14px' }}>{error}</div>}
      {success && <div style={{ background: 'color-mix(in srgb, #22c55e 14%, transparent)', border: '1px solid #22c55e', padding: '14px 18px', marginBottom: '20px', color: '#22c55e', fontSize: '14px' }}>{success}</div>}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, marginBottom: '32px', borderBottom: '1px solid var(--border)' }}>
        <TabButton active={activeTab === 'videos'} onClick={() => setActiveTab('videos')}>VIDEOS</TabButton>
        <TabButton active={activeTab === 'channels'} onClick={() => setActiveTab('channels')}>CHANNELS</TabButton>
        <TabButton active={activeTab === 'settings'} onClick={() => setActiveTab('settings')}>SITE SETTINGS</TabButton>
        <TabButton active={activeTab === 'schools'} onClick={() => { setActiveTab('schools'); fetch('/api/school-submissions').then(r=>r.json()).then(setSchoolSubs).catch(()=>{}); }}>SCHOOL SUBMISSIONS</TabButton>
      </div>

      {/* ── TAB: VIDEOS ── */}
      {activeTab === 'videos' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 0.85fr) minmax(0, 1.15fr)', gap: '24px', alignItems: 'start' }}>
          {/* Add video form */}
          <div className="card" style={{ padding: '28px' }}>
            <div className="section-tag" style={{ marginBottom: '14px' }}>ADD SINGLE VIDEO</div>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '20px', lineHeight: 1.6 }}>
              Paste any YouTube URL. Your videos appear in the "MY VIDEOS" filter tab alongside official PLL/WLL feeds.
            </p>
            <form onSubmit={handleCreateVideo} style={{ display: 'grid', gap: '12px' }}>
              <input value={videoForm.youtubeUrl} onChange={(e) => setVideoForm((p) => ({ ...p, youtubeUrl: e.target.value }))} placeholder="YouTube URL" style={inputStyle} required />
              <input value={videoForm.title} onChange={(e) => setVideoForm((p) => ({ ...p, title: e.target.value }))} placeholder="Video title" style={inputStyle} required />
              <input value={videoForm.channelName} onChange={(e) => setVideoForm((p) => ({ ...p, channelName: e.target.value }))} placeholder="Channel / source name" style={inputStyle} />
              <select value={videoForm.league} onChange={(e) => setVideoForm((p) => ({ ...p, league: e.target.value as any }))} style={inputStyle}>
                <option value="CUSTOM">My Videos (custom)</option>
                <option value="PLL">PLL</option>
                <option value="WLL">WLL</option>
              </select>
              <textarea value={videoForm.description} onChange={(e) => setVideoForm((p) => ({ ...p, description: e.target.value }))} placeholder="Description (optional)" rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', fontSize: '14px', cursor: 'pointer' }}>
                <input type="checkbox" checked={videoForm.featured} onChange={(e) => setVideoForm((p) => ({ ...p, featured: e.target.checked }))} />
                Feature this video (shows as hero on homepage)
              </label>
              <button type="submit" className="btn-primary" disabled={submitting}>{submitting ? 'Saving…' : 'Publish Video'}</button>
            </form>
          </div>

          {/* Video library */}
          <div className="card" style={{ padding: '28px' }}>
            <div className="section-tag" style={{ marginBottom: '14px' }}>VIDEO LIBRARY ({videos.length})</div>
            <div style={{ display: 'grid', gap: '10px', maxHeight: '620px', overflowY: 'auto' }}>
              {videos.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No videos yet. Add one using the form.</p>
              ) : videos.map((v) => (
                <div key={String(v.id)} style={{ border: '1px solid var(--border)', padding: '14px 16px', background: 'var(--bg)', display: 'grid', gridTemplateColumns: '80px 1fr', gap: '14px', alignItems: 'center' }}>
                  <img
                    src={`https://i.ytimg.com/vi/${v.youtube_url.match(/(?:v=|youtu\.be\/)([^&?/]+)/)?.[1]}/mqdefault.jpg`}
                    alt=""
                    style={{ width: '80px', aspectRatio: '16/9', objectFit: 'cover', display: 'block' }}
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '18px', lineHeight: 1.1, marginBottom: '4px' }}>{v.title}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                      {v.league === 'CUSTOM' ? 'MY VIDEOS' : v.league} · {v.channel_name || '—'}
                      {v.published_at && ` · ${new Date(v.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
                    </div>
                    <a href={v.youtube_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', fontSize: '12px', marginTop: '6px', display: 'inline-block' }}>Open on YouTube ↗</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: CHANNELS ── */}
      {activeTab === 'channels' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 0.85fr) minmax(0, 1.15fr)', gap: '24px', alignItems: 'start' }}>
          {/* Add channel */}
          <div style={{ display: 'grid', gap: '24px' }}>
            <div className="card" style={{ padding: '28px' }}>
              <div className="section-tag" style={{ marginBottom: '14px' }}>ADD YOUTUBE CHANNEL</div>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '20px', lineHeight: 1.6 }}>
                Add any YouTube channel to pull videos from automatically. Great for adding college team channels or your own channel.
              </p>
              <form onSubmit={handleCreateSource} style={{ display: 'grid', gap: '12px' }}>
                <input value={sourceForm.handleUrl} onChange={(e) => setSourceForm((p) => ({ ...p, handleUrl: e.target.value }))} placeholder="YouTube channel URL (e.g. youtube.com/@channel)" style={inputStyle} required />
                <input value={sourceForm.title} onChange={(e) => setSourceForm((p) => ({ ...p, title: e.target.value }))} placeholder="Feed label (e.g. My Lacrosse Reel)" style={inputStyle} required />
                <input value={sourceForm.channelName} onChange={(e) => setSourceForm((p) => ({ ...p, channelName: e.target.value }))} placeholder="Channel display name" style={inputStyle} />
                <select value={sourceForm.league} onChange={(e) => setSourceForm((p) => ({ ...p, league: e.target.value as any }))} style={inputStyle}>
                  <option value="CUSTOM">My Videos (custom)</option>
                  <option value="PLL">PLL</option>
                  <option value="WLL">WLL</option>
                </select>
                <select value={sourceForm.pullMode} onChange={(e) => setSourceForm((p) => ({ ...p, pullMode: e.target.value as any }))} style={inputStyle}>
                  <option value="all">Pull all videos automatically</option>
                  <option value="select">I'll pick videos manually</option>
                </select>
                <select value={sourceForm.teamId} onChange={(e) => setSourceForm((p) => ({ ...p, teamId: e.target.value }))} style={inputStyle}>
                  <option value="">No team tag</option>
                  {ALL_TEAMS.map((t) => <option key={t.id} value={t.id}>{t.full}</option>)}
                </select>
                <button type="submit" className="btn-primary" disabled={submitting}>{submitting ? 'Saving…' : 'Add Channel'}</button>
              </form>
            </div>
          </div>

          {/* Sources + preview */}
          <div style={{ display: 'grid', gap: '24px' }}>
            {/* Feed sources list */}
            <div className="card" style={{ padding: '28px' }}>
              <div className="section-tag" style={{ marginBottom: '14px' }}>ACTIVE FEEDS ({combinedSources.length})</div>
              <div style={{ display: 'grid', gap: '10px' }}>
                {combinedSources.map((src) => (
                  <div key={String(src.id)} style={{ border: '1px solid var(--border)', padding: '14px 16px', background: selectedSourceId === String(src.id) ? 'color-mix(in srgb, var(--primary) 8%, var(--bg))' : 'var(--bg)', borderColor: selectedSourceId === String(src.id) ? 'var(--primary)' : 'var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                      <div>
                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '20px', lineHeight: 1.1 }}>{src.title || src.channel_name}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '4px' }}>
                          {src.league === 'CUSTOM' ? 'MY VIDEOS' : src.league} · {(src.pull_mode || 'all').toUpperCase()} · {src.channel_name || 'Feed'}
                        </div>
                      </div>
                      <button onClick={() => loadPreview(String(src.id))} style={{ padding: '9px 14px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--primary)', cursor: 'pointer', fontFamily: 'var(--font-accent)', fontSize: '11px', letterSpacing: '0.12em' }}>
                        PREVIEW →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Preview + import */}
            <div className="card" style={{ padding: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                <div className="section-tag">
                  {selectedSourceId ? `PREVIEW (${previewVideos.length} videos)` : 'FEED PREVIEW'}
                </div>
                {selectedSourceId && (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button onClick={() => importFromSource('all')} disabled={submitting} style={{ padding: '9px 14px', border: 'none', background: 'var(--primary)', color: '#fff', cursor: 'pointer', fontFamily: 'var(--font-accent)', fontSize: '11px', letterSpacing: '0.12em' }}>
                      IMPORT ALL
                    </button>
                    <button onClick={() => importFromSource('selected')} disabled={selectedPreviewUrls.length === 0 || submitting} style={{ padding: '9px 14px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', cursor: 'pointer', fontFamily: 'var(--font-accent)', fontSize: '11px', letterSpacing: '0.12em', opacity: selectedPreviewUrls.length === 0 ? 0.5 : 1 }}>
                      IMPORT SELECTED ({selectedPreviewUrls.length})
                    </button>
                  </div>
                )}
              </div>

              {!selectedSourceId ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Click "Preview →" on any feed above to browse and import videos.</p>
              ) : loadingPreview ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Loading feed…</p>
              ) : previewVideos.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No videos found in this feed.</p>
              ) : (
                <div style={{ display: 'grid', gap: '10px', maxHeight: '480px', overflowY: 'auto' }}>
                  {previewVideos.map((v) => (
                    <label key={v.youtubeUrl} style={{ border: '1px solid var(--border)', padding: '12px', display: 'grid', gridTemplateColumns: '22px 100px 1fr', gap: '12px', alignItems: 'center', cursor: 'pointer', background: selectedPreviewUrls.includes(v.youtubeUrl) ? 'color-mix(in srgb, var(--primary) 6%, var(--bg))' : 'var(--bg)', borderColor: selectedPreviewUrls.includes(v.youtubeUrl) ? 'var(--primary)' : 'var(--border)' }}>
                      <input type="checkbox" checked={selectedPreviewUrls.includes(v.youtubeUrl)} onChange={() => setSelectedPreviewUrls((p) => p.includes(v.youtubeUrl) ? p.filter((u) => u !== v.youtubeUrl) : [...p, v.youtubeUrl])} />
                      <img src={v.thumbnailUrl} alt="" style={{ width: '100px', aspectRatio: '16/9', objectFit: 'cover', display: 'block' }} />
                      <div>
                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '18px', lineHeight: 1.1, marginBottom: '4px' }}>{v.title}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                          {v.channelName}{v.publishedAt ? ` · ${new Date(v.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : ''}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: SITE SETTINGS ── */}
      {activeTab === 'settings' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 0.85fr) minmax(0, 1.15fr)', gap: '24px', alignItems: 'start' }}>
          <div>
            <div className="card" style={{ padding: '28px' }}>
              <div className="section-tag" style={{ marginBottom: '6px' }}>FILM / HIRE SECTION</div>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: 1.6, marginBottom: '24px' }}>
                When enabled, a "Want your team on film?" call-to-action appears at the bottom of the homepage. Turn it on when you're ready to take bookings, off when you're not.
              </p>

              <Toggle
                checked={siteSettings.showFilmCta}
                onChange={(v) => setSiteSettings((p) => ({ ...p, showFilmCta: v }))}
                label="Show Film CTA on homepage"
                sub={siteSettings.showFilmCta ? '✓ Visible to all visitors' : 'Hidden from visitors'}
              />

              {siteSettings.showFilmCta && (
                <div style={{ marginTop: '20px', display: 'grid', gap: '12px' }}>
                  <div>
                    <label style={{ fontFamily: 'var(--font-accent)', fontSize: '11px', letterSpacing: '0.15em', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>CONTACT EMAIL</label>
                    <input
                      value={siteSettings.filmCtaEmail}
                      onChange={(e) => setSiteSettings((p) => ({ ...p, filmCtaEmail: e.target.value }))}
                      placeholder="hello@youremail.com"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={{ fontFamily: 'var(--font-accent)', fontSize: '11px', letterSpacing: '0.15em', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>HEADLINE (optional)</label>
                    <input
                      value={siteSettings.filmCtaHeadline}
                      onChange={(e) => setSiteSettings((p) => ({ ...p, filmCtaHeadline: e.target.value }))}
                      placeholder="WANT YOUR TEAM ON FILM?"
                      style={inputStyle}
                    />
                  </div>
                </div>
              )}

              <div style={{ marginTop: '28px' }}>
                <button onClick={saveSettings} className="btn-primary" disabled={settingsSaving} style={{ width: '100%' }}>
                  {settingsSaving ? 'Saving…' : 'SAVE SETTINGS'}
                </button>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '28px' }}>
            <div className="section-tag" style={{ marginBottom: '16px' }}>PREVIEW</div>
            {siteSettings.showFilmCta ? (
              <div style={{ background: 'var(--primary)', padding: '40px 32px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(45deg, rgba(0,0,0,0.04) 0px, rgba(0,0,0,0.04) 1px, transparent 1px, transparent 18px)' }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-accent)', fontSize: '11px', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.6)', marginBottom: '10px' }}>FOR UNIVERSITIES · PROGRAMS · TEAMS</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '42px', color: '#fff', lineHeight: 0.92, marginBottom: '18px' }}>
                    {siteSettings.filmCtaHeadline || 'WANT YOUR TEAM ON FILM?'}
                  </div>
                  <div style={{ fontFamily: 'var(--font-accent)', fontSize: '12px', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.1em', marginBottom: '24px' }}>
                    PROFESSIONAL LACROSSE VIDEOGRAPHY · PLAYER REELS
                  </div>
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <div style={{ background: '#fff', color: 'var(--primary)', fontFamily: 'var(--font-accent)', fontSize: '12px', letterSpacing: '0.15em', padding: '11px 24px' }}>WATCH MY REEL →</div>
                    <div style={{ border: '2px solid rgba(255,255,255,0.5)', color: '#fff', fontFamily: 'var(--font-accent)', fontSize: '12px', letterSpacing: '0.15em', padding: '9px 22px' }}>
                      {siteSettings.filmCtaEmail ? `EMAIL ${siteSettings.filmCtaEmail.split('@')[0].toUpperCase()} ↗` : 'GET IN TOUCH ↗'}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ background: 'var(--bg-card2)', border: '1px dashed var(--border)', padding: '40px 32px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-accent)', fontSize: '12px', letterSpacing: '0.15em', color: 'var(--text-muted)' }}>FILM CTA IS HIDDEN</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '10px', lineHeight: 1.6 }}>
                  Enable the toggle to show a "Want your team on film?" section at the bottom of the homepage.
                </div>
              </div>
            )}

            <div style={{ marginTop: '20px', padding: '16px', background: 'var(--bg)', border: '1px solid var(--border)' }}>
              <div style={{ fontFamily: 'var(--font-accent)', fontSize: '11px', letterSpacing: '0.15em', color: 'var(--primary)', marginBottom: '8px' }}>NOTE</div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                The "My Reel" button on the Film CTA links to your <strong>/videos</strong> page filtered to "MY VIDEOS". Make sure you've added your own videos in the Videos tab first — anything tagged "My Videos (custom)" will appear there.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'schools' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-accent)', fontSize: '12px', letterSpacing: '0.18em', color: 'var(--primary)', marginBottom: '4px' }}>REVIEW QUEUE</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '28px' }}>School Submissions</h2>
            </div>
            <button onClick={() => fetch('/api/school-submissions').then(r=>r.json()).then(setSchoolSubs)} className="btn-outline" style={{ cursor: 'pointer' }}>↻ REFRESH</button>
          </div>
          {schoolSubs.length === 0 ? (
            <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '32px', color: 'var(--primary)', marginBottom: '12px' }}>0</div>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No pending school submissions yet. They'll show up here when fans submit via the College Hub.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '16px' }}>
              {schoolSubs.map((sub: any) => (
                <div key={sub.id} className="card" style={{ padding: '24px', borderLeft: `4px solid ${sub.status === 'approved' ? '#22c55e' : sub.status === 'rejected' ? '#ef4444' : 'var(--primary)'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap', marginBottom: '16px' }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '22px', marginBottom: '4px' }}>{sub.schoolName || 'Unnamed School'}</div>
                      <div style={{ fontFamily: 'var(--font-accent)', fontSize: '11px', letterSpacing: '0.15em', color: 'var(--text-muted)' }}>
                        {sub.submitterName} · {sub.submitterEmail} · {new Date(sub.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                    <span style={{ fontFamily: 'var(--font-accent)', fontSize: '11px', letterSpacing: '0.12em', padding: '4px 10px', background: sub.status === 'approved' ? '#22c55e22' : sub.status === 'rejected' ? '#ef444422' : 'color-mix(in srgb, var(--primary) 15%, transparent)', color: sub.status === 'approved' ? '#22c55e' : sub.status === 'rejected' ? '#ef4444' : 'var(--primary)' }}>
                      {(sub.status || 'pending').toUpperCase()}
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px', marginBottom: '16px' }}>
                    {([['Conference', sub.conference], ['Location', sub.city && sub.state ? `${sub.city}, ${sub.state}` : null], ['Nickname', sub.nickname], ['Team Site', sub.lacrosseSiteUrl], ['Schedule', sub.scheduleUrl], ['Roster', sub.rosterUrl]] as [string,string][]).filter(([,v]) => v).map(([label, val]) => (
                      <div key={label}>
                        <div style={{ fontFamily: 'var(--font-accent)', fontSize: '10px', letterSpacing: '0.15em', color: 'var(--text-muted)', marginBottom: '3px' }}>{label}</div>
                        {val.startsWith('http') ? <a href={val} target="_blank" rel="noopener noreferrer" style={{ fontSize: '13px', color: 'var(--primary)', wordBreak: 'break-all' }}>{val}</a> : <div style={{ fontSize: '13px', color: 'var(--text)' }}>{val}</div>}
                      </div>
                    ))}
                  </div>
                  {sub.notes && <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', padding: '12px 14px', marginBottom: '16px', fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6 }}><strong style={{ color: 'var(--text)', fontFamily: 'var(--font-accent)', fontSize: '10px', letterSpacing: '0.15em' }}>NOTES: </strong>{sub.notes}</div>}
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button onClick={() => fetch('/api/school-submissions', { method: 'PATCH', headers: {'Content-Type':'application/json'}, body: JSON.stringify({id: sub.id, status: 'approved'}) }).then(()=>fetch('/api/school-submissions').then(r=>r.json()).then(setSchoolSubs))} style={{ fontFamily: 'var(--font-accent)', fontSize: '12px', letterSpacing: '0.15em', padding: '8px 18px', background: '#22c55e', color: '#fff', border: 'none', cursor: 'pointer' }}>✓ APPROVE</button>
                    <button onClick={() => fetch('/api/school-submissions', { method: 'PATCH', headers: {'Content-Type':'application/json'}, body: JSON.stringify({id: sub.id, status: 'rejected'}) }).then(()=>fetch('/api/school-submissions').then(r=>r.json()).then(setSchoolSubs))} style={{ fontFamily: 'var(--font-accent)', fontSize: '12px', letterSpacing: '0.15em', padding: '8px 18px', background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', cursor: 'pointer' }}>✕ REJECT</button>
                    <button onClick={() => fetch('/api/school-submissions', { method: 'DELETE', headers: {'Content-Type':'application/json'}, body: JSON.stringify({id: sub.id}) }).then(()=>fetch('/api/school-submissions').then(r=>r.json()).then(setSchoolSubs))} style={{ fontFamily: 'var(--font-accent)', fontSize: '12px', letterSpacing: '0.15em', padding: '8px 18px', background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border)', cursor: 'pointer' }}>DELETE</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
