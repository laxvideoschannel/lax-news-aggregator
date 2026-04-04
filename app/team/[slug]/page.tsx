import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { CHAOS_PLAYERS, getChaosPlayer } from '@/lib/players';
import { getTeam } from '@/lib/teams';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lax-news-aggregator.vercel.app';

function getPlayerImageSrc(imagePage?: string) {
  return imagePage ? `/api/player-image?url=${encodeURIComponent(imagePage)}` : null;
}

export function generateStaticParams() {
  return CHAOS_PLAYERS.map((player) => ({ slug: player.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const player = getChaosPlayer(params.slug);

  if (!player) {
    return {
      title: 'Player Not Found | LaxHub',
    };
  }

  const title = `${player.name} Bio, Stats, Highlights & Carolina Chaos Profile | LaxHub`;
  const description = `${player.name} profile page with Carolina Chaos bio, position, hometown, college, stats, highlights, and official PLL links.`;
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
  const player = getChaosPlayer(params.slug);

  if (!player) {
    notFound();
  }

  const team = getTeam(player.teamId);
  const imageSrc = getPlayerImageSrc(player.imagePage);
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: player.name,
    jobTitle: player.fullPosition,
    homeLocation: player.hometown,
    alumniOf: player.college,
    memberOf: team.full,
    url: `/team/${player.slug}`,
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
              ← BACK TO TEAM
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
                ) : null}
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
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '58px', color: 'var(--primary)', lineHeight: 0.9 }}>#{player.number}</div>
                <div style={{ fontFamily: 'var(--font-accent)', fontSize: '11px', letterSpacing: '0.14em', color: '#fff', marginTop: '4px' }}>{player.fullPosition.toUpperCase()}</div>
              </div>
            </div>

            <div>
              <div className="section-tag" style={{ marginBottom: '16px' }}>{team.full.toUpperCase()}</div>
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
                <a href={player.pllRosterUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">Official PLL Roster ↗</a>
                <a href={player.ticketsUrl} target="_blank" rel="noopener noreferrer" className="btn-outline">Tickets ↗</a>
                <a href={player.shopUrl} target="_blank" rel="noopener noreferrer" className="btn-outline">Shop ↗</a>
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

      <section style={{ paddingBottom: '70px' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '22px' }}>
            <div>
              <div className="section-tag" style={{ marginBottom: '10px' }}>LINKS & MEDIA</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(28px, 4vw, 48px)' }}>
                WATCH, READ,<br /><span style={{ color: 'var(--primary)' }}>AND FOLLOW</span>
              </h2>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '18px' }}>
            {player.media.map((item) => (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="card"
                style={{ padding: '22px', display: 'block' }}
              >
                <div style={{ fontFamily: 'var(--font-accent)', fontSize: '10px', letterSpacing: '0.12em', color: 'var(--primary)', marginBottom: '12px' }}>
                  {item.type.toUpperCase()}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '26px', lineHeight: 1.05, marginBottom: '16px' }}>
                  {item.title}
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Open official source ↗</div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
