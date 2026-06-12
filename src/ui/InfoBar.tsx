import type { ReactNode } from 'react'

// Notice strip for „vize" screens — features that need a later integration phase.
export function InfoBar({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-2 rounded-btn border border-line bg-gov-blue-tint px-4 py-2">
      <span
        className="mt-[2px] h-2 w-2 shrink-0 rounded-full"
        style={{ backgroundColor: 'var(--warning)' }}
      />
      <p className="text-caption text-ink">{children}</p>
    </div>
  )
}
