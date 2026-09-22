import type { SVGProps } from 'react';

type Props = SVGProps<SVGSVGElement> & { size?: number };

function base(size: number) {
  return { width: size, height: size, viewBox: '0 0 24 24', 'aria-hidden': true } as const;
}

export function InstagramIcon({ size = 20, ...props }: Props) {
  return (
    <svg {...base(size)} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2.6" y="2.6" width="18.8" height="18.8" rx="5.4" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function TelegramIcon({ size = 20, ...props }: Props) {
  return (
    <svg {...base(size)} fill="currentColor" {...props}>
      <path d="M21.7 4.3 2.9 11.5c-1 .4-1 1.8.1 2.1l4.4 1.4 1.7 5c.3.9 1.4 1.1 2 .4l2.4-2.6 4.4 3.2c.8.6 1.9.2 2.1-.8l3-13.6c.2-1-.7-1.9-1.7-1.5zM9.9 14.4l8-5.1-6.6 6.1-.3 3.1z" />
    </svg>
  );
}

export function WhatsAppIcon({ size = 20, ...props }: Props) {
  return (
    <svg {...base(size)} fill="currentColor" {...props}>
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.2 1.2-1.7 1.2-.5.1-1 .1-1.7-.1a12 12 0 0 1-4.9-3.6 8.6 8.6 0 0 1-1.6-3.2c-.1-.6 0-1.2.3-1.6.2-.3.5-.6.8-.6h.6c.2 0 .4.1.5.4l.7 1.7c.1.2 0 .4-.1.5l-.4.5c-.1.2-.2.3 0 .5.5 1 1.4 1.8 2.4 2.3.2.1.4.1.5-.1l.5-.6c.1-.2.3-.2.5-.1l1.6.8c.2.1.3.2.4.4 0 .1 0 .4-.2.8z" />
    </svg>
  );
}

export function AparatIcon({ size = 20, ...props }: Props) {
  return (
    <svg {...base(size)} fill="currentColor" {...props}>
      <path d="M12 2.2c1.4 0 2.5 1.1 2.5 2.5S13.4 7.2 12 7.2 9.5 6.1 9.5 4.7 10.6 2.2 12 2.2zM4.7 9.5c1.4 0 2.5 1.1 2.5 2.5s-1.1 2.5-2.5 2.5S2.2 13.4 2.2 12s1.1-2.5 2.5-2.5zm14.6 0c1.4 0 2.5 1.1 2.5 2.5s-1.1 2.5-2.5 2.5-2.5-1.1-2.5-2.5 1.1-2.5 2.5-2.5zM12 16.8c1.4 0 2.5 1.1 2.5 2.5s-1.1 2.5-2.5 2.5-2.5-1.1-2.5-2.5 1.1-2.5 2.5-2.5z" />
    </svg>
  );
}

export const SOCIAL_ICONS = {
  instagram: InstagramIcon,
  send: TelegramIcon,
  'message-circle': WhatsAppIcon,
  play: AparatIcon,
} as const;

export type SocialIconKey = keyof typeof SOCIAL_ICONS;
