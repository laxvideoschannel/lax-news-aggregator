import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ALL_PLAYERS, getPlayer } from '@/lib/players';
import { getTeam } from '@/lib/teams';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lax-news-aggregator.vercel.app';

function getPlayerImageSrc(imagePage?: string) {
  return imagePage ? `/api/player-image?url=${encodeURIComponent(imagePage)}` : null;
}

export function generateStaticParams() {
  return ALL_PLAYERS.map((player) => ({ slug: player.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const player = getPlayer(params.slug);

  if (!player) {
    return { title: 'Player Not Found | LaxHub' };
  }

  const team = getTeam(player.teamId);
  const title = `${player.name} Bio, Stats, Highlights & ${team.full} Profile | LaxHub`;
  const description = `${player.name} profile page with ${team.full} bio, position, stats, highlights, videos, and official ${player.league} links.`;
  const image = getPlayerImageSrc(player.imagePage);
  const imageUrl = image ? `${SITE_URL}${image}` : undefined;

  return {
    title,
    description,
    alternates: {
      canonical: `/team/${player.slug}`,
    },
    openGraph: {
      title,
      description,
      type: 'article',
      url: `${SITE_URL}/team/${player.slug}`,
      images: imageUrl ? [{ url: imageUrl }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export default function PlayerBioPage({ params }: { params: { slug: string } }) {
  const player = getPlayer(params.slug);

  if (!player) {
    notFound();
  }

  const team = getTeam(player.teamId);
  const imageSrc = getPlayerImageSrc(player.imagePage);
  const videoMedia = player.media.filter((item) => item.type === 'video');
  const otherMedia = player.media.filter((item) => item.type !== 'video');
  const officialLabel = player.league === 'PLL' ? 'Official PLL Roster' : 'Official WLL Coverage';

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: player.name,
    jobTitle: player.fullPosition,
    homeLocation: player.hometown,
    alumniOf: player.college,
    memberOf: team.full,
    url: `${SITE_URL}/team/${player.slug}`,
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section
        style={{
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(180deg, #090909 0%, #140000 58%, #090909 100%)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 20% 30%, rgba(204,0,0,0.16), transparent 45%)',
          }}
        />
        <div className="container" style={{ position: 'relative', zIndex: 1, paddingTop: '70px', paddingBottom: '70px' }}>
          <div style={{ marginBottom: '20px' }}>
            <Link href="/team" style={{ fontFamily: 'var(--font-accent)', fontSize: '11px', letterSpacing: '0.14em', color: 'var(--text-muted)' }}>
              {'<-'} BACK TO TEAM
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '420px 1fr', gap: '40px', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  width: '420px',
                  height: '420px',
                  borderRadius: '36px',
                  overflow: 'hidden',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(204,0,0,0.18)',
                  boxShadow: '0 40px 120px rgba(0,0,0,0.45)',
                }}
              >
                {imageSrc ? (
                  <img
                    src={imageSrc}
                    alt={player.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center top',
                      filter: 'grayscale(0.15) contrast(1.04) brightness(0.9)',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'var(--font-display)',
                      fontWeight: 900,
                      fontSize: '48px',
                      color: 'color-mix(in srgb, var(--primary) 78%, white)',
                    }}
                  >
                    {team.name.toUpperCase()}
                  </div>
                )}
              </div>
              <div
                style={{
                  position: 'absolute',
                  right: '-28px',
                  bottom: '28px',
                  background: 'rgba(0,0,0,0.82)',
                  border: '1px solid rgba(204,0,0,0.25)',
                  padding: '14px 18px',
                }}
              >
                {player.number ? (
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '58px', color: 'var(--primary)', lineHeight: 0.9 }}>#{player.number}</div>
                ) : null}
                <div style={{ fontFamily: 'var(--font-accent)', fontSize: '11px', letterSpacing: '0.14em', color: '#fff', marginTop: '4px' }}>{player.fullPosition.toUpperCase()}</div>
              </div>
            </div>

            <div>
              <div className="section-tag" style={{ marginBottom: '16px' }}>{`${team.full.toUpperCase()} • ${player.league}`}</div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(40px, 7vw, 88px)', lineHeight: 0.92, marginBottom: '16px' }}>
                {player.name.toUpperCase()}
              </h1>
              <p style={{ color: '#bdbdbd', fontSize: '17px', lineHeight: 1.8, maxWidth: '760px', marginBottom: '28px' }}>{player.bio}</p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '14px', marginBottom: '28px' }}>
                {player.stats.map((stat) => (
                  <div key={stat.label} className="card" style={{ padding: '18px' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '34px', color: 'var(--primary)', lineHeight: 1 }}>{stat.value}</div>
                    <div style={{ fontFamily: 'var(--font-accent)', fontSize: '10px', letterSpacing: '0.12em', color: 'var(--text-muted)', marginTop: '6px' }}>
                      {stat.label.toUpperCase()}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <a href={player.officialUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">{officialLabel} -&gt;</a>
                <a href={player.ticketsUrl} target="_blank" rel="noopener noreferrer" className="btn-outline">Tickets -&gt;</a>
                <a href={player.shopUrl} target="_blank" rel="noopener noreferrer" className="btn-outline">Shop {player.name.split(' ')[0]} Merch -&gt;</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '70px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '24px', alignItems: 'start' }}>
            <div className="card" style={{ padding: '28px' }}>
              <div className="section-tag" style={{ marginBottom: '18px' }}>PLAYER PROFILE</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
                {player.profile.map((field) => (
                  <div key={field.label} style={{ paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '24px', lineHeight: 1.1 }}>{field.value}</div>
                    <div style={{ fontFamily: 'var(--font-accent)', fontSize: '10px', letterSpacing: '0.12em', color: 'var(--text-muted)', marginTop: '6px' }}>
                      {field.label.toUpperCase()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card" style={{ padding: '28px' }}>
              <div className="section-tag" style={{ marginBottom: '18px' }}>CAREER HIGHLIGHTS</div>
              <div style={{ display: 'grid', gap: '12px' }}>
                {player.accolades.map((item) => (
                  <div key={item} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', marginTop: '7px', flexShrink: 0 }} />
                    <div style={{ color: '#d4d4d4', fontSize: '14px', lineHeight: 1.6 }}>{item}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ paddingBottom: '40px' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '22px' }}>
            <div>
              <div className="section-tag" style={{ marginBottom: '10px' }}>VIDEOS FIRST</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(28px, 4vw, 48px)' }}>
                WATCH, READ,<br /><span style={{ color: 'var(--primary)' }}>AND FOLLOW</span>
              </h2>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '18px', marginBottom: '18px' }}>
            {videoMedia.map((item) => (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="card"
                style={{ padding: '22px', display: 'block', position: 'relative', overflow: 'hidden', minHeight: '220px' }}
              >
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(204,0,0,0.14), rgba(0,0,0,0.9))' }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ width: '62px', height: '62px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', marginBottom: '18px' }}>
                    ▶
                  </div>
                  <div style={{ fontFamily: 'var(--font-accent)', fontSize: '10px', letterSpacing: '0.12em', color: 'var(--primary)', marginBottom: '12px' }}>
                    WATCH
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '26px', lineHeight: 1.05, marginBottom: '16px' }}>
                    {item.title}
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Open player videos -&gt;</div>
                </div>
              </a>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '18px' }}>
            {otherMedia.map((item) => (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="card"
                style={{ padding: '22px', display: 'block' }}
              >
                <div style={{ fontFamily: 'var(--font-accent)', fontSize: '10px', letterSpacing: '0.12em', color: 'var(--primary)', marginBottom: '12px' }}>
                  {item.type === 'article' ? 'READ' : 'FOLLOW'}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '26px', lineHeight: 1.05, marginBottom: '16px' }}>
                  {item.title}
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Open official source -&gt;</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section style={{ paddingBottom: '80px' }}>
        <div className="container">
          <div className="card" style={{ padding: '34px', display: 'grid', gridTemplateColumns: '360px 1fr', gap: '36px', alignItems: 'center', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div
                style={{
                  width: '240px',
                  height: '300px',
                  background: 'linear-gradient(180deg, #ffffff 0%, #f1f1f1 100%)',
                  borderRadius: '24px 24px 34px 34px',
                  position: 'relative',
                  boxShadow: '0 24px 60px rgba(0,0,0,0.35)',
                  border: '1px solid rgba(255,255,255,0.5)',
                }}
              >
                <div style={{ position: 'absolute', top: '18px', left: '22px', right: '22px', height: '10px', borderTop: '4px solid var(--primary)' }} />
                <div style={{ position: 'absolute', top: '0', left: '68px', width: '104px', height: '46px', background: '#0f0f0f', borderRadius: '0 0 22px 22px', borderBottom: '3px solid var(--primary)' }} />
                <div style={{ position: 'absolute', left: '14px', top: '74px', width: '26px', height: '92px', background: '#fff', border: '1px solid rgba(0,0,0,0.06)', transform: 'skewY(14deg)', borderTop: '4px solid var(--primary)' }} />
                <div style={{ position: 'absolute', right: '14px', top: '74px', width: '26px', height: '92px', background: '#fff', border: '1px solid rgba(0,0,0,0.06)', transform: 'skewY(-14deg)', borderTop: '4px solid var(--primary)' }} />
                <div style={{ position: 'absolute', top: '98px', left: 0, right: 0, textAlign: 'center', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '26px', color: '#111' }}>
                  {team.name.toUpperCase()}
                </div>
                {player.number ? (
                  <div style={{ position: 'absolute', top: '136px', left: 0, right: 0, textAlign: 'center', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '86px', lineHeight: 0.9, color: 'var(--primary)' }}>
                    {player.number}
                  </div>
                ) : (
                  <div style={{ position: 'absolute', top: '146px', left: '28px', right: '28px', textAlign: 'center', fontFamily: 'var(--font-accent)', fontSize: '12px', letterSpacing: '0.18em', color: '#111' }}>
                    OFFICIAL FAN SEARCH
                  </div>
                )}
                <div style={{ position: 'absolute', bottom: '18px', left: '18px', right: '18px', textAlign: 'center', fontFamily: 'var(--font-accent)', fontSize: '10px', letterSpacing: '0.18em', color: '#222' }}>
                  {player.name.toUpperCase()}
                </div>
              </div>
            </div>

            <div>
              <div className="section-tag" style={{ marginBottom: '14px' }}>FEATURED MERCH</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(28px, 4vw, 48px)', lineHeight: 0.94, marginBottom: '14px' }}>
                SHOP {player.name.toUpperCase()}<br /><span style={{ color: 'var(--primary)' }}>JERSEY & MERCH</span>
              </h2>
              <p style={{ color: '#bdbdbd', fontSize: '15px', lineHeight: 1.8, maxWidth: '640px', marginBottom: '24px' }}>
                Browse player-specific {team.full} merch results from the official league shop and partner storefronts.
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <a href={player.shopUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
                  Shop {player.name.split(' ')[0]}'s Merch -&gt;
                </a>
                <a href={player.ticketsUrl} target="_blank" rel="noopener noreferrer" className="btn-outline">
                  Buy Tickets -&gt;
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
