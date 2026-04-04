const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lax-news-aggregator.vercel.app';

export default function Head() {
  return (
    <>
      <title>LaxHub | PLL News, Carolina Chaos Bios, Schedule, Stats & Fan Coverage</title>
      <meta
        name="description"
        content="LaxHub is a PLL-focused fan site built for organic discovery, with Carolina Chaos player bios, lacrosse news, schedules, stats, and search-friendly team coverage."
      />
      <meta name="robots" content="index, follow, max-image-preview:large" />
      <link rel="canonical" href={SITE_URL} />
      <meta property="og:site_name" content="LaxHub" />
      <meta property="og:title" content="LaxHub | PLL News, Carolina Chaos Bios, Schedule, Stats & Fan Coverage" />
      <meta
        property="og:description"
        content="PLL fan coverage focused on Carolina Chaos player bios, news, schedule, stats, and search-friendly lacrosse content."
      />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={SITE_URL} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="LaxHub | PLL News, Carolina Chaos Bios, Schedule, Stats & Fan Coverage" />
      <meta
        name="twitter:description"
        content="PLL fan coverage focused on Carolina Chaos player bios, news, schedule, stats, and search-friendly lacrosse content."
      />
      <meta name="theme-color" content="#cc0000" />
    </>
  );
}
