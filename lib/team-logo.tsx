import React from 'react';

type Props = {
  teamId: string;
  size?: number;
  style?: React.CSSProperties;
};

export const TEAM_LOGO_URLS: Record<string, string> = {
  chaos: 'https://shop.premierlacrosseleague.com/cdn/shop/files/PLL-CHAOS-PRIM-STICKER_1.png?v=1730945088',
  cannons: 'https://shop.premierlacrosseleague.com/cdn/shop/files/PLL-CANNONS-PRIM-STICKER_1.png?v=1730945033',
  archers: 'https://shop.premierlacrosseleague.com/cdn/shop/files/PLL-ARCHERS-PRIM-STICKER_1.png?v=1730944905',
  outlaws: 'https://shop.premierlacrosseleague.com/cdn/shop/files/PLL-OUTLAWS-PRIM-STICKER_1.png?v=1730945101',
  atlas: 'https://shop.premierlacrosseleague.com/cdn/shop/files/PLL-ATLAS-PRIM-STICKER_1.png?v=1730944973',
  whipsnakes: 'https://shop.premierlacrosseleague.com/cdn/shop/files/PLL-WHIPSNAKES-PRIM-STICKER_1.png?v=1730945125',
  waterdogs: 'https://shop.premierlacrosseleague.com/cdn/shop/files/PLL-WATERDOGS-PRIM-STICKER_1.png?v=1730945143',
  redwoods: 'https://shop.premierlacrosseleague.com/cdn/shop/files/PLL-REDWOODS-PRIM-STICKER_1.png?v=1730945052',
  charging: 'https://img.premierlacrosseleague.com/Teams/2024/Logo/wll_new_york_charging_logo.png',
  guard: 'https://img.premierlacrosseleague.com/Teams/2024/Logo/wll_boston_guard_logo.png',
  charm: 'https://img.premierlacrosseleague.com/Teams/2024/Logo/wll_maryland_charm_logo.png',
  palms: 'https://img.premierlacrosseleague.com/Teams/2024/Logo/wll_california_palms_logo.png',
};

export function TeamLogo({ teamId, size = 40, style }: Props) {
  const src = TEAM_LOGO_URLS[teamId];

  if (!src) {
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          background: 'var(--team-surface-strong, var(--bg-card2))',
          border: '1px solid var(--border)',
          ...style,
        }}
      />
    );
  }

  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      style={{
        width: size,
        height: size,
        objectFit: 'contain',
        display: 'block',
        ...style,
      }}
    />
  );
}
