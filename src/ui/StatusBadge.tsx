import type { SubmissionStatus } from '../lib/types'

const map: Record<
  SubmissionStatus,
  { label: string; color: string }
> = {
  novy: { label: 'Nový', color: 'var(--gov-blue)' },
  reseni: { label: 'V řešení', color: 'var(--warning)' },
  vyrizeno: { label: 'Vyřešeno', color: 'var(--success)' },
}

export function StatusBadge({ status }: { status: SubmissionStatus }) {
  const { label, color } = map[status]
  return (
    <span className="inline-flex items-center gap-2 text-label font-medium text-ink">
      <span
        className="h-2 w-2 shrink-0 rounded-full"
        style={{ backgroundColor: color }}
        aria-hidden="true"
      />
      {label}
    </span>
  )
}

export const STATUS_COLOR: Record<SubmissionStatus, string> = {
  novy: 'var(--gov-blue)',
  reseni: 'var(--warning)',
  vyrizeno: 'var(--success)',
}
