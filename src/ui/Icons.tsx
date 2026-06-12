// Inline outline icons — 20px, stroke 1.75, currentColor. No emoji anywhere in the UI.
import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

function base({ size = 20, ...props }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.75,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    ...props,
  }
}

export const ShieldIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
)

export const QrIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="4" y="4" width="6" height="6" rx="1" />
    <rect x="14" y="4" width="6" height="6" rx="1" />
    <rect x="4" y="14" width="6" height="6" rx="1" />
    <path d="M14 14h2v2M20 14v6M14 20h2" />
  </svg>
)

export const MapPinIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 21s7-5.5 7-11a7 7 0 10-14 0c0 5.5 7 11 7 11z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
)

export const CalendarIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="4" y="5" width="16" height="16" rx="2" />
    <path d="M4 9h16M8 3v4M16 3v4" />
  </svg>
)

export const DocumentIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M7 3h7l5 5v13a0 0 0 01 0 0H7a1 1 0 01-1-1V4a1 1 0 011-1z" />
    <path d="M14 3v5h5M9 13h6M9 17h6" />
  </svg>
)

export const BellIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M6 9a6 6 0 0112 0c0 5 2 6 2 6H4s2-1 2-6z" />
    <path d="M10 19a2 2 0 004 0" />
  </svg>
)

export const DogIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M10 5l-2 2v3l-3 1v4l3 1v3h3v-3h3v3h3v-7l-2-2V5l-3 2-2-2z" />
    <path d="M16 11h.01" />
  </svg>
)

export const TrashIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M5 7h14M9 7V5h6v2M7 7l1 13h8l1-13" />
  </svg>
)

export const ChatIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M5 5h14a1 1 0 011 1v9a1 1 0 01-1 1H9l-4 3V6a1 1 0 011-1z" />
  </svg>
)

export const ChevronRightIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M9 6l6 6-6 6" />
  </svg>
)

export const CheckIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M5 12l5 5L19 7" />
  </svg>
)

export const ArrowLeftIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M15 6l-6 6 6 6M9 12h11" />
  </svg>
)

export const ClockIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8" />
    <path d="M12 8v4l3 2" />
  </svg>
)

export const CameraIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 8h3l2-2h6l2 2h3v11H4z" />
    <circle cx="12" cy="13" r="3.5" />
  </svg>
)

export const PaperclipIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M20 12l-8.5 8.5a4 4 0 01-6-6L13 6a2.5 2.5 0 014 3l-8 8a1 1 0 01-1.5-1.5L14 9" />
  </svg>
)

export const ChartIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M5 5v14h14" />
    <path d="M8 14l3-4 3 2 4-6" />
  </svg>
)

export const UserIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="8" r="3.5" />
    <path d="M5 20c0-3.5 3-5 7-5s7 1.5 7 5" />
  </svg>
)

export const BuildingIcon = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M5 21V4a1 1 0 011-1h8a1 1 0 011 1v17M15 9h3a1 1 0 011 1v11" />
    <path d="M8 7h4M8 11h4M8 15h4M3 21h18" />
  </svg>
)
