type IconProps = { className?: string };

const base = {
  'aria-hidden': true,
  focusable: false,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
} as const;

export const ArrowIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M4 12h15M13 6l6 6-6 6" />
  </svg>
);

export const ArrowUpRightIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);

export const ChevronIcon = ({ className, dir = 'right' }: IconProps & { dir?: 'left' | 'right' }) => (
  <svg {...base} className={className} style={dir === 'left' ? { transform: 'scaleX(-1)' } : undefined}>
    <path d="m9 5 7 7-7 7" />
  </svg>
);

export const CloseIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M5 5l14 14M19 5 5 19" />
  </svg>
);

export const PhoneIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M6.5 3.5h3l1.5 4-2 1.5a11 11 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16.5 16.5 0 0 1 4.5 5.5a2 2 0 0 1 2-2Z" />
  </svg>
);

export const WhatsAppIcon = ({ className }: IconProps) => (
  <svg aria-hidden focusable={false} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12.04 2a9.9 9.9 0 0 0-8.5 14.98L2 22l5.17-1.5A9.9 9.9 0 1 0 12.04 2Zm0 18.13c-1.5 0-2.97-.4-4.25-1.17l-.3-.18-3.07.89.9-2.99-.2-.31a8.2 8.2 0 1 1 6.92 3.76Zm4.5-6.14c-.25-.12-1.46-.72-1.69-.8-.23-.08-.39-.12-.55.12-.16.25-.63.8-.78.96-.14.16-.29.18-.53.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.23-1.46-1.37-1.7-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.15.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.13-.55-1.33-.76-1.82-.2-.48-.4-.41-.55-.42h-.47c-.16 0-.43.06-.65.31-.23.25-.86.84-.86 2.04s.88 2.37 1 2.53c.13.17 1.73 2.64 4.2 3.7.58.25 1.04.4 1.4.52.59.19 1.12.16 1.55.1.47-.07 1.46-.6 1.66-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.17-.47-.29Z" />
  </svg>
);

export const PinIcon = ({ className }: IconProps) => (
  <svg {...base} className={className}>
    <path d="M12 21s-6.5-6.2-6.5-11.2a6.5 6.5 0 0 1 13 0C18.5 14.8 12 21 12 21Z" />
    <circle cx="12" cy="9.8" r="2.3" />
  </svg>
);

/** Isotipo: perfil de casa con nervaduras de chapa. */
export const Mark = ({ className }: IconProps) => (
  <svg aria-hidden focusable={false} viewBox="0 0 32 32" className={className}>
    <defs>
      <clipPath id="mark-roof">
        <path d="M3 13 16 4l13 9v15H3Z" />
      </clipPath>
    </defs>
    <g clipPath="url(#mark-roof)" fill="currentColor">
      {[3, 8.2, 13.4, 18.6, 23.8].map((x) => (
        <rect key={x} x={x} y="0" width="2.6" height="32" />
      ))}
    </g>
  </svg>
);
