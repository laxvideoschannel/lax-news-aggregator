'use client';

import { FormEvent, useEffect, useMemo, useState, useCallback } from 'react';
import Link from 'next/link';
import { ALL_TEAMS } from '@/lib/teams';
import { COLLEGE_TEAMS } from '@/lib/college';

type Tab = 'videos' | 'channels' | 'schedule' | 'news' | 'college' | 'settings' | 'schools';

type AdminVideo = { id: string | number; title: string; youtube_url: string; channel_name?: string; league?: 'PLL' | 'WLL' | 'CUSTOM'; published_at?: string; };
type AdminSource = { id: string | number; title?: string; handle_url?: string; channel_name?: string; channel_id?: string; league?: 'PLL' | 'WLL' | 'CUSTOM'; pull_mode?: 'all' | 'select'; active?: boolean; team_id?: string | null; };
type PreviewVideo = { id: string; title: string; youtubeUrl: string; thumbnailUrl: string; channelName: string; publishedAt?: string; };
type AdminGame = { id: string | number; slug: string; date_label: string; sort_date?: string; venue: string; event: string; home_id: string; away_id: string; time: string; broadcast: string; status: 'final' | 'upcoming'; score?: string; ticket_url?: string; recap_title?: string; };
type NewsSource = { id: string | number; label: string; feed_url: string; category: string; active: boolean; };
type SiteSettings = { showFilmCta: boolean; filmCtaEmail: string; filmCtaHeadline: string; };

const inputStyle: React.CSSProperties = { padding: '11px 14px', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', width: '100%', fontFamily: 'var(--font-body)', fontSize: '14px' };
const labelStyle: React.CSSProperties = { fontFamily: 'var(--font-accent)', fontSize: '10px', letterSpacing: '0.18em', color: 'var(--text-muted)', display: 'block', marginBottom: '5px' };

function TabButton({ active, onClick, children, badge }: { active: boolean; onClick: () => void; children: React.ReactNode; badge?: number }) {
  return (
    <button onClick={onClick} style={{ fontFamily: 'var(--font-accent)', fontSize: '12px', letterSpacing: '0.14em', padding: '12px 18px', background: active ? 'var(--primary)' : 'transparent', color: active ? '#fff' : 'var(--text-muted)', border: 'none', borderBottom: active ? 'none' : '1px solid var(--border)', cursor: 'pointer', transition: 'all 0.18s', whiteSpace: 'nowrap' }}>
      {children}{badge != null && badge > 0 && <span style={{ marginLeft: 6, background: active ? 'rgba(255,255,255,0.3)' : 'var(--primary)', color: '#fff', fontSize: 10, padding: '2px 6px', borderRadius: 10 }}>{badge}</span>}
    </button>
  );
}

function Toggle({ checked, onChange, label, sub }: { checked: boolean; onChange: (v: boolean) => void; label: string; sub?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid var(--border)', gap: '20px' }}>
      <div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '18px', lineHeight: 1.1, marginBottom: sub ? '3px' : 0 }}>{label}</div>
        {sub && <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{sub}</div>}
      </div>
      <button onClick={() => onChange(!checked)} style={{ width: '48px', height: '26px', borderRadius: '13px', border: 'none', background: checked ? 'var(--primary)' : 'var(--border)', position: 'relative', cursor: 'pointer', flexShrink: 0, transition: 'background 0.2s' }}>
        <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#fff', position: 'absolute', top: '3px', left: checked ? '25px' : '3px', transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }} />
      </button>
    </div>
  );
}

function Card({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="card" style={{ padding: 26 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, gap: 12 }}>
        <div className="section-tag">{title}</div>
        {action}
      </div>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label style={labelStyle}>{label}</label>{children}</div>;
}

function Pill({ ok, label }: { ok: boolean; label: string }) {
  return <span style={{ fontSize: 10, fontFamily: 'var(--font-accent)', letterSpacing: '0.12em', padding: '3px 8px', background: ok ? '#22c55e22' : 'color-mix(in srgb, var(--primary) 12%, transparent)', color: ok ? '#22c55e' : 'var(--primary)', borderRadius: 3 }}>{label}</span>;
}

function RefreshBtn({ onClick }: { onClick: () => void }) {
  return <button onClick={onClick} style={{ padding: '6px 12px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', fontFamily: 'var(--font-accent)', fontSize: '11px', letterSpacing: '0.12em' }}>↻ REFRESH</button>;
}

export default function AdminPage() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('videos');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [videos, setVideos] = useState<AdminVideo[]>([]);
  const [sources, setSources] = useState<AdminSource[]>([]);
  const [defaultSources, setDefaultSources] = useState<any[]>([]);
  const [previewVideos, setPreviewVideos] = useState<PreviewVideo[]>([]);
  const [selectedPreviewUrls, setSelectedPreviewUrls] = useState<string[]>([]);
  const [selectedSourceId, setSelectedSourceId] = useState('');
  const [loadingPreview, setLoadingPreview] = useState(false);

  const [games, setGames] = useState<AdminGame[]>([]);
  const [gamesLoading, setGamesLoading] = useState(false);
  const [editingGame, setEditingGame] = useState<AdminGame | null>(null);

  const [newsSources, setNewsSources] = useState<NewsSource[]>([]);
  const [newsLoading, setNewsLoading] = useState(false);

  const [schoolSubs, setSchoolSubs] = useState<any[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({ showFilmCta: false, filmCtaEmail: '', filmCtaHeadline: 'WANT YOUR TEAM ON FILM?' });
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });

  const [videoForm, setVideoForm] = useState({ title: '', youtubeUrl: '', channelName: '', description: '', league: 'CUSTOM' as 'PLL' | 'WLL' | 'CUSTOM', featured: false });
  const [sourceForm, setSourceForm] = useState({ title: '', handleUrl: '', channelName: '', league: 'CUSTOM' as 'PLL' | 'WLL' | 'CUSTOM', pullMode: 'select' as 'all' | 'select', teamId: '' });
  const [gameForm, setGameForm] = useState({ dateLabel: '', sortDate: '', venue: '', event: '', homeId: '', awayId: '', time: '', broadcast: '', status: 'upcoming' as 'final' | 'upcoming', score: '', ticketUrl: '', recapTitle: '' });
  const [newsForm, setNewsForm] = useState({ label: '', feedUrl: '', category: 'General' });

  const combinedSources = useMemo(() => [...defaultSources, ...sources.map((s) => ({ ...s, id: String(s.id) }))], [defaultSources, sources]);

  const flash = useCallback((msg: string, isErr = false) => {
    if (isErr) { setError(msg); setTimeout(() => setError(''), 4000); }
    else { setSuccess(msg); setTimeout(() => setSuccess(''), 3000); }
  }, []);

  const loadDashboard = useCallback(async () => {
    const [vRes, sRes, setRes] = await Promise.all([fetch('/api/admin/videos'), fetch('/api/admin/video-sources'), fetch('/api/admin/settings').catch(() => null)]);
    if (!vRes.ok || !sRes.ok) { setIsAuthed(false); setChecking(false); return; }
    const vd = await vRes.json(); const sd = await sRes.json();
    setVideos(Array.isArray(vd.videos) ? vd.videos : []);
    setSources(Array.isArray(sd.sources) ? sd.sources : []);
    setDefaultSources(Array.isArray(sd.defaults) ? sd.defaults : []);
    if (setRes?.ok) { const s = await setRes.json(); setSiteSettings((p) => ({ ...p, ...s })); }
    setIsAuthed(true); setChecking(false);
  }, []);

  useEffect(() => { loadDashboard().catch(() => setChecking(false)); }, [loadDashboard]);

  const loadGames = useCallback(async () => {
    setGamesLoading(true);
    try { const r = await fetch('/api/admin/schedule'); if (r.ok) { const d = await r.json(); setGames(Array.isArray(d.games) ? d.games : []); } }
    finally { setGamesLoading(false); }
  }, []);

  const loadNewsSources = useCallback(async () => {
    setNewsLoading(true);
    try { const r = await fetch('/api/admin/news-sources'); if (r.ok) { const d = await r.json(); setNewsSources(Array.isArray(d.sources) ? d.sources : []); } }
    finally { setNewsLoading(false); }
  }, []);

  const loadSchoolSubs = useCallback(() => { fetch('/api/school-submissions').then(r => r.json()).then(setSchoolSubs).catch(() => {}); }, []);

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    if (tab === 'schedule' && games.length === 0) loadGames();
    if (tab === 'news' && newsSources.length === 0) loadNewsSources();
    if (tab === 'schools') loadSchoolSubs();
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault(); setError(''); setSubmitting(true);
    const res = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(loginForm) });
    setSubmitting(false);
    if (!res.ok) { flash((await res.json().catch(() => ({}))).error || 'Login failed.', true); return; }
    await loadDashboard();
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    setIsAuthed(false); setVideos([]); setSources([]);
  };

  const handleCreateVideo = async (e: FormEvent) => {
    e.preventDefault(); setSubmitting(true);
    const res = await fetch('/api/admin/videos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(videoForm) });
    setSubmitting(false);
    if (!res.ok) { flash((await res.json().catch(() => ({}))).error || 'Failed.', true); return; }
    setVideoForm({ title: '', youtubeUrl: '', channelName: '', description: '', league: 'CUSTOM', featured: false });
    flash('Video published!'); await loadDashboard();
  };

  const handleCreateSource = async (e: FormEvent) => {
    e.preventDefault(); setSubmitting(true);
    const res = await fetch('/api/admin/video-sources', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: sourceForm.title, handleUrl: sourceForm.handleUrl, channelName: sourceForm.channelName, league: sourceForm.league, pullMode: sourceForm.pullMode, teamId: sourceForm.teamId || null }) });
    setSubmitting(false);
    if (!res.ok) { flash((await res.json().catch(() => ({}))).error || 'Failed.', true); return; }
    setSourceForm({ title: '', handleUrl: '', channelName: '', league: 'CUSTOM', pullMode: 'select', teamId: '' });
    flash('Channel added!'); await loadDashboard();
  };

  const loadPreview = async (sourceId: string) => {
    setSelectedSourceId(sourceId); setLoadingPreview(true); setSelectedPreviewUrls([]);
    const res = await fetch(`/api/admin/video-sources/preview?sourceId=${encodeURIComponent(sourceId)}`);
    const data = await res.json().catch(() => ({ videos: [] }));
    setPreviewVideos(Array.isArray(data.videos) ? data.videos : []);
    setLoadingPreview(false);
  };

  const importFromSource = async (mode: 'all' | 'selected') => {
    if (!selectedSourceId) return; setSubmitting(true);
    const res = await fetch('/api/admin/video-sources/import', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sourceId: selectedSourceId, mode, selectedUrls: selectedPreviewUrls }) });
    setSubmitting(false);
    if (!res.ok) { flash((await res.json().catch(() => ({}))).error || 'Import failed.', true); return; }
    flash('Videos imported!'); await loadDashboard();
  };

  const handleCreateGame = async (e: FormEvent) => {
    e.preventDefault(); setSubmitting(true);
    const res = await fetch('/api/admin/schedule', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(gameForm) });
    setSubmitting(false);
    if (!res.ok) { flash((await res.json().catch(() => ({}))).error || 'Failed.', true); return; }
    setGameForm({ dateLabel: '', sortDate: '', venue: '', event: '', homeId: '', awayId: '', time: '', broadcast: '', status: 'upcoming', score: '', ticketUrl: '', recapTitle: '' });
    flash('Game added!'); loadGames();
  };

  const handleUpdateGame = async (id: string | number, updates: Record<string, unknown>) => {
    const res = await fetch('/api/admin/schedule', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, ...updates }) });
    if (!res.ok) { flash('Update failed.', true); return; }
    flash('Updated!'); loadGames(); setEditingGame(null);
  };

  const handleDeleteGame = async (id: string | number) => {
    if (!confirm('Delete this game?')) return;
    const res = await fetch('/api/admin/schedule', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    if (!res.ok) { flash('Delete failed.', true); return; }
    flash('Deleted.'); loadGames();
  };

  const handleAddNewsSource = async (e: FormEvent) => {
    e.preventDefault(); setSubmitting(true);
    const res = await fetch('/api/admin/news-sources', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newsForm) });
    setSubmitting(false);
    if (!res.ok) { flash((await res.json().catch(() => ({}))).error || 'Failed.', true); return; }
    setNewsForm({ label: '', feedUrl: '', category: 'General' }); flash('Source added!'); loadNewsSources();
  };

  const handleToggleNews = async (id: string | number, active: boolean) => {
    await fetch('/api/admin/news-sources', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, active }) });
    loadNewsSources();
  };

  const handleDeleteNews = async (id: string | number) => {
    if (!confirm('Remove this source?')) return;
    await fetch('/api/admin/news-sources', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    flash('Removed.'); loadNewsSources();
  };

  const saveSettings = async () => {
    setSettingsSaving(true);
    const res = await fetch('/api/admin/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(siteSettings) });
    setSettingsSaving(false);
    if (!res.ok) { flash('Save failed.', true); return; }
    flash('Settings saved!');
  };

  const patchSub = (id: any, status: string) =>
    fetch('/api/school-submissions', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) }).then(loadSchoolSubs);
  const deleteSub = (id: any) =>
    fetch('/api/school-submissions', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) }).then(loadSchoolSubs);

  if (checking) return <div className="container" style={{ padding: '100px 0', color: 'var(--text-muted)', fontFamily: 'var(--font-accent)', fontSize: 13, letterSpacing: '0.14em' }}>LOADING…</div>;

  if (!isAuthed) {
    return (
      <div className="container" style={{ padding: '90px 0 120px', maxWidth: '480px' }}>
        <div className="card" style={{ padding: '36px' }}>
          <div className="section-tag" style={{ marginBottom: '10px' }}>ADMIN</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '52px', lineHeight: 0.9, marginBottom: '14px' }}>SIGN IN</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '22px', fontSize: 14, lineHeight: 1.7 }}>Manage videos, schedule, news, and site settings.</p>
          <form onSubmit={handleLogin} style={{ display: 'grid', gap: '12px' }}>
            <input value={loginForm.username} onChange={(e) => setLoginForm((p) => ({ ...p, username: e.target.value }))} placeholder="Username" style={inputStyle} />
            <input type="password" value={loginForm.password} onChange={(e) => setLoginForm((p) => ({ ...p, password: e.target.value }))} placeholder="Password" style={inputStyle} />
            {error && <div style={{ color: 'var(--primary)', fontSize: '13px' }}>{error}</div>}
            <button type="submit" className="btn-primary" disabled={submitting} style={{ cursor: 'pointer' }}>{submitting ? 'Signing in…' : 'Sign In →'}</button>
          </form>
        </div>
      </div>
    );
  }

  const pendingSubs = schoolSubs.filter((s) => !s.status || s.status === 'pending').length;
  const twoCol: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'minmax(280px, 0.8fr) 1fr', gap: '20px', alignItems: 'start' };
  const grid2: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' };

  return (
    <div className="container" style={{ padding: '48px 0 120px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div className="section-tag" style={{ marginBottom: '8px' }}>ADMIN DASHBOARD</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(40px, 6vw, 60px)', lineHeight: 0.9 }}>CONTROL ROOM</h1>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          {[{ label: 'Videos', value: videos.length }, { label: 'Games (DB)', value: games.length }].map((s) => (
            <div key={s.label} style={{ padding: '10px 14px', background: 'var(--bg-card)', border: '1px solid var(--border)', textAlign: 'center', minWidth: 68 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 20, color: 'var(--primary)', lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontFamily: 'var(--font-accent)', fontSize: 9, letterSpacing: '0.14em', color: 'var(--text-muted)', marginTop: 2 }}>{s.label.toUpperCase()}</div>
            </div>
          ))}
          <button onClick={handleLogout} style={{ padding: '10px 16px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', fontFamily: 'var(--font-accent)', fontSize: '11px', letterSpacing: '0.12em' }}>LOG OUT</button>
        </div>
      </div>

      {error && <div style={{ background: 'color-mix(in srgb, var(--primary) 12%, transparent)', border: '1px solid var(--primary)', padding: '12px 16px', marginBottom: '16px', color: 'var(--primary)', fontSize: '13px' }}>{error}</div>}
      {success && <div style={{ background: 'color-mix(in srgb, #22c55e 12%, transparent)', border: '1px solid #22c55e', padding: '12px 16px', marginBottom: '16px', color: '#22c55e', fontSize: '13px' }}>✓ {success}</div>}

      {/* Tabs */}
      <div style={{ display: 'flex', marginBottom: '24px', borderBottom: '1px solid var(--border)', overflowX: 'auto' }}>
        <TabButton active={activeTab === 'videos'} onClick={() => handleTabChange('videos')} badge={videos.length}>VIDEOS</TabButton>
        <TabButton active={activeTab === 'channels'} onClick={() => handleTabChange('channels')}>CHANNELS</TabButton>
        <TabButton active={activeTab === 'schedule'} onClick={() => handleTabChange('schedule')} badge={games.length}>SCHEDULE</TabButton>
        <TabButton active={activeTab === 'news'} onClick={() => handleTabChange('news')}>NEWS SOURCES</TabButton>
        <TabButton active={activeTab === 'college'} onClick={() => handleTabChange('college')}>COLLEGE</TabButton>
        <TabButton active={activeTab === 'settings'} onClick={() => handleTabChange('settings')}>SETTINGS</TabButton>
        <TabButton active={activeTab === 'schools'} onClick={() => handleTabChange('schools')} badge={pendingSubs}>SCHOOL QUEUE</TabButton>
      </div>

      {/* ── VIDEOS ── */}
      {activeTab === 'videos' && (
        <div style={twoCol}>
          <Card title="ADD SINGLE VIDEO">
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '16px', lineHeight: 1.6 }}>Paste any YouTube URL. Your videos show in the "MY VIDEOS" filter alongside PLL/WLL feeds.</p>
            <form onSubmit={handleCreateVideo} style={{ display: 'grid', gap: '10px' }}>
              <Field label="YOUTUBE URL *"><input value={videoForm.youtubeUrl} onChange={(e) => setVideoForm((p) => ({ ...p, youtubeUrl: e.target.value }))} placeholder="https://youtube.com/watch?v=…" style={inputStyle} required /></Field>
              <Field label="TITLE *"><input value={videoForm.title} onChange={(e) => setVideoForm((p) => ({ ...p, title: e.target.value }))} placeholder="Video title" style={inputStyle} required /></Field>
              <Field label="CHANNEL"><input value={videoForm.channelName} onChange={(e) => setVideoForm((p) => ({ ...p, channelName: e.target.value }))} placeholder="e.g. PLL Official" style={inputStyle} /></Field>
              <Field label="LEAGUE TAG">
                <select value={videoForm.league} onChange={(e) => setVideoForm((p) => ({ ...p, league: e.target.value as any }))} style={inputStyle}>
                  <option value="CUSTOM">My Videos</option><option value="PLL">PLL</option><option value="WLL">WLL</option>
                </select>
              </Field>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: 13, cursor: 'pointer' }}>
                <input type="checkbox" checked={videoForm.featured} onChange={(e) => setVideoForm((p) => ({ ...p, featured: e.target.checked }))} />Feature as homepage hero
              </label>
              <button type="submit" className="btn-primary" disabled={submitting} style={{ cursor: 'pointer', marginTop: 4 }}>{submitting ? 'Saving…' : 'PUBLISH VIDEO'}</button>
            </form>
          </Card>
          <Card title={`VIDEO LIBRARY (${videos.length})`}>
            <div style={{ display: 'grid', gap: '8px', maxHeight: '580px', overflowY: 'auto' }}>
              {videos.length === 0 ? <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>No videos yet.</p> : videos.map((v) => {
                const vid = v.youtube_url.match(/(?:v=|youtu\.be\/)([^&?/]+)/)?.[1];
                return (
                  <div key={String(v.id)} style={{ border: '1px solid var(--border)', padding: '11px', background: 'var(--bg)', display: 'grid', gridTemplateColumns: '72px 1fr', gap: '11px', alignItems: 'center' }}>
                    {vid && <img src={`https://i.ytimg.com/vi/${vid}/mqdefault.jpg`} alt="" style={{ width: 72, aspectRatio: '16/9', objectFit: 'cover' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />}
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15, lineHeight: 1.1, marginBottom: 3 }}>{v.title}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: 11 }}>{v.league === 'CUSTOM' ? 'MY VIDEOS' : v.league} · {v.channel_name || '—'}</div>
                      <a href={v.youtube_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', fontSize: 11, marginTop: 4, display: 'inline-block' }}>Open ↗</a>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {/* ── CHANNELS ── */}
      {activeTab === 'channels' && (
        <div style={twoCol}>
          <Card title="ADD YOUTUBE CHANNEL">
            <form onSubmit={handleCreateSource} style={{ display: 'grid', gap: '10px' }}>
              <Field label="CHANNEL URL *"><input value={sourceForm.handleUrl} onChange={(e) => setSourceForm((p) => ({ ...p, handleUrl: e.target.value }))} placeholder="youtube.com/@PLLLacrosse" style={inputStyle} required /></Field>
              <Field label="FEED LABEL *"><input value={sourceForm.title} onChange={(e) => setSourceForm((p) => ({ ...p, title: e.target.value }))} placeholder="e.g. PLL Official" style={inputStyle} required /></Field>
              <Field label="DISPLAY NAME"><input value={sourceForm.channelName} onChange={(e) => setSourceForm((p) => ({ ...p, channelName: e.target.value }))} style={inputStyle} /></Field>
              <Field label="LEAGUE"><select value={sourceForm.league} onChange={(e) => setSourceForm((p) => ({ ...p, league: e.target.value as any }))} style={inputStyle}><option value="CUSTOM">My Videos</option><option value="PLL">PLL</option><option value="WLL">WLL</option></select></Field>
              <Field label="IMPORT MODE"><select value={sourceForm.pullMode} onChange={(e) => setSourceForm((p) => ({ ...p, pullMode: e.target.value as any }))} style={inputStyle}><option value="all">Pull all automatically</option><option value="select">I&apos;ll pick manually</option></select></Field>
              <Field label="TAG TO TEAM"><select value={sourceForm.teamId} onChange={(e) => setSourceForm((p) => ({ ...p, teamId: e.target.value }))} style={inputStyle}><option value="">No team tag</option>{ALL_TEAMS.map((t) => <option key={t.id} value={t.id}>{t.full}</option>)}</select></Field>
              <button type="submit" className="btn-primary" disabled={submitting} style={{ cursor: 'pointer', marginTop: 4 }}>{submitting ? 'Saving…' : 'ADD CHANNEL'}</button>
            </form>
          </Card>
          <div style={{ display: 'grid', gap: '20px' }}>
            <Card title={`ACTIVE FEEDS (${combinedSources.length})`}>
              <div style={{ display: 'grid', gap: '8px' }}>
                {combinedSources.map((src) => (
                  <div key={String(src.id)} style={{ border: '1px solid var(--border)', padding: '11px 14px', background: selectedSourceId === String(src.id) ? 'color-mix(in srgb, var(--primary) 7%, var(--bg))' : 'var(--bg)', borderColor: selectedSourceId === String(src.id) ? 'var(--primary)' : 'var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                      <div>
                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, lineHeight: 1.1 }}>{src.title || src.channel_name}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: 11, marginTop: 2 }}>{src.league === 'CUSTOM' ? 'MY VIDEOS' : src.league} · {(src.pull_mode || 'all').toUpperCase()}</div>
                      </div>
                      <button onClick={() => loadPreview(String(src.id))} style={{ padding: '6px 10px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--primary)', cursor: 'pointer', fontFamily: 'var(--font-accent)', fontSize: '11px', letterSpacing: '0.12em' }}>PREVIEW →</button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            <Card title={selectedSourceId ? `PREVIEW (${previewVideos.length})` : 'FEED PREVIEW'}
              action={selectedSourceId && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => importFromSource('all')} disabled={submitting} style={{ padding: '6px 10px', border: 'none', background: 'var(--primary)', color: '#fff', cursor: 'pointer', fontFamily: 'var(--font-accent)', fontSize: '10px', letterSpacing: '0.12em' }}>IMPORT ALL</button>
                  <button onClick={() => importFromSource('selected')} disabled={selectedPreviewUrls.length === 0 || submitting} style={{ padding: '6px 10px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', cursor: 'pointer', fontFamily: 'var(--font-accent)', fontSize: '10px', letterSpacing: '0.12em', opacity: selectedPreviewUrls.length === 0 ? 0.4 : 1 }}>SELECTED ({selectedPreviewUrls.length})</button>
                </div>
              )}
            >
              {!selectedSourceId ? <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Click "Preview →" on any feed above.</p>
                : loadingPreview ? <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Loading…</p>
                : previewVideos.length === 0 ? <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>No videos found.</p>
                : (
                  <div style={{ display: 'grid', gap: '8px', maxHeight: '400px', overflowY: 'auto' }}>
                    {previewVideos.map((v) => (
                      <label key={v.youtubeUrl} style={{ border: '1px solid var(--border)', padding: '9px', display: 'grid', gridTemplateColumns: '20px 84px 1fr', gap: '10px', alignItems: 'center', cursor: 'pointer', background: selectedPreviewUrls.includes(v.youtubeUrl) ? 'color-mix(in srgb, var(--primary) 6%, var(--bg))' : 'var(--bg)', borderColor: selectedPreviewUrls.includes(v.youtubeUrl) ? 'var(--primary)' : 'var(--border)' }}>
                        <input type="checkbox" checked={selectedPreviewUrls.includes(v.youtubeUrl)} onChange={() => setSelectedPreviewUrls((p) => p.includes(v.youtubeUrl) ? p.filter((u) => u !== v.youtubeUrl) : [...p, v.youtubeUrl])} />
                        <img src={v.thumbnailUrl} alt="" style={{ width: 84, aspectRatio: '16/9', objectFit: 'cover' }} />
                        <div>
                          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, lineHeight: 1.1, marginBottom: 3 }}>{v.title}</div>
                          <div style={{ color: 'var(--text-muted)', fontSize: 11 }}>{v.channelName}{v.publishedAt ? ` · ${new Date(v.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : ''}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
            </Card>
          </div>
        </div>
      )}

      {/* ── SCHEDULE ── */}
      {activeTab === 'schedule' && (
        <div style={twoCol}>
          <Card title="ADD GAME">
            <form onSubmit={handleCreateGame} style={{ display: 'grid', gap: '10px' }}>
              <Field label="EVENT NAME *"><input value={gameForm.event} onChange={(e) => setGameForm((p) => ({ ...p, event: e.target.value }))} placeholder="e.g. Chaos Homecoming" style={inputStyle} required /></Field>
              <div style={grid2}>
                <Field label="HOME TEAM *"><select value={gameForm.homeId} onChange={(e) => setGameForm((p) => ({ ...p, homeId: e.target.value }))} style={inputStyle} required><option value="">Select…</option>{ALL_TEAMS.map((t) => <option key={t.id} value={t.id}>{t.full}</option>)}</select></Field>
                <Field label="AWAY TEAM *"><select value={gameForm.awayId} onChange={(e) => setGameForm((p) => ({ ...p, awayId: e.target.value }))} style={inputStyle} required><option value="">Select…</option>{ALL_TEAMS.map((t) => <option key={t.id} value={t.id}>{t.full}</option>)}</select></Field>
              </div>
              <div style={grid2}>
                <Field label="DATE LABEL *"><input value={gameForm.dateLabel} onChange={(e) => setGameForm((p) => ({ ...p, dateLabel: e.target.value }))} placeholder="Jun 5, Fri" style={inputStyle} required /></Field>
                <Field label="SORT DATE"><input type="date" value={gameForm.sortDate} onChange={(e) => setGameForm((p) => ({ ...p, sortDate: e.target.value }))} style={inputStyle} /></Field>
              </div>
              <Field label="VENUE"><input value={gameForm.venue} onChange={(e) => setGameForm((p) => ({ ...p, venue: e.target.value }))} placeholder="Charlotte, NC" style={inputStyle} /></Field>
              <div style={grid2}>
                <Field label="TIME"><input value={gameForm.time} onChange={(e) => setGameForm((p) => ({ ...p, time: e.target.value }))} placeholder="6:00 PM ET" style={inputStyle} /></Field>
                <Field label="BROADCAST"><input value={gameForm.broadcast} onChange={(e) => setGameForm((p) => ({ ...p, broadcast: e.target.value }))} placeholder="ESPN+" style={inputStyle} /></Field>
              </div>
              <Field label="STATUS"><select value={gameForm.status} onChange={(e) => setGameForm((p) => ({ ...p, status: e.target.value as any }))} style={inputStyle}><option value="upcoming">Upcoming</option><option value="final">Final</option></select></Field>
              {gameForm.status === 'final' && <Field label="SCORE (home-away)"><input value={gameForm.score} onChange={(e) => setGameForm((p) => ({ ...p, score: e.target.value }))} placeholder="14-10" style={inputStyle} /></Field>}
              {gameForm.status === 'upcoming' && <Field label="TICKET URL"><input value={gameForm.ticketUrl} onChange={(e) => setGameForm((p) => ({ ...p, ticketUrl: e.target.value }))} placeholder="https://…" style={inputStyle} /></Field>}
              <button type="submit" className="btn-primary" disabled={submitting} style={{ cursor: 'pointer', marginTop: 4 }}>{submitting ? 'Saving…' : 'ADD GAME'}</button>
            </form>
            <div style={{ marginTop: 16, padding: '12px 14px', background: 'var(--bg)', border: '1px solid var(--border)', fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>
              <strong style={{ color: 'var(--text)', fontFamily: 'var(--font-accent)', fontSize: 9, letterSpacing: '0.14em' }}>NOTE </strong>
              Games added here require a <code style={{ fontSize: 10, background: 'var(--bg-card)', padding: '1px 4px' }}>games</code> table in Supabase. Static games in <code style={{ fontSize: 10, background: 'var(--bg-card)', padding: '1px 4px' }}>lib/schedule.ts</code> always show on the Schedule page too.
            </div>
          </Card>
          <Card title={`GAME LIST (${games.length})`} action={<RefreshBtn onClick={loadGames} />}>
            {gamesLoading ? <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Loading…</p>
              : games.length === 0 ? (
                <div style={{ padding: '32px', textAlign: 'center', border: '1px dashed var(--border)' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 8 }}>No DB games yet. Add one using the form.</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>Static games in <code style={{ fontSize: 11 }}>lib/schedule.ts</code> always appear on the site.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '8px', maxHeight: '580px', overflowY: 'auto' }}>
                  {games.map((g) => (
                    <div key={String(g.id)} style={{ border: '1px solid var(--border)', padding: '12px 14px', background: 'var(--bg)' }}>
                      {editingGame?.id === g.id ? (
                        <div style={{ display: 'grid', gap: '8px' }}>
                          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16 }}>{g.event}</div>
                          <div style={grid2}>
                            <Field label="STATUS"><select value={editingGame.status} onChange={(e) => setEditingGame((p) => p ? { ...p, status: e.target.value as any } : p)} style={inputStyle}><option value="upcoming">Upcoming</option><option value="final">Final</option></select></Field>
                            <Field label="SCORE"><input value={editingGame.score || ''} onChange={(e) => setEditingGame((p) => p ? { ...p, score: e.target.value } : p)} placeholder="14-10" style={inputStyle} /></Field>
                          </div>
                          <Field label="BROADCAST"><input value={editingGame.broadcast} onChange={(e) => setEditingGame((p) => p ? { ...p, broadcast: e.target.value } : p)} style={inputStyle} /></Field>
                          <Field label="RECAP HEADLINE"><input value={editingGame.recap_title || ''} onChange={(e) => setEditingGame((p) => p ? { ...p, recap_title: e.target.value } : p)} style={inputStyle} /></Field>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button onClick={() => handleUpdateGame(g.id, { status: editingGame.status, score: editingGame.score, broadcast: editingGame.broadcast, recapTitle: editingGame.recap_title })} className="btn-primary" style={{ cursor: 'pointer', fontSize: 12 }}>SAVE</button>
                            <button onClick={() => setEditingGame(null)} style={{ padding: '9px 14px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', fontFamily: 'var(--font-accent)', fontSize: '11px', letterSpacing: '0.12em' }}>CANCEL</button>
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, flexWrap: 'wrap' }}>
                          <div>
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4, flexWrap: 'wrap' }}>
                              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16 }}>{g.event}</div>
                              <Pill ok={g.status === 'final'} label={g.status === 'final' ? (g.score || 'FINAL') : 'UPCOMING'} />
                            </div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{g.home_id.toUpperCase()} vs {g.away_id.toUpperCase()} · {g.date_label} · {g.venue}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>{g.broadcast} · {g.time}</div>
                          </div>
                          <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
                            <button onClick={() => setEditingGame(g)} style={{ padding: '5px 9px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--primary)', cursor: 'pointer', fontFamily: 'var(--font-accent)', fontSize: '10px', letterSpacing: '0.1em' }}>EDIT</button>
                            <button onClick={() => handleDeleteGame(g.id)} style={{ padding: '5px 9px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', fontFamily: 'var(--font-accent)', fontSize: '10px', letterSpacing: '0.1em' }}>DEL</button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
          </Card>
        </div>
      )}

      {/* ── NEWS SOURCES ── */}
      {activeTab === 'news' && (
        <div style={twoCol}>
          <Card title="ADD RSS FEED">
            <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 14, lineHeight: 1.6 }}>Add any RSS feed. Google News search feeds work great and auto-update.</p>
            <form onSubmit={handleAddNewsSource} style={{ display: 'grid', gap: '10px' }}>
              <Field label="LABEL *"><input value={newsForm.label} onChange={(e) => setNewsForm((p) => ({ ...p, label: e.target.value }))} placeholder="e.g. College Lax News" style={inputStyle} required /></Field>
              <Field label="RSS FEED URL *"><input value={newsForm.feedUrl} onChange={(e) => setNewsForm((p) => ({ ...p, feedUrl: e.target.value }))} placeholder="https://news.google.com/rss/search?q=lacrosse" style={inputStyle} required /></Field>
              <Field label="CATEGORY">
                <select value={newsForm.category} onChange={(e) => setNewsForm((p) => ({ ...p, category: e.target.value }))} style={inputStyle}>
                  {['General', 'PLL', 'WLL', 'College', 'Recruiting', 'International'].map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <button type="submit" className="btn-primary" disabled={submitting} style={{ cursor: 'pointer', marginTop: 4 }}>{submitting ? 'Adding…' : 'ADD SOURCE'}</button>
            </form>
            <div style={{ marginTop: 16, padding: '12px 14px', background: 'var(--bg)', border: '1px solid var(--border)' }}>
              <div style={{ fontFamily: 'var(--font-accent)', fontSize: 9, letterSpacing: '0.18em', color: 'var(--primary)', marginBottom: 6 }}>GOOGLE NEWS TEMPLATE</div>
              <code style={{ fontSize: 11, background: 'var(--bg-card)', padding: '8px 10px', display: 'block', wordBreak: 'break-all', lineHeight: 1.5, color: 'var(--text-muted)' }}>
                https://news.google.com/rss/search?q=<span style={{ color: 'var(--primary)' }}>your+search+here</span>&hl=en-US&gl=US&ceid=US:en
              </code>
            </div>
          </Card>
          <Card title={`SOURCES (${newsSources.length + 2})`} action={<RefreshBtn onClick={loadNewsSources} />}>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontFamily: 'var(--font-accent)', fontSize: 9, letterSpacing: '0.16em', color: 'var(--text-muted)', marginBottom: 8 }}>BUILT-IN (always active)</div>
              {[{ label: 'PLL + WLL Lacrosse', url: 'news.google.com › PLL lacrosse OR WLL lacrosse' }, { label: 'General Lacrosse News', url: 'news.google.com › lacrosse news' }].map((s) => (
                <div key={s.label} style={{ border: '1px solid var(--border)', padding: '10px 12px', background: 'var(--bg)', marginBottom: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>{s.label}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{s.url}</div>
                  </div>
                  <Pill ok label="ACTIVE" />
                </div>
              ))}
            </div>
            {newsLoading ? <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Loading…</p>
              : newsSources.length === 0 ? <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>No custom sources yet.</p>
              : (
                <div style={{ display: 'grid', gap: '8px' }}>
                  {newsSources.map((src) => (
                    <div key={String(src.id)} style={{ border: '1px solid var(--border)', padding: '11px 12px', background: 'var(--bg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 3 }}>
                          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>{src.label}</div>
                          <span style={{ fontFamily: 'var(--font-accent)', fontSize: 9, letterSpacing: '0.12em', color: 'var(--text-muted)', border: '1px solid var(--border)', padding: '2px 5px' }}>{src.category.toUpperCase()}</span>
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', wordBreak: 'break-all' }}>{src.feed_url}</div>
                      </div>
                      <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
                        <button onClick={() => handleToggleNews(src.id, !src.active)} style={{ padding: '4px 9px', border: '1px solid var(--border)', background: src.active ? 'color-mix(in srgb, #22c55e 12%, transparent)' : 'transparent', color: src.active ? '#22c55e' : 'var(--text-muted)', cursor: 'pointer', fontFamily: 'var(--font-accent)', fontSize: '10px', letterSpacing: '0.12em' }}>{src.active ? 'ON' : 'OFF'}</button>
                        <button onClick={() => handleDeleteNews(src.id)} style={{ padding: '4px 9px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', fontFamily: 'var(--font-accent)', fontSize: '10px', letterSpacing: '0.12em' }}>DEL</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </Card>
        </div>
      )}

      {/* ── COLLEGE ── */}
      {activeTab === 'college' && (
        <div style={twoCol}>
          <div style={{ display: 'grid', gap: '20px' }}>
            <Card title="ADD COLLEGE TEAM">
              <p style={{ color: 'var(--text-muted)', fontSize: 13, lineHeight: 1.6, marginBottom: 14 }}>New teams currently need a code entry in <code style={{ fontSize: 11, background: 'var(--bg)', padding: '2px 5px' }}>lib/college.ts</code>. The public submission form collects all the data you need.</p>
              <Link href="/college/add-school" className="btn-primary" style={{ display: 'block', textAlign: 'center', marginBottom: 14 }}>OPEN SUBMISSION FORM →</Link>
              <div style={{ padding: '12px 14px', background: 'var(--bg)', border: '1px solid var(--border)', fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.7 }}>
                <strong style={{ color: 'var(--text)', fontFamily: 'var(--font-accent)', fontSize: 9, letterSpacing: '0.14em' }}>COMING NEXT </strong>Full CRUD stored in Supabase — team entries auto-injected at runtime without any code changes.
              </div>
            </Card>
            <Card title="QUICK STATS">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'var(--border)' }}>
                {[{ label: 'Total Teams', value: COLLEGE_TEAMS.length }, { label: 'Conferences', value: new Set(COLLEGE_TEAMS.map((t) => t.conference)).size }, { label: 'With Rankings', value: COLLEGE_TEAMS.filter((t) => t.ranking).length }, { label: 'Subs Pending', value: pendingSubs }].map((s) => (
                  <div key={s.label} style={{ padding: '14px 16px', background: 'var(--bg)' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 24, color: 'var(--primary)', lineHeight: 1 }}>{s.value}</div>
                    <div style={{ fontFamily: 'var(--font-accent)', fontSize: 10, letterSpacing: '0.14em', color: 'var(--text-muted)', marginTop: 3 }}>{s.label.toUpperCase()}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
          <Card title={`COLLEGE TEAMS (${COLLEGE_TEAMS.length})`}>
            <div style={{ display: 'grid', gap: '8px', maxHeight: '580px', overflowY: 'auto' }}>
              {COLLEGE_TEAMS.map((team) => (
                <div key={team.slug} style={{ border: '1px solid var(--border)', padding: '11px 13px', background: 'var(--bg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    {team.logoUrl && <img src={team.logoUrl} alt="" style={{ width: 30, height: 30, objectFit: 'contain', flexShrink: 0 }} onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }} />}
                    <div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, lineHeight: 1.1 }}>{team.school}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{team.conference} · {team.nickname} · {team.record}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 5 }}>
                    <Link href={`/college/teams/${team.slug}`} style={{ padding: '5px 9px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--primary)', fontFamily: 'var(--font-accent)', fontSize: '10px', letterSpacing: '0.1em', textDecoration: 'none' }}>VIEW →</Link>
                    <a href={team.rosterUrl} target="_blank" rel="noopener noreferrer" style={{ padding: '5px 9px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', fontFamily: 'var(--font-accent)', fontSize: '10px', letterSpacing: '0.1em', textDecoration: 'none' }}>ROSTER ↗</a>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ── SETTINGS ── */}
      {activeTab === 'settings' && (
        <div style={twoCol}>
          <Card title="FILM / HIRE SECTION">
            <p style={{ color: 'var(--text-muted)', fontSize: 13, lineHeight: 1.6, marginBottom: 18 }}>When enabled, a "Want your team on film?" CTA appears at the bottom of the homepage.</p>
            <Toggle checked={siteSettings.showFilmCta} onChange={(v) => setSiteSettings((p) => ({ ...p, showFilmCta: v }))} label="Show Film CTA" sub={siteSettings.showFilmCta ? '✓ Visible to all visitors' : 'Hidden from visitors'} />
            {siteSettings.showFilmCta && (
              <div style={{ marginTop: 16, display: 'grid', gap: '10px' }}>
                <Field label="CONTACT EMAIL"><input value={siteSettings.filmCtaEmail} onChange={(e) => setSiteSettings((p) => ({ ...p, filmCtaEmail: e.target.value }))} placeholder="hello@youremail.com" style={inputStyle} /></Field>
                <Field label="HEADLINE"><input value={siteSettings.filmCtaHeadline} onChange={(e) => setSiteSettings((p) => ({ ...p, filmCtaHeadline: e.target.value }))} placeholder="WANT YOUR TEAM ON FILM?" style={inputStyle} /></Field>
              </div>
            )}
            <button onClick={saveSettings} className="btn-primary" disabled={settingsSaving} style={{ cursor: 'pointer', width: '100%', marginTop: 18 }}>{settingsSaving ? 'Saving…' : 'SAVE SETTINGS'}</button>
          </Card>
          <Card title="PREVIEW">
            {siteSettings.showFilmCta ? (
              <div style={{ background: 'var(--primary)', padding: '32px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(45deg, rgba(0,0,0,0.04) 0px, rgba(0,0,0,0.04) 1px, transparent 1px, transparent 18px)' }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-accent)', fontSize: 11, letterSpacing: '0.25em', color: 'rgba(255,255,255,0.6)', marginBottom: 10 }}>FOR UNIVERSITIES · PROGRAMS · TEAMS</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 32, color: '#fff', lineHeight: 0.92, marginBottom: 14 }}>{siteSettings.filmCtaHeadline || 'WANT YOUR TEAM ON FILM?'}</div>
                  <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <div style={{ background: '#fff', color: 'var(--primary)', fontFamily: 'var(--font-accent)', fontSize: 11, letterSpacing: '0.15em', padding: '9px 18px' }}>WATCH MY REEL →</div>
                    <div style={{ border: '2px solid rgba(255,255,255,0.5)', color: '#fff', fontFamily: 'var(--font-accent)', fontSize: 11, letterSpacing: '0.15em', padding: '7px 16px' }}>{siteSettings.filmCtaEmail ? `EMAIL ${siteSettings.filmCtaEmail.split('@')[0].toUpperCase()} ↗` : 'GET IN TOUCH ↗'}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ background: 'var(--bg)', border: '1px dashed var(--border)', padding: '36px', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>CTA hidden — enable the toggle to preview.</p>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* ── SCHOOL QUEUE ── */}
      {activeTab === 'schools' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-accent)', fontSize: 11, letterSpacing: '0.18em', color: 'var(--primary)', marginBottom: 3 }}>REVIEW QUEUE</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 28 }}>School Submissions</h2>
            </div>
            <RefreshBtn onClick={loadSchoolSubs} />
          </div>
          {schoolSubs.length === 0 ? (
            <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 40, color: 'var(--primary)', marginBottom: 10 }}>0</div>
              <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>No submissions yet. They appear here when fans submit via the College Hub.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '12px' }}>
              {schoolSubs.map((sub: any) => {
                const sc = sub.status === 'approved' ? '#22c55e' : sub.status === 'rejected' ? '#ef4444' : 'var(--primary)';
                return (
                  <div key={sub.id} className="card" style={{ padding: 20, borderLeft: `4px solid ${sc}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
                      <div>
                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 20, marginBottom: 2 }}>{sub.schoolName || 'Unnamed School'}</div>
                        <div style={{ fontFamily: 'var(--font-accent)', fontSize: 10, letterSpacing: '0.14em', color: 'var(--text-muted)' }}>{sub.submitterName} · {sub.submitterEmail} · {new Date(sub.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                      </div>
                      <span style={{ fontFamily: 'var(--font-accent)', fontSize: 10, letterSpacing: '0.12em', padding: '3px 8px', background: `${sc}18`, color: sc }}>{(sub.status || 'PENDING').toUpperCase()}</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '8px', marginBottom: 12 }}>
                      {([['Conference', sub.conference], ['Location', sub.city && sub.state ? `${sub.city}, ${sub.state}` : null], ['Nickname', sub.nickname], ['Team Site', sub.lacrosseSiteUrl], ['Schedule', sub.scheduleUrl], ['Roster', sub.rosterUrl]] as [string, string][]).filter(([, v]) => v).map(([lbl, val]) => (
                        <div key={lbl}>
                          <div style={{ fontFamily: 'var(--font-accent)', fontSize: 9, letterSpacing: '0.14em', color: 'var(--text-muted)', marginBottom: 2 }}>{lbl.toUpperCase()}</div>
                          {val.startsWith('http') ? <a href={val} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: 'var(--primary)', wordBreak: 'break-all' }}>{val}</a> : <div style={{ fontSize: 12, color: 'var(--text)' }}>{val}</div>}
                        </div>
                      ))}
                    </div>
                    {sub.notes && <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', padding: '9px 12px', marginBottom: 10, fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}><strong style={{ color: 'var(--text)', fontFamily: 'var(--font-accent)', fontSize: 9, letterSpacing: '0.14em' }}>NOTES: </strong>{sub.notes}</div>}
                    <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                      <button onClick={() => patchSub(sub.id, 'approved')} style={{ fontFamily: 'var(--font-accent)', fontSize: 10, letterSpacing: '0.14em', padding: '6px 12px', background: '#22c55e', color: '#fff', border: 'none', cursor: 'pointer' }}>✓ APPROVE</button>
                      <button onClick={() => patchSub(sub.id, 'rejected')} style={{ fontFamily: 'var(--font-accent)', fontSize: 10, letterSpacing: '0.14em', padding: '6px 12px', background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', cursor: 'pointer' }}>✕ REJECT</button>
                      <button onClick={() => deleteSub(sub.id)} style={{ fontFamily: 'var(--font-accent)', fontSize: 10, letterSpacing: '0.14em', padding: '6px 12px', background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border)', cursor: 'pointer' }}>DELETE</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
