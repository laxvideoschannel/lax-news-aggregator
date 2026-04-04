import React from 'react';

type Props = {
  teamId: string;
  size?: number;
};

export function TeamLogo({ teamId, size = 40 }: Props) {
  const dims = { width: size, height: size, viewBox: '0 0 64 64', 'aria-hidden': true as const };

  switch (teamId) {
    case 'chaos':
      return (
        <svg {...dims}>
          <path d="M18 10 L26 8 L32 16 L38 8 L46 10 L42 20 L44 30 L38 24 L36 34 L40 46 L32 56 L24 46 L28 34 L26 24 L20 30 L22 20 Z" fill="#cc0000" stroke="#190000" strokeWidth="2" strokeLinejoin="round" />
          <path d="M22 14 L18 6 L26 10 Z" fill="#0c0c0c" />
          <path d="M42 14 L46 6 L38 10 Z" fill="#0c0c0c" />
          <path d="M29 24 Q32 20 35 24" stroke="#0c0c0c" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </svg>
      );
    case 'archers':
      return (
        <svg {...dims}>
          <path d="M10 48 L32 12 L54 48 L43 48 L32 31 L21 48 Z" fill="#ffffff" stroke="#e26b2d" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M23 48 L32 33 L41 48" fill="none" stroke="#1b3a6b" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M32 14 L35 9 L38 12 L35 17 Z" fill="#e26b2d" />
        </svg>
      );
    case 'outlaws':
      return (
        <svg {...dims}>
          <path d="M12 35 L30 28 L52 31 L38 36 L52 41 L30 44 Z" fill="#bf5a2a" stroke="#5b260f" strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M19 33 L13 26" stroke="#002868" strokeWidth="3" strokeLinecap="round" />
          <path d="M21 41 L14 47" stroke="#002868" strokeWidth="3" strokeLinecap="round" />
          <circle cx="35" cy="36" r="2.5" fill="#002868" />
        </svg>
      );
    case 'redwoods':
      return (
        <svg {...dims}>
          <path d="M32 10 L21 26 H28 L18 40 H28 L22 54 H42 L36 40 H46 L36 26 H43 Z" fill="#1f6f3b" stroke="#6b2a12" strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M32 40 V56" stroke="#6b2a12" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    case 'cannons':
      return (
        <svg {...dims}>
          <path d="M16 30 H42 A7 7 0 0 1 42 44 H16 Z" fill="#002244" />
          <path d="M14 28 H43" stroke="#c8102e" strokeWidth="4" strokeLinecap="round" />
          <circle cx="47" cy="40" r="8" fill="#c8102e" stroke="#002244" strokeWidth="3" />
          <path d="M20 44 V52 H27" stroke="#002244" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    case 'whipsnakes':
      return (
        <svg {...dims}>
          <path d="M44 14 C26 12 20 22 34 26 C48 30 42 40 24 40" fill="none" stroke="#ffd700" strokeWidth="6" strokeLinecap="round" />
          <path d="M24 40 C16 40 14 50 22 52 C31 54 37 49 39 43" fill="none" stroke="#111111" strokeWidth="3.2" strokeLinecap="round" />
          <circle cx="46" cy="15" r="3" fill="#111111" />
        </svg>
      );
    case 'atlas':
      return (
        <svg {...dims}>
          <path d="M15 21 C18 13, 26 11, 32 18 C38 11, 46 13, 49 21" fill="none" stroke="#7aa8d8" strokeWidth="4" strokeLinecap="round" />
          <path d="M22 24 Q32 16 42 24 L39 42 Q32 49 25 42 Z" fill="#ffffff" stroke="#003087" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M28 33 Q32 28 36 33" stroke="#003087" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </svg>
      );
    case 'waterdogs':
      return (
        <svg {...dims}>
          <path d="M20 22 C20 16 26 14 31 18 L37 18 C44 18 48 22 48 30 C48 40 41 46 32 46 C23 46 16 39 16 31 C16 27 17 24 20 22 Z" fill="#d9d9d9" stroke="#30343a" strokeWidth="2.4" strokeLinejoin="round" />
          <circle cx="36" cy="30" r="2.5" fill="#30343a" />
          <path d="M44 24 L51 20 L48 28" fill="#009a44" />
          <path d="M25 46 L23 52 M32 46 V53 M39 45 L41 51" stroke="#30343a" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg {...dims}>
          <circle cx="32" cy="32" r="24" fill="#999" />
        </svg>
      );
  }
}
