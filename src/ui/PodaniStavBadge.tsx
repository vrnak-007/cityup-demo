import type { PodaniStav } from '../data/types'

export const STAV_META: Record<PodaniStav, { label: string; color: string }> = {
  novy: { label: 'Nový', color: 'var(--gov-blue)' },
  zaplaceno: { label: 'Zaplaceno', color: 'var(--gov-blue)' },
  reseni: { label: 'V řešení', color: 'var(--warning)' },
  vraceno: { label: 'Vráceno k doplnění', color: 'var(--error)' },
  vyrizeno: { label: 'Vyřízeno', color: 'var(--success)' },
}

export function PodaniStavBadge({ stav }: { stav: PodaniStav }) {
  const { label, color } = STAV_META[stav]
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap text-label font-medium text-ink">
      <span
        className="h-2 w-2 shrink-0 rounded-full"
        style={{ backgroundColor: color }}
        aria-hidden="true"
      />
      {label}
    </span>
  )
}
